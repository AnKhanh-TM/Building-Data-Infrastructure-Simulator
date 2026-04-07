import { useState } from 'react';
import type { GameState } from '../types/game';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Server, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScreenProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
  nextStep: () => void;
}

const OPTIONS = [
  { id: 'warehouse', text: 'Đưa vào lưu trữ tại Data Warehouse' },
  { id: 'dashboard', text: 'Đưa thẳng lên Dashboard' },
  { id: 'ml', text: 'Xây dựng Machine Learning Model dự đoán' },
  { id: 'ppt', text: 'Vẽ biểu đồ bằng Excel để báo cáo ngay' },
];

export const Screen4Warehouse = ({ state, updateState, nextStep }: ScreenProps) => {
  const isSubmitted = state.submittedSteps.includes(4);
  const [selected, setSelected] = useState<string>(state.selections.warehouseAnswer || '');
  const [showFeedback, setShowFeedback] = useState(isSubmitted);

  const isCorrect = selected === 'warehouse';

  const handleSubmit = () => {
    if (!selected) return;

    const score = isCorrect ? 5 : 0;

    updateState({
      score: { ...state.score, warehouse: score },
      selections: { ...state.selections, warehouseAnswer: selected },
      submittedSteps: [...state.submittedSteps, 4]
    });
    setShowFeedback(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-8 shadow-lg border-t-4 border-t-indigo-500 relative overflow-hidden">

        {/* Background icon decoration */}
        <Server className="absolute -right-8 -bottom-8 text-slate-100 opacity-50" size={150} />

        <div className="relative z-10">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
              Bước 3: Lưu trữ
            </span>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Dịch chuyển dữ liệu đi đâu?
            </h2>
            <p className="text-slate-600">
              Sau khi Data Pipeline đã hút dữ liệu từ nhiều nguồn, ta cần đưa khối dữ liệu này vào đâu?
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {OPTIONS.map(opt => (
              <div
                key={opt.id}
                onClick={() => {
                  if (!isSubmitted) {
                    setSelected(opt.id);
                  }
                }}
                className={cn(
                  "p-4 rounded-lg border-2 transition-colors flex items-center gap-3",
                  !isSubmitted && "cursor-pointer hover:border-slate-300",
                  selected === opt.id
                    ? "border-indigo-500 bg-indigo-50 font-medium text-indigo-900"
                    : "border-slate-200 text-slate-700",
                  showFeedback && selected === opt.id && !isCorrect && "border-red-500 bg-red-50 text-red-700",
                  showFeedback && selected === opt.id && isCorrect && "border-green-500 bg-green-50 text-green-700"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                  selected === opt.id ? "border-indigo-500 bg-white" : "border-slate-300"
                )}>
                  {selected === opt.id && <div className={cn("w-2.5 h-2.5 rounded-full", isCorrect && showFeedback ? "bg-green-500" : !isCorrect && showFeedback ? "bg-red-500" : "bg-indigo-500")} />}
                </div>
                {opt.text}
              </div>
            ))}
          </div>

          {showFeedback && (
            <div className={cn(
              "p-4 rounded-lg mb-6 flex gap-3 animate-in fade-in duration-300",
              isCorrect ? "bg-green-100/50 text-green-800" : "bg-red-100/50 text-red-800"
            )}>
              {isCorrect ? <CheckCircle2 className="flex-shrink-0 text-green-600" /> : <XCircle className="flex-shrink-0 text-red-600" />}
              <div>
                <p className="font-semibold mb-1">{isCorrect ? 'Chính xác!' : 'Chưa hợp lý!'}</p>
                <p className="text-sm">
                  {isCorrect
                    ? "Data Pipeline chỉ làm nhiệm vụ vận chuyển. Data Warehouse mới là nơi lưu trữ dữ liệu tập trung, được thiết kế tối ưu để sẵn sàng cho việc query phân tích lượng Data lớn."
                    : "Dữ liệu mới hút về còn thô, chưa kết nối và chưa được tối ưu. Cần có nơi lưu trữ trung gian chuyên biệt như Data Warehouse trước khi đưa lên dashboard."}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-slate-100">
            {!isSubmitted ? (
              <Button onClick={handleSubmit} disabled={!selected} className="gap-2">
                Nộp bài <ArrowRight size={20} />
              </Button>
            ) : (
              <Button onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                Tiếp tục <ArrowRight size={20} />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
