import { useState } from 'react';
import type { GameState } from '../types/game';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Trophy,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart3,
  Lightbulb,
  Medal,
  Network
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GAME_CONTENT } from '../lib/constants';

interface ScreenProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
  nextStep: () => void;
}

export const Screen7Result = ({ state }: ScreenProps) => {
  const totalScore = Object.values(state.score).reduce((a, b) => a + b, 0);
  const [showReview, setShowReview] = useState(false);

  const handleRestart = () => {
    localStorage.removeItem('gameState');
    localStorage.removeItem('data-game-state');
    window.location.reload();
  };

  const getRank = (score: number) => {
    if (score >= 90) return { title: 'Data Strategy Thinker', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    if (score >= 75) return { title: 'Business-driven Analyst', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (score >= 60) return { title: 'Emerging Data Manager', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    return { title: 'Need More Practice', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };
  };

  const rank = getRank(totalScore);

  return (
    <div className="w-full max-w-4xl mx-auto pb-20">
      <Card className="p-10 text-center shadow-xl border-t-8 border-t-brand-500 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Trophy size={150} className="text-brand-500" />
        </div>

        <div className="relative z-10">
          <div className="mb-6 inline-flex p-4 rounded-full bg-brand-50 text-brand-600">
            <Trophy size={64} />
          </div>

          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Dự án hoàn tất!</h1>
          <p className="text-slate-600 text-lg mb-8 uppercase tracking-widest font-semibold">Kết quả giả lập hệ thống</p>

          <p className="text-slate-500 mb-6">
            Chúc mừng <strong>{state.profile.name}</strong> đã hoàn thành lộ trình thiết kế hạ tầng dữ liệu.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch mb-10 text-left">
            <div className="flex-1 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">Tổng điểm tích lũy</p>
              <p className="text-6xl font-black text-brand-600">{totalScore}<span className="text-2xl text-slate-400">/100</span></p>
            </div>
            <div className={cn("flex-1 p-6 rounded-2xl border flex flex-col justify-center", rank.bg, rank.border)}>
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">Danh hiệu đạt được</p>
              <div className="flex items-center gap-2">
                <Medal className={rank.color} size={24} />
                <p className={cn("text-xl font-bold leading-tight", rank.color)}>{rank.title}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setShowReview(!showReview)} variant="outline" className="gap-2 border-brand-500 text-brand-600 hover:bg-brand-50 px-8 py-6 text-lg font-bold">
              <BookOpen size={20} />
              {showReview ? 'Đóng xem lại' : 'Xem lại đáp án'}
            </Button>
            <Button onClick={handleRestart} className="gap-2 px-8 py-6 text-lg font-bold shadow-lg">
              <RotateCcw size={20} /> Thử lại từ đầu
            </Button>
          </div>
        </div>
      </Card>

      {showReview && (
        <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-5 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="text-brand-500" />
              Chi tiết lộ trình xử lý dữ liệu
            </h3>
          </div>

          {/* Step 1: Data Sources */}
          <ReviewItem
            title={GAME_CONTENT.step2.title}
            score={state.score.sources}
            maxScore={40}
            explanation="Mỗi Data Source giải quyết một câu hỏi kinh doanh đặc thù. Hiểu đúng Mapping này là nền tảng để thiết kế hệ thống có ý nghĩa."
          >
            <div className="space-y-3 mt-3">
              {Object.entries(GAME_CONTENT.step2.correctMappings).map(([srcId, correctQId]) => {
                const source = GAME_CONTENT.step2.sources.find(s => s.id === srcId);
                const correctQ = GAME_CONTENT.step2.questions.find(q => q.id === correctQId);
                const userQId = state.selections.sourceQuestions[srcId];
                const userQ = GAME_CONTENT.step2.questions.find(q => q.id === userQId);
                const isCorrect = userQId === correctQId;

                return (
                  <div key={srcId} className="flex flex-col gap-2 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2">
                       <span className="text-lg bg-slate-100 w-8 h-8 flex items-center justify-center rounded-lg">{source?.icon}</span>
                       <span className="font-bold text-slate-800">{source?.label}</span>
                    </div>
                    <div className="flex flex-col gap-1 ml-10">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-tighter w-12 shrink-0">BẠN CHỌN:</span>
                        <span className={cn("text-sm", isCorrect ? "text-green-600 font-medium" : "text-red-500 line-through")}>
                          {userQ?.text || 'Chưa trả lời'}
                        </span>
                        {isCorrect ? <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-600 shrink-0 mt-0.5" />}
                      </div>
                      {!isCorrect && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold text-green-600 mt-0.5 uppercase tracking-tighter w-12 shrink-0">ĐÁP ÁN:</span>
                          <span className="text-sm text-green-700 font-semibold italic">
                            {correctQ?.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ReviewItem>

          {/* Step 2: Pipeline */}
          <ReviewItem
            title={GAME_CONTENT.step3.title}
            score={state.score.pipeline}
            maxScore={10}
            explanation={GAME_CONTENT.step3.explanation}
          >
            <div className="mt-3 p-4 bg-white rounded-lg border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-slate-400">LỰA CHỌN:</span>
                {(() => {
                  const opt = GAME_CONTENT.step3.options.find(o => o.id === state.selections.pipelineAnswer);
                  const isCorrect = state.selections.pipelineAnswer === GAME_CONTENT.step3.correctId;
                  return (
                    <span className={cn("font-medium flex items-center gap-2", isCorrect ? "text-green-600" : "text-red-500")}>
                      {opt?.text || 'Chưa chọn'}
                      {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    </span>
                  );
                })()}
              </div>
              {state.selections.pipelineAnswer !== GAME_CONTENT.step3.correctId && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-green-600">ĐÁP ÁN ĐÚNG:</span>
                  <span className="text-green-700 font-bold italic">
                    {GAME_CONTENT.step3.options.find(o => o.id === GAME_CONTENT.step3.correctId)?.text}
                  </span>
                </div>
              )}
            </div>
          </ReviewItem>

          {/* Step 3: Warehouse */}
          <ReviewItem
            title={GAME_CONTENT.step4.title}
            score={state.score.warehouse}
            maxScore={10}
            explanation={GAME_CONTENT.step4.explanation}
          >
            <div className="mt-3 p-4 bg-white rounded-lg border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-slate-400">LỰA CHỌN:</span>
                {(() => {
                  const opt = GAME_CONTENT.step4.options.find(o => o.id === state.selections.warehouseAnswer);
                  const isCorrect = state.selections.warehouseAnswer === GAME_CONTENT.step4.correctId;
                  return (
                    <span className={cn("font-medium flex items-center gap-2", isCorrect ? "text-green-600" : "text-red-500")}>
                      {opt?.text || 'Chưa chọn'}
                      {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    </span>
                  );
                })()}
              </div>
              {state.selections.warehouseAnswer !== GAME_CONTENT.step4.correctId && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-green-600">ĐÁP ÁN ĐÚNG:</span>
                  <span className="text-green-700 font-bold italic">
                    {GAME_CONTENT.step4.options.find(o => o.id === GAME_CONTENT.step4.correctId)?.text}
                  </span>
                </div>
              )}
            </div>
          </ReviewItem>

          {/* Step 4: Data Model */}
          <ReviewItem
            title={GAME_CONTENT.step5.title}
            score={state.score.dataModel}
            maxScore={20}
            explanation={GAME_CONTENT.step5.explanation}
          >
            <div className="mt-3 p-4 bg-white rounded-lg border border-slate-100 space-y-2">
               <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Network size={16} className="text-brand-500" />
                  <strong>Cấu trúc chuẩn bao gồm:</strong>
               </div>
               <ul className="text-xs space-y-1 ml-6 text-slate-500 list-disc font-medium">
                  <li>Nối Orders (customer_id) sang bảng Customer</li>
                  <li>Nối Orders (product_id) sang bảng Product</li>
               </ul>
            </div>
          </ReviewItem>

          {/* Step 5: Dashboard */}
          <ReviewItem
            title={GAME_CONTENT.step6.title}
            score={state.score.dashboard}
            maxScore={20}
            explanation={GAME_CONTENT.step6.explanation}
          >
            <div className="mt-3 space-y-3">
              <div className="p-3 bg-white rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">Các chỉ số đã chọn:</span>
                <div className="flex flex-wrap gap-2">
                  {state.selections.dashboardKPIs.map(kpiId => (
                    <span key={kpiId} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                      {kpiId === 'revenue' ? 'Doanh thu' : kpiId === 'aov' ? 'AOV' : kpiId === 'conversion' ? 'Tỉ lệ chuyển đổi' : kpiId === 'frequency' ? 'Tần suất mua' : kpiId === 'segments' ? 'Phân khúc top' : kpiId}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">ĐỐI TƯỢNG (AUDIENCE)</span>
                  <span className={cn("text-xs font-bold", state.selections.dashboardADO?.audience === 'marketing_manager' ? "text-green-600" : "text-red-500")}>
                    {state.selections.dashboardADO?.audience === 'marketing_manager' ? 'Marketing Manager (Đúng)' : 'Chưa chính xác'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">CHIA NHỎ (BREAKDOWN)</span>
                  <span className={cn("text-xs font-bold", state.selections.dashboardADO?.breakdown === 'time_segment' ? "text-green-600" : "text-red-500")}>
                    {state.selections.dashboardADO?.breakdown === 'time_segment' ? 'Time & Segment (Đúng)' : 'Chưa chính xác'}
                  </span>
                </div>
              </div>
            </div>
          </ReviewItem>

          <div className="p-8 bg-slate-800 rounded-2xl text-white mt-10">
            <h4 className="flex items-center gap-2 text-xl font-bold mb-4">
              <Lightbulb className="text-amber-400" />
              Lời khuyên từ Data Mentor
            </h4>
            <p className="text-slate-300 leading-relaxed mb-4">
              Xây dựng hạ tầng dữ liệu không chỉ là câu chuyện kỹ thuật, mà là câu chuyện giải quyết bài toán kinh doanh. Nếu không bắt đầu từ
              <strong> Mục tiêu kinh doanh</strong>, bạn sẽ lạc trong mớ hỗn độn của hàng nghìn bảng biểu mà không rút ra được giá trị gì.
            </p>
            <p className="text-brand-400 font-bold italic">Chúc bạn sớm trở thành Data-Driven Manager chuyên nghiệp!</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface ReviewItemProps {
  title: string;
  score: number;
  maxScore: number;
  explanation: string;
  children?: React.ReactNode;
}

const ReviewItem = ({ title, score, maxScore, explanation, children }: ReviewItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isPerfect = score === maxScore;

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", isPerfect ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
            {isPerfect ? <CheckCircle2 size={20} /> : <BarChart3 size={20} />}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm md:text-base">{title}</h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">SCORE: {score}/{maxScore}</span>
            </div>
          </div>
        </div>
        {isOpen ? <ChevronDown className="text-slate-400" /> : <ChevronRight className="text-slate-400" />}
      </div>

      {isOpen && (
        <div className="px-6 md:px-14 pb-5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 mb-2">
            <p className="font-bold text-brand-600 mb-1 flex items-center gap-1 uppercase text-[10px] tracking-widest">
              Gợi ý & Giải thích
            </p>
            {explanation}
          </div>
          {children}
        </div>
      )}
    </Card>
  );
};
