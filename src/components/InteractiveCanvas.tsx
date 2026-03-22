import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Pencil, Eraser, Undo2, Redo2, Circle, Minus, ArrowUpRight, MousePointer2, Trash2, Type } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface CanvasProps {
  className?: string;
}

export interface CanvasHandle {
  getCanvasImage: () => string;
}

type Tool = 'pencil' | 'eraser' | 'point' | 'line' | 'circle' | 'arrow' | 'text';

interface Path {
  type: Tool;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  text?: string;
}

export const InteractiveCanvas = forwardRef<CanvasHandle, CanvasProps>(({ className }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#3B82F6');
  const [paths, setPaths] = useState<Path[]>([]);
  const [redoStack, setRedoStack] = useState<Path[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [textInput, setTextInput] = useState<{ x: number; y: number; value: string } | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textInput && textInputRef.current) {
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [textInput]);

  const colors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Green', value: '#10B981' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Black', value: '#0F172A' },
  ];

  useImperativeHandle(ref, () => ({
    getCanvasImage: () => {
      const canvas = canvasRef.current;
      if (!canvas) return '';
      
      // Create a temporary canvas with white background and grid for export
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return '';

      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw grid on temp canvas
      drawGrid(tempCtx, tempCanvas.width, tempCanvas.height);
      
      // Draw paths
      tempCtx.lineCap = 'round';
      tempCtx.lineJoin = 'round';
      paths.forEach(p => drawPathOnCtx(tempCtx, p));

      return tempCanvas.toDataURL('image/png');
    }
  }));

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const step = 25; // 25px per unit

    ctx.strokeStyle = '#e2e8f0'; // slate-200
    ctx.lineWidth = 0.5;

    // Small grid (5px)
    for (let x = 0; x <= width; x += 5) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Unit grid (25px)
    ctx.strokeStyle = '#cbd5e1'; // slate-300
    ctx.lineWidth = 1;
    for (let x = centerX % step; x <= width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = centerY % step; y <= height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748b'; // slate-500
    ctx.lineWidth = 2;
    
    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Numbering
    ctx.fillStyle = '#475569'; // slate-600
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // X Axis Numbering (-100 to 100 mm)
    for (let i = -10; i <= 10; i++) {
      if (i === 0) continue;
      const x = centerX + i * step;
      const label = (i * 10).toString(); // Convert to mm
      if (x >= 0 && x <= width) {
        ctx.fillText(label, x, centerY + 5);
        // Tick
        ctx.beginPath();
        ctx.moveTo(x, centerY - 3);
        ctx.lineTo(x, centerY + 3);
        ctx.stroke();
      }
    }

    // Y Axis Numbering (-100 to 100 mm)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = -10; i <= 10; i++) {
      if (i === 0) continue;
      const y = centerY - i * step; // Invert Y for standard coordinate system
      const label = (i * 10).toString(); // Convert to mm
      if (y >= 0 && y <= height) {
        ctx.fillText(label, centerX - 5, y);
        // Tick
        ctx.beginPath();
        ctx.moveTo(centerX - 3, y);
        ctx.lineTo(centerX + 3, y);
        ctx.stroke();
      }
    }

    // Origin
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText("0", centerX - 5, centerY + 5);

    // Axis Labels
    ctx.font = 'italic bold 12px Inter, sans-serif';
    ctx.fillText("x (mm)", width - 10, centerY + 15);
    ctx.textAlign = 'left';
    ctx.fillText("y (mm)", centerX + 10, 15);
  };

  const drawPathOnCtx = (ctx: CanvasRenderingContext2D, path: Path) => {
    if (path.points.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.strokeStyle = path.color;
    ctx.fillStyle = path.color;
    ctx.lineWidth = path.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (path.type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }

    // Transform points to screen coordinates
    const screenPoints = path.points.map(p => ({
      x: centerX + p.x,
      y: centerY - p.y // Invert Y
    }));

    const start = screenPoints[0];
    const end = screenPoints[screenPoints.length - 1];

    switch (path.type) {
      case 'point':
        ctx.beginPath();
        ctx.arc(start.x, start.y, 4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'pencil':
      case 'eraser':
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        screenPoints.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        break;

      case 'line':
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;

      case 'circle':
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'arrow':
        const headlen = 10;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        break;

      case 'text':
        if (path.text) {
          ctx.font = 'bold 14px Inter, sans-serif';
          ctx.fillText(path.text, start.x, start.y);
        }
        break;
    }

    ctx.globalCompositeOperation = 'source-over';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        redraw();
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    redraw();
  }, [paths, currentPath]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid first
    drawGrid(ctx, canvas.width, canvas.height);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw all completed paths
    paths.forEach(p => drawPathOnCtx(ctx, p));

    // Draw current path
    if (currentPath.length > 0) {
      drawPathOnCtx(ctx, {
        type: tool,
        points: currentPath,
        color: tool === 'eraser' ? '#F8FAFC' : color,
        width: tool === 'eraser' ? 20 : 3
      });
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const screenY = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Convert to centered coordinates
    const x = screenX - centerX;
    const y = centerY - screenY; // Invert Y

    if (tool === 'text') {
      if (textInput) {
        handleTextSubmit(new Event('submit') as any);
      }
      setTextInput({ x, y, value: '' });
      return;
    }

    if (tool === 'point') {
      const newPath: Path = {
        type: 'point',
        points: [{ x, y }],
        color: color,
        width: 8
      };
      setPaths([...paths, newPath]);
      setRedoStack([]);
      return;
    }

    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const screenY = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Convert to centered coordinates
    const x = screenX - centerX;
    const y = centerY - screenY; // Invert Y

    if (tool === 'pencil' || tool === 'eraser') {
      setCurrentPath([...currentPath, { x, y }]);
    } else {
      // For shapes, we only need start and current end point
      setCurrentPath([currentPath[0], { x, y }]);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPath.length > 0) {
      const newPath: Path = {
        type: tool,
        points: currentPath,
        color: tool === 'eraser' ? '#F8FAFC' : color,
        width: tool === 'eraser' ? 20 : 3
      };
      setPaths([...paths, newPath]);
      setRedoStack([]);
    }
    setCurrentPath([]);
  };

  const undo = () => {
    if (paths.length === 0) return;
    const last = paths[paths.length - 1];
    setRedoStack([...redoStack, last]);
    setPaths(paths.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    setPaths([...paths, last]);
    setRedoStack(redoStack.slice(0, -1));
  };

  const clearCanvas = () => {
    if (window.confirm('Deseja limpar todo o papel milimetrado?')) {
      setPaths([]);
      setRedoStack([]);
      setTextInput(null);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput && textInput.value.trim()) {
      const newPath: Path = {
        type: 'text',
        points: [{ x: textInput.x, y: textInput.y }],
        color: color,
        width: 14,
        text: textInput.value
      };
      setPaths([...paths, newPath]);
      setRedoStack([]);
    }
    setTextInput(null);
  };

  return (
    <div className={cn("flex flex-col h-full gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
          <button
            onClick={() => setTool('pencil')}
            className={cn("p-2 rounded-lg transition-colors", tool === 'pencil' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Lápis"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => setTool('line')}
            className={cn("p-2 rounded-lg transition-colors", tool === 'line' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Reta"
          >
            <Minus size={20} />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={cn("p-2 rounded-lg transition-colors", tool === 'circle' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Círculo"
          >
            <Circle size={20} />
          </button>
          <button
            onClick={() => setTool('arrow')}
            className={cn("p-2 rounded-lg transition-colors", tool === 'arrow' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Seta"
          >
            <ArrowUpRight size={20} />
          </button>
          <button
            onClick={() => setTool('point')}
            className={cn("p-2 rounded-lg transition-colors", tool === 'point' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Marcar Ponto"
          >
            <MousePointer2 size={20} />
          </button>
          <button
            onClick={() => setTool('text')}
            className={cn("p-2 rounded-lg transition-colors", tool === 'text' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Texto"
          >
            <Type size={20} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={cn("p-2 rounded-lg transition-colors", tool === 'eraser' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Borracha"
          >
            <Eraser size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={cn(
                "w-6 h-6 rounded-full transition-transform hover:scale-110 active:scale-95",
                color === c.value && "ring-2 ring-offset-2 ring-slate-300 scale-110"
              )}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={undo} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg" title="Desfazer">
            <Undo2 size={20} />
          </button>
          <button onClick={redo} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg" title="Refazer">
            <Redo2 size={20} />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button onClick={clearCanvas} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Limpar Papel">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className={cn(
        "flex-1 bg-white rounded-3xl shadow-inner border border-slate-100 overflow-hidden relative min-h-[400px]",
        "cursor-crosshair"
      )}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full"
        />

        {textInput && (
          <form
            onSubmit={handleTextSubmit}
            className="absolute z-50 pointer-events-auto"
            style={{
              left: (canvasRef.current?.width || 0) / 2 + textInput.x,
              top: (canvasRef.current?.height || 0) / 2 - textInput.y,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <input
              ref={textInputRef}
              type="text"
              value={textInput.value}
              onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setTextInput(null);
              }}
              onBlur={(e) => {
                // Only blur if we didn't click on the submit button or something else inside
                if (textInput.value.trim()) {
                  handleTextSubmit(new Event('submit') as any);
                } else {
                  setTextInput(null);
                }
              }}
              className="px-3 py-2 bg-white border-2 border-blue-500 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] outline-none text-base font-bold text-slate-800 min-w-[150px]"
            />
          </form>
        )}
      </div>
    </div>
  );
});

InteractiveCanvas.displayName = 'InteractiveCanvas';
