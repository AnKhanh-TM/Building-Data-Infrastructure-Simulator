import { useState } from 'react';
import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2 } from 'lucide-react';
import type { GameState } from '../types/game';
import { DASHBOARD_OPTIONS } from '../lib/constants';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

const OPPORTUNITIES = [
  ['ads_agent', 'Ads Optimization Agent: theo dõi CAC, LTV, ROAS và đề xuất điều chỉnh ngân sách'],
  ['face_recognition', 'Nhận diện khuôn mặt khách vào cửa hàng để chạy quảng cáo'],
  ['general_chatbot', 'Chatbot trả lời mọi câu hỏi không dùng dữ liệu warehouse'],
  ['server_ai', 'AI tự nâng cấp CPU khi server chậm'],
];

const EXPECTED_METRICS = ['revenue', 'cac', 'ltv', 'repeat_rate', 'roas'];
const EXPECTED_FIELDS = ['customer_id', 'source_campaign', 'order_value', 'order_date', 'ad_spend'];

export const Screen6Dashboard = ({ state, updateState, complete }: { state: GameState; updateState: (value: Partial<GameState>) => void; nextStep: () => void; complete: () => void }) => {
  const submitted = state.submittedSteps.includes(6);
  const [dashboard, setDashboard] = useState(state.selections.dashboard);
  const [opportunity, setOpportunity] = useState(state.selections.opportunity);
  
  const toggle = (key: 'metrics' | 'fields', id: string) => setDashboard({ ...dashboard, [key]: dashboard[key].includes(id) ? dashboard[key].filter((x) => x !== id) : [...dashboard[key], id] });
  
  const submit = () => {
    let score = dashboard.ask === 'quality_channel' ? 3 : 0;
    score += Math.max(0, EXPECTED_METRICS.filter((x) => dashboard.metrics.includes(x)).length * 1.4 - dashboard.metrics.filter((x) => !EXPECTED_METRICS.includes(x)).length);
    score += Math.max(0, EXPECTED_FIELDS.filter((x) => dashboard.fields.includes(x)).length - dashboard.fields.filter((x) => !EXPECTED_FIELDS.includes(x)).length);
    score += dashboard.breakdown === 'channel_segment_time' ? 3 : 0;
    score += dashboard.cadence === 'daily_weekly' ? 2 : 0;
    updateState({ score: { ...state.score, dashboard: Math.round(Math.min(20, score)), opportunity: opportunity === 'ads_agent' ? 10 : 0 }, selections: { ...state.selections, dashboard, opportunity }, submittedSteps: [...new Set([...state.submittedSteps, 6])] });
  };
  
  return <div className="mx-auto max-w-6xl">
    <div className="mb-6 text-center"><p className="text-xs font-bold uppercase tracking-widest text-brand-600">30 điểm</p><h2 className="text-3xl font-black">ASK – DATA – OUTPUT</h2><p className="mt-2 text-slate-600">Brief cho Data Team đủ rõ để họ không phải tự đoán.</p></div>
    
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="p-5 flex flex-col justify-between">
        <div>
          <SectionTitle tag="ASK" text="Câu hỏi ý nghĩa kinh doanh cần trả lời" />
          <p className="text-[10px] text-slate-400 mb-3 italic">Hãy chọn câu hỏi cốt lõi dẫn trực tiếp tới doanh thu và ngân sách.</p>
          <SingleSelect 
            value={dashboard.ask} 
            options={DASHBOARD_OPTIONS.asks} 
            disabled={submitted} 
            isCorrect={dashboard.ask === 'quality_channel'}
            submitted={submitted}
            onChange={(ask) => setDashboard({ ...dashboard, ask })} 
          />
        </div>
        {submitted && dashboard.ask !== 'quality_channel' && (
          <p className="text-[10px] text-green-700 font-semibold bg-green-50 p-2 rounded mt-2">
            * Đáp án đúng: Kênh nào mang lại khách hàng mua nhiều và quay lại?
          </p>
        )}
      </Card>
      
      <Card className="p-5 lg:col-span-2">
        <SectionTitle tag="DATA" text="KPI và fields cần thiết" />
        <Multi 
          label={`KPIs (Cần chọn ${EXPECTED_METRICS.length} chỉ số)`} 
          options={DASHBOARD_OPTIONS.metrics} 
          selected={dashboard.metrics} 
          disabled={submitted} 
          expectedList={EXPECTED_METRICS}
          submitted={submitted}
          onToggle={(id) => toggle('metrics', id)} 
        />
        <Multi 
          label={`Fields (Cần chọn ${EXPECTED_FIELDS.length} trường)`} 
          options={DASHBOARD_OPTIONS.fields} 
          selected={dashboard.fields} 
          disabled={submitted} 
          expectedList={EXPECTED_FIELDS}
          submitted={submitted}
          onToggle={(id) => toggle('fields', id)} 
        />
      </Card>
      
      <Card className="p-5 lg:col-span-2">
        <SectionTitle tag="OUTPUT" text="Góc nhìn và nhịp cập nhật" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[10px] text-slate-400 mb-1.5 font-bold uppercase">Chiều phân tích (Breakdown)</p>
            <SingleSelect 
              value={dashboard.breakdown} 
              options={DASHBOARD_OPTIONS.breakdowns} 
              disabled={submitted} 
              isCorrect={dashboard.breakdown === 'channel_segment_time'}
              submitted={submitted}
              onChange={(breakdown) => setDashboard({ ...dashboard, breakdown })} 
            />
            {submitted && dashboard.breakdown !== 'channel_segment_time' && (
              <p className="text-[9px] text-green-700 bg-green-50 p-1.5 rounded mt-1.5">
                * Đúng: Channel + customer segment + thời gian
              </p>
            )}
          </div>
          
          <div>
            <p className="text-[10px] text-slate-400 mb-1.5 font-bold uppercase">Tần suất review (Cadence)</p>
            <SingleSelect 
              value={dashboard.cadence} 
              options={DASHBOARD_OPTIONS.cadences} 
              disabled={submitted} 
              isCorrect={dashboard.cadence === 'daily_weekly'}
              submitted={submitted}
              onChange={(cadence) => setDashboard({ ...dashboard, cadence })} 
            />
            {submitted && dashboard.cadence !== 'daily_weekly' && (
              <p className="text-[9px] text-green-700 bg-green-50 p-1.5 rounded mt-1.5">
                * Đúng: Cập nhật hằng ngày, review ngân sách hằng tuần
              </p>
            )}
          </div>
        </div>
      </Card>
      
      <Card className="bg-slate-900 p-5 text-white flex flex-col justify-between">
        <div>
          <BarChart3 className="mb-3 text-brand-300 animate-pulse" />
          <h3 className="font-black text-sm text-slate-100">Dashboard Decision</h3>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Mục tiêu là biểu diễn CAC so sánh trực tiếp với LTV và tỉ lệ mua lại (repeat rate) theo thời gian của từng tệp khách để đưa ra quyết định nâng/giảm ngân sách tức thì.
          </p>
        </div>
      </Card>
    </div>
    
    <Card className="mt-5 p-5">
      <div className="mb-4 flex items-center gap-3">
        <BrainCircuit className="text-brand-600 animate-pulse" />
        <div>
          <p className="text-xs font-bold uppercase text-brand-600">10 điểm mở rộng</p>
          <h3 className="font-black">Cơ hội nào hợp lý sau khi data đã sạch và có cấu trúc?</h3>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {OPPORTUNITIES.map(([id, text]) => {
          const isSelected = opportunity === id;
          const isCorrect = id === 'ads_agent';
          
          let btnStyle = 'border-slate-200 hover:border-brand-200';
          if (isSelected && !submitted) {
            btnStyle = 'border-brand-500 bg-brand-50 text-slate-900';
          } else if (submitted) {
            if (isCorrect) {
              btnStyle = 'border-green-500 bg-green-50/50 text-green-900 font-bold';
            } else if (isSelected) {
              btnStyle = 'border-red-500 bg-red-50/50 text-red-900 line-through';
            } else {
              btnStyle = 'border-slate-100 text-slate-400 opacity-50';
            }
          }
          
          return (
            <button 
              disabled={submitted} 
              key={id} 
              onClick={() => setOpportunity(id)} 
              className={cn('rounded-xl border p-4 text-left text-xs font-semibold flex justify-between items-center transition', btnStyle)}
            >
              <span>{text}</span>
              {submitted && isCorrect && <span className="text-green-600 font-bold ml-2">✓ Đúng</span>}
              {submitted && isSelected && !isCorrect && <span className="text-red-600 font-bold ml-2">✗ Sai</span>}
            </button>
          );
        })}
      </div>
    </Card>
    
    {submitted && (
      <div className="mt-5 rounded-xl bg-green-50 p-4 border border-green-200/50 text-sm leading-relaxed text-green-800">
        <p className="font-bold flex items-center gap-1.5"><CheckCircle2 className="text-green-600" /> Giải thích chi tiết:</p>
        <p className="mt-1">
          Brief chuẩn giúp đội kỹ thuật không phải phỏng đoán. Các chỉ số được chọn bao phủ toàn bộ bài toán tài chính quảng cáo (spend, revenue, CAC, LTV). 
        </p>
        <p className="mt-1">
          <strong>Ads Optimization Agent</strong> là cơ hội mở rộng AI tốt nhất lúc này, vì sau khi đã làm sạch kho dữ liệu chung, AI có thể đọc trực tiếp số liệu chi tiêu và doanh thu trọn đời để tự động điều chỉnh ngân sách tối ưu theo thời gian thực.
        </p>
      </div>
    )}
    
    <Button disabled={!dashboard.ask || !dashboard.metrics.length || !dashboard.fields.length || !dashboard.breakdown || !dashboard.cadence || !opportunity} onClick={submitted ? complete : submit} size="lg" className="mx-auto mt-8 flex gap-2">{submitted ? 'Hoàn thành dự án' : 'Xuất bản dashboard'} <ArrowRight /></Button>
  </div>;
};

const SectionTitle = ({ tag, text }: { tag: string; text: string }) => <div className="mb-4"><span className="rounded bg-brand-100 px-2 py-1 text-xs font-black text-brand-800">{tag}</span><h3 className="mt-2 font-black">{text}</h3></div>;

const SingleSelect = ({ value, options, onChange, disabled, isCorrect, submitted }: { 
  value: string; 
  options: readonly (readonly [string, string])[]; 
  onChange: (v: string) => void; 
  disabled: boolean;
  isCorrect?: boolean;
  submitted?: boolean;
}) => {
  let borderStyle = 'border-slate-300';
  if (submitted) {
    borderStyle = isCorrect ? 'border-green-500 bg-green-50/20 text-green-900' : 'border-red-500 bg-red-50/20 text-red-900';
  }
  return (
    <select 
      disabled={disabled} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className={cn("w-full rounded-lg p-3 text-xs border", borderStyle)}
    >
      <option value="">Chọn phương án</option>
      {options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}
    </select>
  );
};

const Multi = ({ label, options, selected, onToggle, disabled, expectedList, submitted }: { 
  label: string; 
  options: readonly (readonly [string, string])[]; 
  selected: string[]; 
  onToggle: (id: string) => void; 
  disabled: boolean;
  expectedList: string[];
  submitted: boolean;
}) => (
  <div className="mb-4">
    <p className="mb-2 text-xs font-bold uppercase text-slate-400">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map(([id, text]) => {
        const isSelected = selected.includes(id);
        const isCorrect = expectedList.includes(id);
        
        let chipStyle = 'border-slate-200 bg-white';
        if (isSelected && !submitted) {
          chipStyle = 'border-brand-500 bg-brand-50 text-brand-800';
        } else if (submitted) {
          if (isCorrect) {
            chipStyle = 'border-green-500 bg-green-50 text-green-800 font-bold';
          } else if (isSelected) {
            chipStyle = 'border-red-500 bg-red-50 text-red-800 line-through';
          } else {
            chipStyle = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60';
          }
        }
        
        return (
          <button 
            disabled={disabled} 
            key={id} 
            onClick={() => onToggle(id)} 
            className={cn('rounded-full border px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition', chipStyle)}
          >
            {submitted && isCorrect && <span className="text-green-600 font-black">✓</span>}
            {submitted && !isCorrect && isSelected && <span className="text-red-600 font-black">✗</span>}
            {text}
          </button>
        );
      })}
    </div>
  </div>
);
