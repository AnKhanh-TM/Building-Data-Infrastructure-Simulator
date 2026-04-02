import type { GameState } from '../types/game';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trophy, RefreshCcw, Medal } from 'lucide-react';

interface ScreenProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
  nextStep: () => void; // Used as Reset function here
}

export const Screen7Result = ({ state, updateState, nextStep }: ScreenProps) => {
  // Add 10 pts for completion basically
  const finalScore = state.score.info + state.score.sources + state.score.pipeline + 
                     state.score.warehouse + state.score.dataModel + state.score.dashboard + 10;

  let rank = '';
  let rankColor = '';
  let feedback = '';

  if (finalScore >= 90) {
    rank = 'Data Strategy Thinker';
    rankColor = 'text-yellow-600 bg-yellow-100 border-yellow-300';
    feedback = 'Tuyệt vời! Bạn có tư duy xây dựng hệ thống dữ liệu rất vững vàng, xuất phát từ nghiệp vụ và hiểu rõ từng thành phần kỹ thuật cơ bản.';
  } else if (finalScore >= 75) {
    rank = 'Business-driven Analyst';
    rankColor = 'text-blue-600 bg-blue-100 border-blue-300';
    feedback = 'Rất tốt! Bạn hiểu bức tranh tổng thể và biết cách kết nối câu hỏi kinh doanh với dữ liệu. Cần chú trọng thêm một chút về Data Model.';
  } else if (finalScore >= 60) {
    rank = 'Emerging Data Manager';
    rankColor = 'text-green-600 bg-green-100 border-green-300';
    feedback = 'Khá ổn. Bạn đã nắm được luồng cơ bản nhưng cần thực hành sâu hơn việc kết nối giữa mục tiêu Business và thiết kế cấu trúc hệ thống.';
  } else {
    rank = 'Need More Practice';
    rankColor = 'text-slate-600 bg-slate-100 border-slate-300';
    feedback = 'Bạn cần xem lại các khái niệm cơ bản về sự liền mạch của: Source -> Pipeline -> Warehouse -> Model -> Dashboard nhé.';
  }

  return (
    <div className="w-full max-w-3xl mx-auto pb-10">
      <Card className="overflow-hidden shadow-2xl border-0 ring-1 ring-slate-200">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 text-white p-10 text-center relative overflow-hidden">
          {/* Confetti decoration idea */}
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Trophy size={120} />
          </div>
          
          <div className="relative z-10">
            <Trophy size={56} className="mx-auto mb-4 text-brand-100" />
            <h2 className="text-3xl font-extrabold mb-2">Hoàn Thành Thử Thách!</h2>
            <p className="text-brand-100 text-lg">
              Chúc mừng <strong>{state.profile.name}</strong> (Lớp {state.profile.classCode})
            </p>
          </div>
        </div>

        <div className="p-10 bg-white">
          <div className="flex flex-col items-center mb-8">
            <span className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-2">Điểm / Rank</span>
            <div className="text-6xl font-black text-slate-800 mb-4">{finalScore} / 100</div>
            <div className={`px-6 py-2 rounded-full border-2 font-bold text-lg flex items-center gap-2 ${rankColor}`}>
              <Medal size={24} /> {rank}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8 mt-4 whitespace-pre-wrap text-slate-700 leading-relaxed text-center">
            {feedback}
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-slate-800 text-center mb-4 uppercase tracking-wider text-sm">Key Takeaways</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-medium rounded border border-brand-100">1. Business Objective</span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-medium rounded border border-brand-100">2. Data Sources</span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-medium rounded border border-brand-100">3. Pipeline</span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-medium rounded border border-brand-100">4. Warehouse</span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-medium rounded border border-brand-100">5. Data Model</span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-medium rounded border border-brand-100">6. Dashboard</span>
            </div>
            <p className="text-center text-sm text-slate-500 font-medium italic mt-6">
              "Data Infrastructure không bắt đầu từ tool. Nó bắt đầu từ câu hỏi kinh doanh."
            </p>
          </div>

          <div className="flex justify-center pt-6 border-t border-slate-100">
            <Button variant="outline" size="lg" onClick={() => {
              localStorage.removeItem('data-game-state');
              nextStep();
            }} className="gap-2">
              <RefreshCcw size={18} /> Chơi lại từ đầu
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
