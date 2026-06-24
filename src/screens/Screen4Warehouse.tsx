import { useState } from 'react';
import { ArrowRight, Database } from 'lucide-react';
import type { GameState } from '../types/game';
import { WAREHOUSE_OPTIONS } from '../lib/constants';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

const REASONS = [
  ['scale', 'Scale tốt khi dữ liệu tăng'], 
  ['ecosystem', 'Tích hợp tốt với GA4/Google ecosystem'], 
  ['automation', 'Phù hợp pipeline tự động'], 
  ['no_sql', 'Không cần biết SQL'], 
  ['free', 'Luôn miễn phí bất kể query']
];

export const Screen4Warehouse = ({ state, updateState, nextStep }: Props) => {
  const submitted = state.submittedSteps.includes(4);
  const [answer, setAnswer] = useState(state.selections.warehouseAnswer);
  const [reasons, setReasons] = useState(state.selections.warehouseReasons);
  
  const toggle = (id: string) => setReasons(reasons.includes(id) ? reasons.filter((x) => x !== id) : [...reasons, id]);
  
  const submit = () => {
    const score = (answer === 'bigquery' ? 5 : 0) + ['scale', 'ecosystem', 'automation'].filter((x) => reasons.includes(x)).length * 2 - ['no_sql', 'free'].filter((x) => reasons.includes(x)).length;
    updateState({ score: { ...state.score, warehouse: Math.max(0, Math.min(10, score)) }, selections: { ...state.selections, warehouseAnswer: answer, warehouseReasons: reasons }, submittedSteps: [...new Set([...state.submittedSteps, 4])] });
  };
  
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">10 điểm</p>
        <h2 className="text-3xl font-black">Chọn kho dữ liệu theo constraint</h2>
        <p className="mx-auto mt-2 max-w-3xl text-slate-600">
          RetailCo là SME, dữ liệu tăng nhanh, đang dùng GA4 và cần automation. Team có thể học SQL nhưng ngân sách chưa phù hợp giải pháp enterprise.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {WAREHOUSE_OPTIONS.map((item) => {
          const isSelected = answer === item.id;
          const isCorrect = item.id === 'bigquery';
          
          let cardStyle = 'border-slate-200 hover:border-brand-200';
          if (isSelected && !submitted) {
            cardStyle = 'ring-2 ring-brand-500 rounded-xl';
          } else if (submitted) {
            if (isCorrect) {
              cardStyle = 'border-green-500 bg-green-50/30 rounded-xl ring-2 ring-green-500/25';
            } else if (isSelected) {
              cardStyle = 'border-red-500 bg-red-50/30 rounded-xl ring-2 ring-red-500/25';
            } else {
              cardStyle = 'border-slate-100 opacity-60 rounded-xl';
            }
          }

          return (
            <button 
              disabled={submitted} 
              key={item.id} 
              onClick={() => setAnswer(item.id)} 
              className={cn('text-left w-full h-full transition', cardStyle)}
            >
              <Card className="h-full p-5 relative overflow-hidden">
                {submitted && isCorrect && (
                  <span className="absolute top-0 right-0 bg-green-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-bl">
                    Đáp án đúng
                  </span>
                )}
                {submitted && isSelected && !isCorrect && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-bl">
                    Bạn chọn sai
                  </span>
                )}
                <Database className={cn('mb-3', isCorrect && submitted ? 'text-green-600' : 'text-brand-600')} />
                <h3 className="font-bold">{item.label}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.note}</p>
              </Card>
            </button>
          );
        })}
      </div>
      
      <Card className="mt-5 p-5">
        <h3 className="mb-3 font-bold">Vì sao lựa chọn này phù hợp?</h3>
        <div className="flex flex-wrap gap-2">
          {REASONS.map(([id, text]) => {
            const isSelected = reasons.includes(id);
            const isCorrectReason = ['scale', 'ecosystem', 'automation'].includes(id);
            
            let chipStyle = 'border-slate-200 hover:border-brand-200';
            if (isSelected && !submitted) {
              chipStyle = 'border-brand-500 bg-brand-50 text-brand-800';
            } else if (submitted) {
              if (isCorrectReason) {
                chipStyle = 'border-green-500 bg-green-50 text-green-800 font-bold';
              } else if (isSelected) {
                chipStyle = 'border-red-500 bg-red-50 text-red-800 line-through';
              } else {
                chipStyle = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60';
              }
            }

            return (
              <button 
                disabled={submitted} 
                key={id} 
                onClick={() => toggle(id)} 
                className={cn('rounded-full border px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition', chipStyle)}
              >
                {submitted && isCorrectReason && <span className="text-green-600 font-black">✓</span>}
                {submitted && !isCorrectReason && isSelected && <span className="text-red-600 font-black">✗</span>}
                {text}
              </button>
            );
          })}
        </div>
      </Card>
      
      {submitted && (
        <div className="mt-5 rounded-xl bg-green-50 p-4 border border-green-200/50 text-sm leading-relaxed text-green-800">
          <p className="font-bold mb-1">🎯 Giải thích đáp án:</p>
          <p>
            <strong>BigQuery</strong> là lựa chọn phù hợp nhất cho SME RetailCo vì khả năng <strong>tự động hóa (automation)</strong> cao, tích hợp hoàn hảo với hệ sinh thái Google gồm <strong>GA4 (ecosystem)</strong> và khả năng <strong>scale tự động khi dữ liệu tăng</strong> mà không mất công quản trị máy chủ phức tạp.
          </p>
          <p className="mt-2 text-xs text-slate-500 font-normal">
            * Lựa chọn 'Không cần biết SQL' và 'Luôn miễn phí' là sai. BigQuery vẫn sử dụng chuẩn SQL để truy vấn và tính phí linh hoạt dựa trên lượng dữ liệu quét (pay-as-you-use).
          </p>
        </div>
      )}
      
      <Button 
        disabled={!answer || !reasons.length} 
        onClick={submitted ? nextStep : submit} 
        size="lg" 
        className="mx-auto mt-8 flex gap-2"
      >
        <span>{submitted ? 'Bước tiếp theo' : 'Chốt kiến trúc'}</span> 
        <ArrowRight />
      </Button>
    </div>
  );
};

type Props = { state: GameState; updateState: (value: Partial<GameState>) => void; nextStep: () => void };
