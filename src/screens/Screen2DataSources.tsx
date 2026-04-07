import { useState } from 'react';
import type { GameState } from '../types/game';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { GAME_CONTENT } from '../lib/constants';

interface ScreenProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
  nextStep: () => void;
}

export const Screen2DataSources = ({ state, updateState, nextStep }: ScreenProps) => {
  const isSubmitted = state.submittedSteps.includes(2);
  const [selectedSources, setSelectedSources] = useState<string[]>(state.selections.sources || []);
  const [mappings, setMappings] = useState<Record<string, string>>(state.selections.sourceQuestions || {});
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(isSubmitted);

  const toggleSource = (sourceId: string) => {
    if (isSubmitted) return;
    setSelectedSources(prev => {
      if (prev.includes(sourceId)) {
        const newMappings = { ...mappings };
        delete newMappings[sourceId];
        setMappings(newMappings);
        return prev.filter(id => id !== sourceId);
      }
      return [...prev, sourceId];
    });
    setError('');
  };

  const handleSelectQuestion = (sourceId: string, questionId: string) => {
    if (isSubmitted) return;
    setMappings(prev => ({ ...prev, [sourceId]: questionId }));
    setError('');
  };

  const handleSubmit = () => {
    if (selectedSources.length === 0) {
      setError('Hãy chọn những nguồn dữ liệu quan trọng nhất cho mục tiêu kinh doanh.');
      return;
    }

    const unmapped = selectedSources.filter(id => !mappings[id] && GAME_CONTENT.step2.correctMappings[id as keyof typeof GAME_CONTENT.step2.correctMappings]);
    if (unmapped.length > 0) {
      setError('Vui lòng chọn câu hỏi kinh doanh tương ứng cho các nguồn dữ liệu đã chọn.');
      return;
    }

    // Scoring logic (Plus 10 for correct, -5 for distractor)
    let score = 0;
    selectedSources.forEach(srcId => {
      const src = GAME_CONTENT.step2.sources.find(s => s.id === srcId);
      if (src?.correct) {
        // Correct source
        score += 10;
        // Check mapping if it's a core source
        if (GAME_CONTENT.step2.correctMappings[srcId as keyof typeof GAME_CONTENT.step2.correctMappings] !== mappings[srcId]) {
          score -= 5; // Penalty for wrong mapping
        }
      } else {
        // Distractor source
        score -= 5;
      }
    });

    // Floor at 0
    const finalScore = Math.max(0, score);

    updateState({
      score: { ...state.score, sources: finalScore },
      selections: { ...state.selections, sources: selectedSources, sourceQuestions: mappings },
      submittedSteps: [...state.submittedSteps, 2]
    });
    setShowFeedback(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Bước 1: Xác định Data Sources</h2>
        <p className="text-slate-600">
          Chọn các nguồn dữ liệu thô (Raw Data) cốt lõi nhất để giải quyết bài toán của Marketing Manager.
        </p>
      </div>

      <Card className="bg-amber-50 border-amber-200 p-4 flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <Info size={20} />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 mb-1 leading-none uppercase text-xs tracking-wider">Lưu ý trước khi nộp:</h4>
          <p className="text-sm text-amber-800 font-medium">
            Mục tiêu là "Hiểu thói quen mua hàng". Hãy suy nghĩ kỹ xem nguồn dữ liệu nào phản ánh đúng hành vi người dùng, 
            lịch sử mua và dữ liệu đa kênh. Đừng chọn những nguồn gây "nhiễu" không phục vụ mục tiêu chiến lược.
          </p>
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAME_CONTENT.step2.sources.map(source => {
          const isSelected = selectedSources.includes(source.id);
          const isCoreMappingCorrect = mappings[source.id] === GAME_CONTENT.step2.correctMappings[source.id as keyof typeof GAME_CONTENT.step2.correctMappings];
          
          return (
            <Card 
              key={source.id} 
              className={cn(
                "p-4 transition-all duration-300 border-2 relative overflow-hidden group",
                isSelected ? "border-brand-500 bg-brand-50/30" : "border-slate-200 hover:border-brand-200 cursor-pointer shadow-sm hover:shadow-md",
                showFeedback && source.correct && "border-green-500",
                showFeedback && isSelected && !source.correct && "border-red-400 bg-red-50/20",
                isSubmitted && "cursor-default"
              )}
            >
              <div 
                className={cn("flex flex-col gap-3", !isSubmitted && "cursor-pointer")}
                onClick={() => toggleSource(source.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
                    <span className="text-2xl brightness-110 group-hover:scale-110 transition-transform">{source.icon}</span>
                    <span className="font-bold text-slate-800 text-sm truncate">{source.label}</span>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0",
                    isSelected ? "bg-brand-500 border-brand-500 text-white shadow-sm" : "border-slate-300 bg-white"
                  )}>
                    {isSelected ? <CheckCircle2 size={12} strokeWidth={3} /> : <div className="w-1 h-1 bg-slate-200 rounded-full" />}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-3 border-t border-brand-100 flex flex-col gap-2 animate-in slide-in-from-top-2">
                   <select 
                    className={cn(
                      "w-full text-[11px] font-medium p-2 rounded border border-slate-200 bg-white text-slate-600 outline-none focus:ring-1 focus:ring-brand-500 transition-all",
                      isSubmitted && "bg-slate-50 cursor-not-allowed opacity-80"
                    )}
                    value={mappings[source.id] || ''}
                    onChange={(e) => handleSelectQuestion(source.id, e.target.value)}
                    disabled={isSubmitted}
                  >
                    <option value="" disabled>Gắn với câu hỏi gì?</option>
                    {GAME_CONTENT.step2.questions.map(q => (
                      <option key={q.id} value={q.id}>{q.text}</option>
                    ))}
                  </select>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
           <div className="bg-slate-800 p-4 text-white">
             <h3 className="font-bold flex items-center gap-2">
               <AlertCircle size={18} className="text-brand-400" />
               Phân tích chi tiết các lựa chọn
             </h3>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {GAME_CONTENT.step2.sources.map(s => {
                const isSelected = selectedSources.includes(s.id);
                return (
                  <div key={s.id} className={cn("p-4 rounded-xl border-l-4", s.correct ? "bg-green-50 border-green-400" : "bg-slate-50 border-slate-300")}>
                    <div className="flex items-center justify-between mb-2">
                       <span className="font-bold text-slate-800 flex items-center gap-2">
                         {s.icon} {s.label}
                       </span>
                       {isSelected ? (
                         s.correct ? <CheckCircle2 size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-500" />
                       ) : (
                         s.correct ? <AlertCircle size={16} className="text-amber-500" /> : null
                       )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">{s.reason}</p>
                  </div>
                );
              })}
           </div>
        </div>
      )}

      <div className="flex justify-center pt-8">
        {!isSubmitted ? (
          <Button onClick={handleSubmit} size="lg" className="px-10 h-14 bg-brand-600 hover:bg-brand-700 shadow-lg hover:shadow-brand-200/50 transition-all font-bold group">
            Nộp bài <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        ) : (
          <Button onClick={nextStep} size="lg" className="px-12 h-14 bg-green-600 hover:bg-green-700 shadow-xl hover:shadow-green-200 transition-all font-black uppercase tracking-widest flex items-center gap-3">
             Bước Tiếp Theo <ArrowRight size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};
