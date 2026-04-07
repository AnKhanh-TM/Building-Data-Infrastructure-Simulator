import { useState } from 'react';
import type { GameState } from '../types/game';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LayoutDashboard, PlusCircle, MinusCircle, ArrowRight, BarChart3, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScreenProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
  nextStep: () => void;
}

const ALL_METRICS = [
  { id: 'rev_channel', label: 'Doanh thu theo kênh', correct: true, value: '850M' },
  { id: 'repeat_rate', label: 'Tỷ lệ quay lại khách cũ', correct: true, value: '24.5%' },
  { id: 'aov', label: 'Giá trị đơn TB (AOV)', correct: true, value: '1.2M' },
  { id: 'freq', label: 'Tần suất mua hàng', correct: true, value: '2.4' },
  { id: 'segments', label: 'Phân khúc KH chi tiêu cao', correct: true, value: '1,240' },
  { id: 'funnel', label: 'Tỷ lệ chuyển đổi phễu', correct: true, value: '12.8%' },
  { id: 'time_between', label: 'T.gian giữa 2 lần mua', correct: true, value: '45d' },
  { id: 'voucher', label: 'Hiệu quả dùng Voucher', correct: true, value: '18.2%' },
  { id: 'attendance', label: 'Chuyên cần của nhân viên', correct: false, value: '98%' },
  { id: 'uptime', label: 'Thời gian server hoạt động', correct: false, value: '99.9%' },
  { id: 'likes', label: 'Số lượng Like Fanpage', correct: false, value: '45.2K' },
  { id: 'cpu', label: 'Tải lượng CPU hệ thống', correct: false, value: '42%' },
  { id: 'wifi', label: 'Tốc độ Wifi cửa hàng', correct: false, value: '120Mbps' },
  { id: 'printer', label: 'Trình trạng mực máy in', correct: false, value: 'OK' },
];

const CORRECT_ADO = {
  audience: 'marketing_manager',
  breakdown: 'time_segment'
};

export const Screen6Dashboard = ({ state, updateState, nextStep }: ScreenProps) => {
  const isSubmitted = state.submittedSteps.includes(6);
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(state.selections.dashboardKPIs || []);
  const [audience, setAudience] = useState(state.selections.dashboardADO?.audience || '');
  const [breakdown, setBreakdown] = useState(state.selections.dashboardADO?.breakdown || '');
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(isSubmitted);

  const toggleKPI = (id: string) => {
    if (isSubmitted) return;
    setSelectedKPIs(prev => {
      if (prev.includes(id)) return prev.filter(kpi => kpi !== id);
      return [...prev, id];
    });
    setError('');
  };

  const handleSubmit = () => {
    if (selectedKPIs.length < 4) {
      setError("Vui lòng chọn ít nhất 4 chỉ số (KPIs) quan trọng nhất.");
      return;
    }

    if (!audience || !breakdown) {
      setError("Vui lòng trả lời câu hỏi phụ về phân tích bối cảnh bên dưới.");
      return;
    }

    // Scoring logic: +4 for correct KPI, -5 for incorrect KPI, +10 for correct ADO components
    let kpiScore = 0;
    selectedKPIs.forEach(id => {
      const metric = ALL_METRICS.find(m => m.id === id);
      if (metric?.correct) kpiScore += 4;
      else kpiScore -= 5;
    });

    let adoScore = 0;
    if (audience === CORRECT_ADO.audience) adoScore += 10;
    else adoScore -= 5;

    if (breakdown === CORRECT_ADO.breakdown) adoScore += 10;
    else adoScore -= 5;

    const totalScore = Math.min(40, Math.max(0, kpiScore + adoScore));

    updateState({
      score: { ...state.score, dashboard: totalScore },
      selections: {
        ...state.selections,
        dashboardKPIs: selectedKPIs,
        dashboardADO: { audience, breakdown }
      },
      submittedSteps: [...state.submittedSteps, 6]
    });
    setShowFeedback(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

      {/* Left side: Metrics Selection */}
      <div className="w-full md:w-1/3 flex flex-col">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
            Bước 5: Output
          </span>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Thiết kế Dashboard</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Click để đưa chỉ số vào Dashboard. Hãy cẩn thận với cái bẫy "số liệu rác"!</p>
        </div>

        <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-slate-200">
          {ALL_METRICS.map(metric => {
            const isSelected = selectedKPIs.includes(metric.id);
            return (
              <div
                key={metric.id}
                onClick={() => toggleKPI(metric.id)}
                className={cn(
                  "p-2.5 border rounded-lg transition-all text-xs flex justify-between items-center group",
                  isSelected
                    ? "border-rose-400 bg-rose-50 text-rose-900 font-bold shadow-sm"
                    : "border-slate-200 bg-white hover:border-rose-200 hover:bg-slate-50 text-slate-600",
                  !isSubmitted ? "cursor-pointer" : "cursor-default"
                )}
              >
                {metric.label}
                {isSelected ? (
                  <MinusCircle size={14} className="text-rose-500" />
                ) : (
                  <PlusCircle size={14} className="text-slate-300 group-hover:text-rose-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Dashboard Preview */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        <Card className="flex-1 bg-slate-900 border-4 border-slate-800 flex flex-col p-6 shadow-2xl relative min-h-[450px] rounded-3xl overflow-hidden">
          {/* Cyber Styling */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />

          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3 text-slate-300">
              <LayoutDashboard size={22} className="text-rose-500" />
              <span className="font-bold text-sm tracking-widest uppercase">Performance Monitor v1.0</span>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-700" />
              <div className="w-2 h-2 rounded-full bg-slate-700" />
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
          </div>

          {selectedKPIs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
              <BarChart3 size={64} className="mb-4 opacity-20" />
              <p className="text-sm font-medium uppercase tracking-tighter">Hệ thống đang chờ chỉ số...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-max">
              {selectedKPIs.map(id => {
                const mst = ALL_METRICS.find(m => m.id === id);
                const isWrong = showFeedback && !mst?.correct;
                return (
                  <div key={id} className={cn(
                    "p-3 rounded-xl border flex flex-col justify-between h-24 transition-all duration-500 animate-in zoom-in-95",
                    isWrong ? "bg-red-950/30 border-red-900/50" : "bg-slate-800/50 border-slate-700/50 shadow-inner"
                  )}>
                    <div className="flex justify-between items-start">
                      <span className={cn("text-[10px] font-bold tracking-tight uppercase", isWrong ? "text-red-400" : "text-slate-400")}>
                        {mst?.label}
                      </span>
                      {isWrong && <div className="text-[8px] bg-red-600 text-white px-1.5 rounded-full font-black">X</div>}
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-xl font-black text-white font-mono tracking-tighter">{mst?.value}</span>
                      <div className="w-8 h-1 bg-slate-700 rounded-full mb-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Framework ADO Questions */}
        <Card className="p-5 shadow-lg border-slate-200 bg-white rounded-2xl">
          <h3 className="font-black text-slate-800 mb-5 text-sm flex items-center gap-3">
            <div className="bg-slate-800 text-white w-6 h-6 rounded-lg flex items-center justify-center shadow-md">?</div>
            PHÂN TÍCH BỐI CẢNH
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                AI SẼ XEM BÁO CÁO NÀY? (AUDIENCE)
              </label>
              <select
                value={audience} onChange={(e) => setAudience(e.target.value)}
                className={cn(
                  "w-full text-xs font-bold p-3 rounded-xl border transition-all outline-none",
                  isSubmitted ? "bg-slate-50 border-slate-200" : "bg-white border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
                )}
                disabled={isSubmitted}
              >
                <option value="">-- CHỌN ĐỐI TƯỢNG --</option>
                <option value="marketing_manager">Marketing/Sales Manager (Chiến lược)</option>
                <option value="data_engineer">Data Engineer (Kỹ thuật hệ thống)</option>
                <option value="accounting">Kế toán trưởng (Đối soát dòng tiền)</option>
                <option value="it_admin">IT Admin (Quản trị hạ tầng)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                GÓC NHÌN CHỦ ĐẠO LÀ GÌ? (BREAKDOWN)
              </label>
              <select
                value={breakdown} onChange={(e) => setBreakdown(e.target.value)}
                className={cn(
                  "w-full text-xs font-bold p-3 rounded-xl border transition-all outline-none",
                  isSubmitted ? "bg-slate-50 border-slate-200" : "bg-white border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
                )}
                disabled={isSubmitted}
              >
                <option value="">-- CHỌN GÓC NHÌN --</option>
                <option value="time_segment">Thời gian & Phân khúc khách hàng</option>
                <option value="ip_address">Phân bố địa chỉ IP người dùng</option>
                <option value="server_load">Tỉ lệ chiếm dụng bộ nhớ RAM</option>
                <option value="printer_status">Lượng giấy in còn lại trong kho</option>
              </select>
            </div>
          </div>
        </Card>

        {showFeedback && (
          <div className={cn(
            "p-5 rounded-2xl text-sm border-2 animate-in slide-in-from-bottom-4 duration-500 shadow-xl",
            selectedKPIs.some(k => !ALL_METRICS.find(m => m.id === k)?.correct) || audience !== CORRECT_ADO.audience || breakdown !== CORRECT_ADO.breakdown
              ? "bg-amber-50 text-amber-950 border-amber-200"
              : "bg-green-50 text-green-950 border-green-200"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("w-2 h-6 rounded-full", (selectedKPIs.some(k => !ALL_METRICS.find(m => m.id === k)?.correct) || audience !== CORRECT_ADO.audience || breakdown !== CORRECT_ADO.breakdown) ? "bg-amber-500" : "bg-green-500")} />
              <h4 className="font-black uppercase tracking-tighter">Phân tích từ Mentor:</h4>
            </div>
            <p className="text-xs leading-relaxed font-medium">
              Dashboard này được thiết kế để giải quyết bài toán của <strong>Marketing Manager</strong>. Vì vậy, các chỉ số về hạ tầng kỹ thuật (CPU, Server Uptime) hay vận hành phụ (Wifi, Chuyên cần) đều là <strong>"Rác dữ liệu"</strong> trong bối cảnh này. Một Dashboard tốt chỉ tập trung vào các chỉ số thúc đẩy hành vi mua hàng và cần được breakdown theo <strong>Thời gian/Phân khúc</strong> để thấy xu hưỡng.
            </p>
          </div>
        )}

        {error && (
          <div className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-xl border-2 border-red-200 animate-bounce">
            {error}
          </div>
        )}

        {!isSubmitted ? (
          <Button onClick={handleSubmit} size="lg" className="h-16 rounded-2xl shadow-xl hover:shadow-brand-200 transition-all gap-3 bg-brand-600 hover:bg-brand-700 font-black tracking-widest uppercase">
            XUẤT BẢN DASHBOARD <ArrowRight size={20} />
          </Button>
        ) : (
          <Button onClick={nextStep} size="lg" className="h-16 rounded-2xl shadow-xl bg-green-600 hover:bg-green-700 transition-all gap-3 font-black tracking-widest uppercase">
            HOÀN THÀNH DỰ ÁN <CheckCircle2 size={24} />
          </Button>
        )}
      </div>
    </div>
  );
};
