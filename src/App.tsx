import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  BookOpen, 
  FlaskConical, 
  ClipboardList, 
  Calculator, 
  MessageSquare, 
  Download,
  FileText,
  User,
  Calendar,
  GraduationCap,
  Zap,
  ArrowRight,
  ChevronLeft,
  Settings,
  Trash2,
  Plus
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { InteractiveCanvas, CanvasHandle } from './components/InteractiveCanvas';
import { FieldCalculator } from './components/FieldCalculator';
import { ExperimentalDataEntry, ExperimentalData } from './components/ExperimentalDataEntry';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

// --- Components ---

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/experimento') {
      navigate(`/experimento#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
      <div className="max-w-5xl mx-auto px-6 flex items-center h-14 justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 leading-tight">
              Exp. 2 – Superfícies Equipotenciais
            </p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider leading-tight">DFTE/UFRN</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <nav className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <button 
              onClick={() => scrollToSection('roteiro')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Roteiro
            </button>
            <span className="w-1 h-1 rounded-full bg-slate-200" />
            <button 
              onClick={() => scrollToSection('coleta')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Coleta
            </button>
            <span className="w-1 h-1 rounded-full bg-slate-200" />
            <button 
              onClick={() => scrollToSection('analise')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Análise
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-2xl w-full space-y-12"
        >
          <div className="space-y-6">
            <div className="mx-auto w-24 h-24 rounded-[32px] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap className="w-12 h-12 text-white relative z-10" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                Superfícies<br />Equipotenciais
              </h1>
              <p className="text-lg text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                Mapeamento experimental de potenciais e linhas de campo elétrico em meios condutores.
              </p>
            </div>
          </div>

          <div className="pt-8 space-y-8">
            <button
              onClick={() => navigate("/identificacao")}
              className="bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 text-sm font-black uppercase tracking-widest px-12 py-6 mx-auto cursor-pointer group"
            >
              Iniciar Experimento
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const IdentificationPage = ({ 
  turma, setTurma, 
  professor, setProfessor, 
  date, setDate, 
  members, setMembers 
}: { 
  turma: string, setTurma: (v: string) => void,
  professor: string, setProfessor: (v: string) => void,
  date: string, setDate: (v: string) => void,
  members: string[], setMembers: (v: string[]) => void
}) => {
  const navigate = useNavigate();
  
  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-16 space-y-16">
        <div className="space-y-4">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <ChevronLeft size={14} />
            Voltar ao Início
          </button>
          <div className="space-y-1">
            <div className="space-y-0.5 mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Universidade Federal do Rio Grande do Norte</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Centro de Ciências Exatas e da Terra</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Departamento de Física Teórica e Experimental</p>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Identificação do Grupo</h2>
            <p className="text-slate-500 text-lg">Insira os dados da turma e dos componentes para o relatório.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-10">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-slate-200 pb-3">Dados da Disciplina</h4>
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Turma</label>
                  <input 
                    type="text" 
                    value={turma}
                    onChange={(e) => setTurma(e.target.value)}
                    placeholder=""
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-xl font-bold placeholder:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Professor(a)</label>
                  <input 
                    type="text" 
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    placeholder=""
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-xl font-bold placeholder:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Data do Experimento</label>
                  <input 
                    type="text" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder=""
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-xl font-bold placeholder:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-slate-200 pb-3">Componentes do Grupo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {members.map((member: string, i: number) => (
                  <div key={i} className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Membro {i + 1}
                    </label>
                    <input 
                      type="text" 
                      value={member}
                      onChange={(e) => handleMemberChange(i, e.target.value)}
                      placeholder=""
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium placeholder:text-slate-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 flex justify-end items-center">
          <button
            onClick={() => navigate("/experimento")}
            className="bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 text-sm font-bold px-12 py-5 cursor-pointer group"
          >
            PROSSEGUIR PARA O ROTEIRO
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>
    </div>
  );
};

// SVG Diagram Components
const ConductorConfig = ({ activeConfig, onSelect }: { activeConfig?: string, onSelect?: (id: string) => void }) => {
  const configs = [
    { id: 'placas', label: 'Placas Paralelas', icon: (
      <div className="w-full h-full relative flex items-center justify-around">
        <div className="w-1 h-16 bg-slate-800 rounded-full" />
        <div className="w-1 h-16 bg-slate-800 rounded-full" />
      </div>
    )},
    { id: 'pinos', label: 'Dois Pinos', icon: (
      <div className="w-full h-full relative flex items-center justify-around">
        <div className="w-3 h-3 bg-slate-800 rounded-full" />
        <div className="w-3 h-3 bg-slate-800 rounded-full" />
      </div>
    )},
    { id: 'placa-pino', label: 'Placa e Pino', icon: (
      <div className="w-full h-full relative flex items-center justify-around">
        <div className="w-1 h-16 bg-slate-800 rounded-full" />
        <div className="w-3 h-3 bg-slate-800 rounded-full" />
      </div>
    )},
    { id: 'placa-pino-central', label: 'Placa e Pino Central', icon: (
      <div className="w-full h-full relative flex items-center justify-around">
        <div className="w-1 h-16 bg-slate-800 rounded-full" />
        <div className="w-3 h-3 bg-slate-800 rounded-full" />
      </div>
    )}
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
      {configs.map((cfg) => (
        <button 
          key={cfg.id} 
          onClick={() => onSelect?.(cfg.id)}
          className={cn(
            "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer group",
            activeConfig === cfg.id ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/30"
          )}
        >
          <div className="w-full aspect-video bg-white border border-slate-200 rounded-lg relative flex items-center justify-center group-hover:border-blue-200 transition-colors">
            {cfg.icon}
            <span className="absolute top-1 left-2 text-[8px] font-black text-slate-300">+</span>
            <span className="absolute top-1 right-2 text-[8px] font-black text-slate-300">-</span>
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest text-center",
            activeConfig === cfg.id ? "text-blue-600" : "text-slate-400 group-hover:text-blue-400"
          )}>{cfg.label}</span>
        </button>
      ))}
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Main App ---
export default function App() {
  const [turma, setTurma] = useState('');
  const [professor, setProfessor] = useState('');
  const [date, setDate] = useState('');
  const [members, setMembers] = useState(['', '', '', '', '']);
  const [answers, setAnswers] = useState({ q1: '', q2: '' });
  const [configs, setConfigs] = useState<ExperimentalData[]>([
    {
      id: 'config-1',
      config: 'placas',
      points: [],
      plateDistance: '',
      plateDistanceUncertainty: '',
      coordUncertainty: '',
      voltageUncertainty: '',
      fieldMeasurements: [],
    }
  ]);

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/identificacao" element={
          <IdentificationPage 
            turma={turma} setTurma={setTurma}
            professor={professor} setProfessor={setProfessor}
            date={date} setDate={setDate}
            members={members} setMembers={setMembers}
          />
        } />
        <Route path="/experimento" element={
          <ExperimentContent 
            turma={turma} professor={professor} date={date} members={members} setMembers={setMembers}
            answers={answers} setAnswers={setAnswers}
            configs={configs} setConfigs={setConfigs}
          />
        } />
      </Routes>
    </Router>
  );
}

function ExperimentContent({ 
  turma, professor, date, members, setMembers,
  answers, setAnswers, 
  configs, setConfigs 
}: any) {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);

  const addConfig = () => {
    setConfigs([...configs, {
      id: Math.random().toString(36).substr(2, 9),
      config: 'placas',
      points: [],
      plateDistance: '',
      plateDistanceUncertainty: '',
      fieldMeasurements: [],
    }]);
  };

  const removeConfig = (id: string) => {
    if (configs.length > 1) {
      setConfigs(configs.filter(c => c.id !== id));
    }
  };

  const updateConfig = (id: string, data: ExperimentalData) => {
    setConfigs(configs.map(c => c.id === id ? data : c));
  };

  const exportToPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      // Small delay to ensure any UI states are settled
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const imgData = await toPng(reportRef.current, {
        quality: 0.95,
        backgroundColor: '#F8FAFC'
      });
      
      if (!imgData) throw new Error('Falha ao capturar imagem do relatório');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Relatorio_Experimento_2_${date.replace(/\//g, '-') || 'sem-data'}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-blue-100 selection:text-blue-900 pb-20">
        <Header />
        
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-8 pt-8 print:hidden">
          <button 
            onClick={() => navigate("/identificacao")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <ChevronLeft size={18} />
            Voltar à Identificação
          </button>
        </div>

      {/* Floating Export Button */}
      <button 
        onClick={exportToPDF}
        disabled={isExporting}
        className={cn(
          "fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-full font-bold shadow-xl hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 print:hidden cursor-pointer",
          isExporting && "animate-pulse"
        )}
      >
        {isExporting ? <Download className="animate-bounce" /> : <FileText />}
        {isExporting ? "Gerando PDF..." : "Gerar Relatório PDF"}
      </button>

      <div 
        ref={reportRef} 
        className={cn(
          "mx-auto bg-white shadow-2xl shadow-slate-200 my-8 rounded-[32px] overflow-hidden border border-slate-100",
          isExporting ? "w-[1024px] max-w-none" : "max-w-4xl"
        )}
      >
        {/* Institutional Cover */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center p-16 text-center">
          <div className="space-y-12">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-blue-100">
              <Zap className="w-12 h-12 text-white" />
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1 mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Universidade Federal do Rio Grande do Norte</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Centro de Ciências Exatas e da Terra</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Departamento de Física Teórica e Experimental</p>
              </div>
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em]">Relatório de Atividade Experimental</p>
              <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-[0.85]">
                Superfícies<br />Equipotenciais
              </h1>
              <p className="text-slate-400 font-medium italic">Experimento 02</p>
            </div>
          </div>

          <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-16 text-left border-t border-slate-100 pt-16">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <span className="w-4 h-px bg-slate-900" /> Dados da Turma
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Turma</span>
                  <span className="text-sm font-bold text-slate-900">{turma || '—'}</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Professor</span>
                  <span className="text-sm font-bold text-slate-900">{professor || '—'}</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Data</span>
                  <span className="text-sm font-bold text-slate-900">{date || '—'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <span className="w-4 h-px bg-slate-900" /> Equipe
              </h4>
              <div className="space-y-3">
                {members.map((member: string, i: number) => member.trim() !== '' && (
                  <div key={i} className="flex items-center gap-3 border-b border-slate-100 pb-1">
                    <span className="text-[9px] font-black text-slate-300 uppercase">#{i+1}</span>
                    <span className="text-sm font-bold text-slate-900">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="px-16 space-y-32 pb-32">
          
          {/* Summary / Abstract */}
          <section className="space-y-8 bg-slate-50 p-12 rounded-[48px] border border-slate-100">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Resumo do Experimento</h2>
              <p className="text-xl font-bold text-slate-900 leading-relaxed">
                Este experimento visa o mapeamento gráfico de superfícies equipotenciais geradas por diferentes configurações de eletrodos imersos em um meio condutor, permitindo a visualização e análise das linhas de campo elétrico associadas.
              </p>
            </div>
          </section>

          {/* Introduction */}
          <section className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <BookOpen className="text-blue-600" /> Introdução
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full" />
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6 text-lg">
              <p>
                O conceito de potencial elétrico é fundamental para a compreensão do eletromagnetismo. Em uma região do espaço onde existe um campo elétrico, as superfícies equipotenciais são aquelas onde o potencial elétrico assume o mesmo valor em todos os pontos.
              </p>
              <p>
                Neste experimento, utilizaremos uma cuba com água (meio fracamente condutor) e diferentes eletrodos metálicos. Ao aplicar uma diferença de potencial entre os eletrodos, estabelece-se um campo elétrico no meio. Através de um multímetro, mapearemos pontos de mesmo potencial, permitindo traçar as curvas equipotenciais e, por consequência, as linhas de campo elétrico, que são sempre ortogonais a estas superfícies.
              </p>
            </div>
          </section>

          {/* Objectives */}
          <section id="roteiro" className="space-y-6 scroll-mt-20">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Target className="text-blue-500" /> Objetivos
            </h2>
            <ul className="space-y-4">
              {[
                "Desenvolver uma imagem visual das linhas de superfícies equipotenciais e do campo elétrico para duas configurações simples de dois objetos carregados.",
                "Determinar o campo elétrico a partir de linhas de potencial.",
                "Aprender a traçar as linhas de campo elétrico."
              ].map((obj, i) => (
                <li key={i} className="flex gap-4 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <p className="text-slate-700">{obj}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Theory */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <BookOpen className="text-blue-500" /> Fundamentação Teórica
            </h2>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-8">
              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Superfícies equipotenciais são regiões do espaço onde o potencial elétrico é constante. O campo elétrico é sempre perpendicular a estas superfícies e aponta no sentido do potencial decrescente.
                </p>
                <div className="p-8 bg-slate-50 rounded-2xl text-center border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Módulo do Campo Elétrico</p>
                  <div className="text-4xl font-serif italic text-slate-800">
                    |E| = |ΔV| / Δs
                  </div>
                  <p className="text-sm text-slate-500 mt-4">Onde ΔV é a mudança no potencial e Δs é a distância.</p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-50">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Referências</h4>
                <ul className="text-sm text-slate-500 italic space-y-2">
                  <li>• Halliday, D., Resnick, R., Walker, J. Fundamentos de Física 3 - 10ª ed. LTC, 2016.</li>
                  <li>• Tipler, P., Mosca, G. Física para cientistas e engenheiros – vol 2 - 6ª ed. LTC, 2009.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Materials */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <FlaskConical className="text-blue-500" /> Materiais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Fonte de alimentação DC variável - PHYWE",
                "Multímetro Digital - MINIPA",
                "Cuba eletrolítica (meio condutor)",
                "Objetos condutores: pinos e placas"
              ].map((mat, i) => (
                <div key={i} className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-slate-700 font-medium">{mat}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Procedimentos e Montagem */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ClipboardList className="text-blue-500" /> Procedimentos e Montagem
            </h2>
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Montagem Experimental", desc: "Fixe os eletrodos na cuba e conecte à fonte (10V DC). Adicione água até cobrir a base dos eletrodos (~15mm)." },
                  { title: "Mapeamento", desc: "Use a ponta de prova para achar 6 pontos de mesmo potencial. Marque-os no papel milimetrado e anote as coordenadas." },
                  { title: "Campo Elétrico", desc: "Meça a distância entre equipotenciais e calcule o módulo do campo usando ΔV/Δs." }
                ].map((step, i) => (
                  <div key={i} className="space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg shadow-slate-200">
                      {i + 1}
                    </div>
                    <h3 className="font-bold text-slate-800">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Experimental Sets */}
          {configs.map((config, index) => (
            <div key={config.id} className="space-y-12 pt-16 border-t border-slate-100 first:border-t-0 first:pt-0">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-900">Configuração #{index + 1}</h2>
                {!isExporting && configs.length > 1 && (
                  <button 
                    onClick={() => removeConfig(config.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={14} />
                    Remover Configuração
                  </button>
                )}
              </div>

              <ConductorConfig 
                activeConfig={config.config} 
                onSelect={(id: string) => updateConfig(config.id, { ...config, config: id as any })}
              />

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
                <div className="xl:col-span-2">
                  <ExperimentalDataEntry 
                    data={config} 
                    onChange={(newData) => updateConfig(config.id, newData)} 
                    isExporting={isExporting}
                  />
                </div>
                <div className="xl:col-span-3 space-y-8">
                  <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-[600px]">
                    <InteractiveCanvas />
                  </div>
                  <FieldCalculator isExporting={isExporting} />
                </div>
              </div>
            </div>
          ))}

          {!isExporting && (
            <div className="flex justify-center pt-8">
              <button 
                onClick={addConfig}
                className="flex items-center gap-3 px-8 py-6 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Plus size={24} />
                Adicionar Nova Configuração
              </button>
            </div>
          )}

          {/* Questions */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <MessageSquare className="text-blue-500" /> Perguntas Finais
              </h2>
            </div>
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-800">1. Compare os valores do campo elétrico calculados para os diferentes pares de equipotenciais na tabela de Coleta de Dados. Os resultados são consistentes? Explique eventuais discrepâncias.</h3>
                <textarea 
                  value={answers.q1}
                  onChange={(e) => setAnswers({...answers, q1: e.target.value})}
                  className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl h-40 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-600 leading-relaxed"
                  placeholder="Descreva sua análise aqui..."
                />
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-800">2. Como a geometria dos eletrodos (ex: placas vs. pinos) afeta a distribuição das linhas de campo e a curvatura das superfícies equipotenciais?</h3>
                <textarea 
                  value={answers.q2}
                  onChange={(e) => setAnswers({...answers, q2: e.target.value})}
                  className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl h-40 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-600 leading-relaxed"
                  placeholder="Descreva sua análise aqui..."
                />
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-24 text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} - Laboratório de Física Experimental - Eletromagnetismo - DFTE/UFRN</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
