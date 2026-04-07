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
  { id: 'rev_channel', label: 'Revenue by Channel' },
  { id: 'repeat_rate', label: 'Repeat Purchase Rate' },
  { id: 'aov', label: 'Average Order Value (AOV)' },
  { id: 'freq', label: 'Purchase Frequency' },
  { id: 'segments', label: 'Top Customer Segments' },
  { id: 'funnel', label: 'Funnel Conversion Rate' },
  { id: 'time_between', label: 'Time Between Purchases' },
  { id: 'voucher', label: 'Voucher Conversion Rate' },
  { id: 'attendance', label: 'Employee Attendance' },
  { id: 'uptime', label: 'Server Uptime' },
];

const WRONG_METRICS = ['attendance', 'uptime'];

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
      setError("Vui lòng trả lời câu hỏi phụ về phân tích ADO bên dưới Dashboard.");
      return;
    }

    let wrongCount = 0;
    selectedKPIs.forEach(kpi => {
      if (WRONG_METRICS.includes(kpi)) wrongCount++;
    });

    let score = Math.max(20 - (wrongCount * 5), 0);

    updateState({
      score: { ...state.score, dashboard: score },
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
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Left side: Metrics Selection */}
      <div className="w-full md:w-1/3 space-y-4">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
            Bước 5: Output
          </span>
          <h2 className="text-xl font-bold text-slate-800">Chọn Chỉ Số (KPIs)</h2>
          <p className="text-sm text-slate-600">Click để đưa vào Dashboard</p>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 pb-4">
          {ALL_METRICS.map(metric => {
            const isSelected = selectedKPIs.includes(metric.id);
            return (
              <div 
                key={metric.id}
                onClick={() => toggleKPI(metric.id)}
                className={cn(
                  "p-3 border rounded-lg transition text-sm flex justify-between items-center group",
                  isSelected 
                    ? "border-rose-300 bg-rose-50 text-rose-900 font-medium" 
                    : "border-slate-200 bg-white hover:border-rose-200 hover:bg-slate-50 text-slate-700",
                  !isSubmitted ? "cursor-pointer" : "cursor-default"
                )}
              >
                {metric.label}
                {isSelected ? (
                  <MinusCircle size={18} className="text-rose-500" />
                ) : (
                  <PlusCircle size={18} className="text-slate-400 group-hover:text-rose-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Dashboard Preview */}
      <div className="w-full md:w-2/3 flex flex-col">
        <Card className="flex-1 bg-slate-100/50 border-2 border-dashed border-slate-300 flex flex-col p-4 shadow-inner relative min-h-[400px]">
          <div className="flex items-center gap-2 text-slate-500 mb-6 pb-4 border-b border-slate-200">
            <LayoutDashboard size={24} />
            <span className="font-semibold text-lg">Customer Behavior Dashboard</span>
          </div>

          {selectedKPIs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <BarChart3 size={48} className="mb-4 opacity-50" />
              <p>Chưa có chỉ số nào được chọn</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
              {selectedKPIs.map(id => {
                const mst = ALL_METRICS.find(m => m.id === id);
                const isWrong = showFeedback && WRONG_METRICS.includes(id);
                return (
                  <div key={id} className={cn(
                    "p-4 rounded-xl shadow-sm border flex flex-col justify-between h-24 animate-in zoom-in-95 duration-200",
                    isWrong ? "bg-red-50 border-red-200" : "bg-white border-slate-200"
                  )}>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-slate-500 truncate leading-tight">{mst?.label}</span>
                      {isWrong && <div className="w-2 h-2 bg-red-500 rounded-full shrink-0" />}
                    </div>
                    <div className="h-6 w-1/2 bg-slate-100 rounded mt-auto" />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Framework ADO Questions */}
        <Card className="mt-4 p-5 shadow-sm border-blue-200 bg-blue-50/50">
          <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
            <span className="bg-blue-600 text-white w-5 h-5 rounded-full inline-flex items-center justify-center text-xs">?</span>
            Phân tích bối cảnh (Framework ADO)
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dashboard này ưu tiên thiết kế cho ai xem? (Audience)
              </label>
              <select 
                value={audience} onChange={(e) => setAudience(e.target.value)}
                className={cn("w-full text-sm p-2 rounded border border-blue-200 bg-white", isSubmitted && "bg-slate-50 cursor-not-allowed")}
                disabled={isSubmitted}
              >
                <option value="">-- Chọn đối tượng --</option>
                <option value="marketing_manager">Marketing/Sales Manager</option>
                <option value="data_engineer">Data Engineer</option>
                <option value="accounting">Nhân viên Kế toán</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Góc nhìn (Breakdown) quan trọng nhất muốn xem là gì?
              </label>
              <select 
                value={breakdown} onChange={(e) => setBreakdown(e.target.value)}
                className={cn("w-full text-sm p-2 rounded border border-blue-200 bg-white", isSubmitted && "bg-slate-50 cursor-not-allowed")}
                disabled={isSubmitted}
              >
                <option value="">-- Chọn góc nhìn --</option>
                <option value="time_segment">Thời gian & Phân khúc KH (Segments)</option>
                <option value="ip_address">Địa chỉ IP của KH</option>
                <option value="server_load">Trạng thái chịu tải của Data Warehouse</option>
              </select>
            </div>
          </div>
        </Card>

        {showFeedback && (
          <div className={cn(
            "mt-4 p-4 rounded-lg text-sm border",
            selectedKPIs.some(k => WRONG_METRICS.includes(k)) || audience !== 'marketing_manager' || breakdown !== 'time_segment'
              ? "bg-amber-50 text-amber-800 border-amber-200" 
              : "bg-green-50 text-green-800 border-green-200"
          )}>
            <p className="font-bold mb-1">Giải thích:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>KPIs: Các chỉ số vận hành server (Uptime) hay nhân sự (Attendance) không giải quyết mục tiêu hiểu hành vi mua hàng.</li>
              <li>ADO: Để tối ưu marketing, manager cần Breakdown theo Phân khúc và Thời gian để thấy xu hướng.</li>
            </ul>
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-600 font-medium bg-red-50 p-2 rounded px-3 border border-red-200">
            {error}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          {!isSubmitted ? (
            <Button onClick={handleSubmit} size="lg" className="px-8 shadow-md hover:shadow-lg gap-2">
              Nộp bài <ArrowRight size={20} />
            </Button>
          ) : (
            <Button onClick={nextStep} size="lg" className="px-8 shadow-md hover:shadow-lg bg-green-600 hover:bg-green-700 gap-2">
              Hoàn thành dự án <CheckCircle2 size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
