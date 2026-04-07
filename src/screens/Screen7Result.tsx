import { useState, useMemo } from 'react';
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
  Network,
  AlertTriangle,
  History
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GAME_CONTENT } from '../lib/constants';

interface ScreenProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
  nextStep: () => void;
}

const ReviewItem = ({
  title,
  score,
  maxScore,
  children,
  explanation
}: {
  title: string;
  score: number;
  maxScore: number;
  children?: React.ReactNode;
  explanation?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden border border-slate-200">
      <div
        className={cn(
          "p-4 flex items-center justify-between cursor-pointer transition-colors",
          isExpanded ? "bg-slate-50" : "bg-white hover:bg-slate-50"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "min-w-fit px-3 h-8 rounded-lg flex items-center justify-center text-white font-bold whitespace-nowrap",
            score >= maxScore * 0.8 ? "bg-green-500" : score >= maxScore * 0.5 ? "bg-amber-500" : "bg-slate-400"
          )}>
            {score}/{maxScore}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">
              {score === maxScore ? 'Hoàn hảo' : score > 0 ? 'Thành công một phần' : 'Chưa đạt'}
            </p>
          </div>
        </div>
        {isExpanded ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
      </div>

      {isExpanded && (
        <div className="p-5 border-t border-slate-100 bg-white animate-in slide-in-from-top-1 duration-200">
          {explanation && (
            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
              "{explanation}"
            </div>
          )}
          {children}
        </div>
      )}
    </Card>
  );
};

export const Screen7Result = ({ state, nextStep }: ScreenProps) => {
  const totalScore = Object.values(state.score).reduce((a, b) => a + b, 0);
  const [showReview, setShowReview] = useState(false);

  const scoreDetails = useMemo(() => {
    const maxTotal = 100; // Target sum of 30+5+5+20+40
    const percentage = Math.round((totalScore / maxTotal) * 100);

    let rank = "Beginner Analyst";
    let color = "text-slate-500";
    if (percentage > 85) { rank = "Data-Driven Manager"; color = "text-green-600"; }
    else if (percentage > 60) { rank = "Strategic Lead"; color = "text-brand-600"; }
    else if (percentage > 30) { rank = "Modern Marketer"; color = "text-amber-600"; }

    return { percentage, rank, color };
  }, [totalScore]);

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <Card className="p-10 text-center relative overflow-hidden shadow-2xl border-none ring-1 ring-slate-200">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 via-green-500 to-amber-500" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 mb-6 shadow-inner ring-4 ring-white">
            <Trophy className="text-green-600" size={48} strokeWidth={1.5} />
          </div>

          <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Thử thách kết thúc!</h2>
          <p className="text-slate-500 font-medium mb-8">Hệ thống hạ tầng của bạn đã sẵn sàng vận hành.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Xếp hạng của bạn</span>
              <span className={cn("text-xl font-black", scoreDetails.color)}>{scoreDetails.rank}</span>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng điểm tích lũy</span>
              <span className="text-2xl font-black text-slate-800">{totalScore}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setShowReview(!showReview)}
              variant="outline"
              className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all"
            >
              <History size={20} className="text-brand-500" />
              {showReview ? 'Ẩn lịch sử chi tiết' : 'Xem lại đáp án & Giải thích'}
            </Button>

            <Button
              onClick={nextStep}
              className="w-full h-16 bg-slate-900 hover:bg-black rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <RotateCcw size={20} />
              Thử lại từ đầu
            </Button>
          </div>
        </div>
      </Card>

      {showReview && (
        <div className="mt-12 space-y-4 animate-in slide-in-from-bottom-5 duration-700">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-1 border-b-4 border-brand-500 rounded-full" />
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Chi tiết lộ trình xử lý dữ liệu</h3>
          </div>

          {/* Step 1: Data Sources */}
          <ReviewItem
            title={GAME_CONTENT.step2.title}
            score={state.score.sources}
            maxScore={30}
            explanation="Mỗi Data Source giải quyết một câu hỏi kinh doanh đặc thù. Hiểu thói quen mua hàng cần thấu hiểu hành vi (GA4), lịch sử (Order) và dữ liệu thực tế (POS)."
          >
            <div className="space-y-4">
              {GAME_CONTENT.step2.sources.map(s => {
                const isSelected = state.selections.sources?.includes(s.id);
                const userQId = state.selections.sourceQuestions[s.id];
                const correctQId = GAME_CONTENT.step2.correctMappings[s.id as keyof typeof GAME_CONTENT.step2.correctMappings];
                const userQ = GAME_CONTENT.step2.questions.find(q => q.id === userQId);
                const correctQ = GAME_CONTENT.step2.questions.find(q => q.id === correctQId);

                const isCorrect = s.correct && isSelected && (userQId === correctQId || !correctQId);
                const isWrong = (s.correct && !isSelected) || (isSelected && !s.correct) || (isSelected && s.correct && userQId !== correctQId);

                return (
                  <div key={s.id} className={cn("p-4 rounded-2xl border bg-white shadow-sm transition-all", isWrong ? "border-red-100 bg-red-50/10" : "border-slate-50")}>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="text-xl w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">{s.icon}</span>
                        <span className="font-black text-slate-800 uppercase text-xs tracking-wider">{s.label}</span>
                      </div>
                      {isCorrect ? <CheckCircle2 size={16} className="text-green-500" /> : isWrong ? <XCircle size={16} className="text-red-500" /> : null}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Trạng thái</span>
                        <p className={cn("text-xs font-bold", isSelected ? "text-brand-600" : "text-slate-400")}>
                          {isSelected ? 'Bạn đã chọn' : 'Bạn KHÔNG chọn'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Đáp án</span>
                        <p className={cn("text-xs font-bold", s.correct ? "text-green-600" : "text-red-400")}>
                          {s.correct ? 'Cần thiết' : 'Gây nhiễu'}
                        </p>
                      </div>
                    </div>

                    {isSelected && s.correct && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-slate-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-slate-400">CÂU HỎI BẠN GẮN:</span>
                          {userQId === correctQId ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} className="text-red-500" />}
                        </div>
                        <p className={cn("text-[11px] font-bold", userQId === correctQId ? "text-green-600" : "text-red-500")}>
                          {userQ?.text || 'Chưa chọn'}
                        </p>
                        {userQId !== correctQId && (
                          <div className="mt-1 pt-1 border-t border-slate-50">
                            <span className="text-[9px] font-bold text-green-600">ĐÁP ÁN ĐÚNG:</span>
                            <p className="text-[11px] font-bold text-green-700">{correctQ?.text}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-3 p-3 bg-slate-50 rounded-xl flex items-start gap-2">
                      <Lightbulb size={12} className="text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed leading-tight">
                        <strong>Giải thích:</strong> {s.reason}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ReviewItem>

          {/* Step 2: Pipeline */}
          <ReviewItem
            title={GAME_CONTENT.step3.title}
            score={state.score.pipeline || 0}
            maxScore={5}
            explanation={GAME_CONTENT.step3.explanation}
          >
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Câu hỏi tư duy</span>
                  <HelpCircle size={16} className="text-slate-300" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Bạn chọn</span>
                    <p className={cn("text-xs font-bold", state.selections.pipelineAnswer === GAME_CONTENT.step3.correctId ? "text-green-600" : "text-red-500")}>
                      {GAME_CONTENT.step3.options.find(o => o.id === state.selections.pipelineAnswer)?.text || 'Bỏ qua'}
                      {state.selections.pipelineAnswer === GAME_CONTENT.step3.correctId ? <CheckCircle2 size={12} className="inline ml-1" /> : <XCircle size={12} className="inline ml-1" />}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Đáp án đúng</span>
                    <p className="text-xs font-bold text-green-600">
                      {GAME_CONTENT.step3.options.find(o => o.id === GAME_CONTENT.step3.correctId)?.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ReviewItem>

          {/* Step 3: Warehouse */}
          <ReviewItem
            title={GAME_CONTENT.step4.title}
            score={state.score.warehouse || 0}
            maxScore={5}
            explanation={GAME_CONTENT.step4.explanation}
          >
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phương án xử lý</span>
                  <BarChart3 size={16} className="text-slate-300" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Bạn chọn</span>
                    <p className={cn("text-xs font-bold", state.selections.warehouseAnswer === GAME_CONTENT.step4.correctId ? "text-green-600" : "text-red-500")}>
                      {GAME_CONTENT.step4.options.find(o => o.id === state.selections.warehouseAnswer)?.text || 'Bỏ qua'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Đáp án đúng</span>
                    <p className="text-xs font-bold text-green-600">
                      {GAME_CONTENT.step4.options.find(o => o.id === GAME_CONTENT.step4.correctId)?.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ReviewItem>

          {/* Step 4: Data Model */}
          <ReviewItem
            title={GAME_CONTENT.step5.title}
            score={state.score.dataModel || 0}
            maxScore={20}
            explanation={GAME_CONTENT.step5.explanation}
          >
            <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-xl border border-brand-100">
                <Network size={20} className="text-brand-600" />
                <div>
                  <span className="text-[10px] font-black text-brand-400 uppercase">Kiến thức trọng tâm</span>
                  <p className="text-[11px] font-bold text-brand-900 leading-tight">Liên kết đa kênh (Omnichannel Linkage)</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Mục tiêu là nối Orders bảng gốc sang bảng Customer (theo ID) và bảng Product (theo ID). Khi đó ta mới có thể phân tích: "KH A (Segment X) đã mua Sản phẩm Y vào ngày Z tại cửa hàng POS P hoặc WEB W".
              </p>
            </div>
          </ReviewItem>

          {/* Step 5: Dashboard */}
          <ReviewItem
            title={GAME_CONTENT.step6.title}
            score={state.score.dashboard || 0}
            maxScore={40}
            explanation={GAME_CONTENT.step6.explanation}
          >
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase block mb-3">Các chỉ số đã chọn</span>
                <div className="flex flex-wrap gap-2">
                  {state.selections.dashboardKPIs.map(id => {
                    const isCorrect = id !== 'attendance' && id !== 'uptime' && id !== 'likes' && id !== 'cpu' && id !== 'wifi' && id !== 'printer';
                    return (
                      <div key={id} className={cn("px-3 py-1.5 rounded-full text-[10px] font-black border flex items-center gap-2", isCorrect ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700")}>
                        {id === 'rev_channel' ? 'Doanh thu kênh' : id === 'repeat_rate' ? 'Tỷ lệ quay lại' : id === 'aov' ? 'AOV' : id === 'freq' ? 'Tần suất' : id === 'segments' ? 'Phân khúc top' : id === 'funnel' ? 'Phễu CVR' : id === 'time_between' ? 'Khoảng cách mua' : id === 'voucher' ? 'Voucher CVR' : 'Số liệu rác'}
                        {isCorrect ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">AUDIENCE</span>
                  <p className={cn("text-xs font-black", state.selections.dashboardADO?.audience === 'marketing_manager' ? "text-green-600" : "text-red-500")}>
                    {state.selections.dashboardADO?.audience === 'marketing_manager' ? 'Marketing Manager (ĐÚNG)' : 'Chưa tối ưu'}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">BREAKDOWN</span>
                  <p className={cn("text-xs font-black", state.selections.dashboardADO?.breakdown === 'time_segment' ? "text-green-600" : "text-red-500")}>
                    {state.selections.dashboardADO?.breakdown === 'time_segment' ? 'Thời gian & Phân khúc (ĐÚNG)' : 'Chưa tối ưu'}
                  </p>
                </div>
              </div>
            </div>
          </ReviewItem>

          <div className="p-8 bg-slate-900 rounded-3xl text-white mt-12 border-4 border-slate-800 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
              <Medal size={120} />
            </div>
            <h4 className="flex items-center gap-3 text-2xl font-black mb-6 uppercase tracking-tighter">
              <Lightbulb className="text-amber-400 animate-pulse" />
              Lời khuyên từ Data Mentor
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Xây dựng hạ tầng dữ liệu không chỉ là câu chuyện kỹ thuật, mà là cầu nối giữa <strong>Nghiệp vụ (Business)</strong> và <strong>Công nghệ (Technology)</strong>. Một người quản lý giỏi là người biết dữ liệu nào cần lấy, dữ liệu nào bỏ qua, và trình bày nó một cách có ý nghĩa nhất. Chúc bạn sớm trở thành một <strong>Data-Driven Manager</strong> chuyên nghiệp!
            </p>
            <div className="mt-8 flex gap-4">
              <div className="px-4 py-2 rounded-full bg-slate-800 text-[10px] font-black border border-slate-700 uppercase tracking-widest text-slate-400 shadow-inner">
                Strategy First
              </div>
              <div className="px-4 py-2 rounded-full bg-slate-800 text-[10px] font-black border border-slate-700 uppercase tracking-widest text-slate-400 shadow-inner">
                No Data Junk
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
