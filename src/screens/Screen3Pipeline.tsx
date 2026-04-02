import { useState } from 'react';
import type { GameState } from '../types/game';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DatabaseZap, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScreenProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
  nextStep: () => void;
}

const OPTIONS = [
  { id: 'dashboard', text: 'Xây dựng Dashboard luôn để sếp xem' },
  { id: 'warehouse', text: 'Tạo ngay các cột dữ liệu trong Data Warehouse' },
  { id: 'pipeline', text: 'Lấy dữ liệu từ các nguồn bằng Data Pipeline' },
];

export const Screen3Pipeline = ({ state, updateState, nextStep }: ScreenProps) => {
  const [selected, setSelected] = useState<string>(state.selections.pipelineAnswer || '');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const isCorrect = selected === 'pipeline';

  const handleSubmit = () => {
    if (!selected) return;
    setHasSubmitted(true);
    if (!isCorrect) {
      setAttempts(prev => prev + 1);
    }
  };

  const handleNext = () => {
    // Score logic: 10 pts max, minus 3 per wrong attempt
    const score = Math.max(10 - (attempts * 3), 0);
    
    updateState({
      score: { ...state.score, pipeline: score },
      selections: { ...state.selections, pipelineAnswer: selected }
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-8 shadow-lg border-t-4 border-t-brand-500 relative overflow-hidden">
        
        {/* Background icon decoration */}
        <DatabaseZap className="absolute -right-8 -bottom-8 text-slate-100 opacity-50" size={150} />

        <div className="relative z-10">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
              Bước 2: Thu thập
            </span>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Sau khi có Data Sources thì làm gì tiếp?
            </h2>
            <p className="text-slate-600">
              Giờ bạn đã xác định được GA4, CRM, POS... Cần làm gì tiếp theo để xử lý mớ dữ liệu đó?
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {OPTIONS.map(opt => (
              <div 
                key={opt.id}
                onClick={() => {
                  if (!hasSubmitted || !isCorrect) {
                    setSelected(opt.id);
                    setHasSubmitted(false); // reset view to allow resubmit
                  }
                }}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-colors flex items-center gap-3",
                  selected === opt.id 
                    ? "border-brand-500 bg-brand-50 font-medium text-brand-900" 
                    : "border-slate-200 hover:border-slate-300 text-slate-700",
                  hasSubmitted && selected === opt.id && !isCorrect && "border-red-500 bg-red-50 text-red-700",
                  hasSubmitted && selected === opt.id && isCorrect && "border-green-500 bg-green-50 text-green-700"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                  selected === opt.id ? "border-brand-500 bg-white" : "border-slate-300"
                )}>
                  {selected === opt.id && <div className="w-2.5 h-2.5 bg-brand-500 rounded-full" />}
                </div>
                {opt.text}
              </div>
            ))}
          </div>

          {hasSubmitted && (
            <div className={cn(
              "p-4 rounded-lg mb-6 flex gap-3 animate-in fade-in duration-300",
              isCorrect ? "bg-green-100/50 text-green-800" : "bg-red-100/50 text-red-800"
            )}>
              {isCorrect ? <CheckCircle2 className="flex-shrink-0" /> : <XCircle className="flex-shrink-0" />}
              <div>
                <p className="font-semibold mb-1">{isCorrect ? 'Chính xác!' : 'Chưa đúng, thử lại nhé!'}</p>
                <p className="text-sm">
                  {isCorrect 
                    ? "Sau khi biết dữ liệu nằm ở đâu, ta phải có cơ chế thu thập và di chuyển dữ liệu (tự động hóa) về một nơi lưu trữ trung tâm."
                    : "Dashboard chỉ nên được xây khi dữ liệu đã được thu thập và chuẩn hóa. Trước tiên, dữ liệu phải được lấy từ các sources."}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-slate-100">
            {!hasSubmitted || !isCorrect ? (
              <Button onClick={handleSubmit} disabled={!selected}>
                Kiểm tra đáp án
              </Button>
            ) : (
              <Button onClick={handleNext} className="gap-2">
                Tiếp tục <ArrowRight size={20} />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
