import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Pencil, Eraser, Undo2, Redo2, Circle, Type, Minus, ArrowUpRight, MousePointer2 } from 'lucide-react';
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
    ctx.strokeStyle = '#e2e8f0'; // slate-200
    ctx.lineWidth = 0.5;

    // 10px grid
    for (let x = 0; x <= width; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 50px grid (bolder)
    ctx.strokeStyle = '#cbd5e1'; // slate-300
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawPathOnCtx = (ctx: CanvasRenderingContext2D, path: Path) => {
    if (path.points.length === 0) return;

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

    const start = path.points[0];
    const end = path.points[path.points.length - 1];

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
        path.points.forEach((point) => {
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
        const headlen = 10; // length of head in pixels
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
          ctx.font = 'bold 16px Inter, sans-serif';
          ctx.textBaseline = 'middle';
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
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

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

    if (tool === 'text') {
      const text = window.prompt('Digite o texto:');
      if (text) {
        const newPath: Path = {
          type: 'text',
          points: [{ x, y }],
          color: color,
          width: 16,
          text: text
        };
        setPaths([...paths, newPath]);
        setRedoStack([]);
      }
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
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

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
            onClick={() => setTool('text')}
            className={cn("p-2 rounded-lg transition-colors", tool === 'text' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Texto"
          >
            <Type size={20} />
          </button>
          <button
            onClick={() => setTool('point')}
            className={cn("p-2 rounded-lg transition-colors", tool === 'point' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
            title="Marcar Ponto"
          >
            <MousePointer2 size={20} />
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
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-inner border border-slate-100 overflow-hidden relative cursor-crosshair min-h-[400px]">
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
      </div>
    </div>
  );
});

InteractiveCanvas.displayName = 'InteractiveCanvas';
