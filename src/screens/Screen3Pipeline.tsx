import { useState } from 'react';
import { ArrowDown, ArrowRight, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import type { GameState } from '../types/game';
import { PIPELINE_STEPS } from '../lib/constants';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Screen3Pipeline = ({ state, updateState, nextStep }: Props) => {
  const submitted = state.submittedSteps.includes(3);
  const [order, setOrder] = useState(state.selections.pipelineOrder.length ? state.selections.pipelineOrder : ['dashboard', 'extract', 'model', 'load', 'transform']);
  const [decisions, setDecisions] = useState(state.selections.pipelineDecisions);
  const [showHint, setShowHint] = useState(false);

  const move = (index: number, direction: number) => {
    const next = [...order]; const target = index + direction;
    if (target < 0 || target >= next.length || submitted) return;
    [next[index], next[target]] = [next[target], next[index]]; setOrder(next);
  };

  const submit = () => {
    const correct = PIPELINE_STEPS.map(([id]) => id);
    const orderScore = order.reduce((sum, id, i) => sum + (id === correct[i] ? 2 : 0), 0);
    const decisionScore = (decisions.mode === 'automated' ? 3 : 0) + (decisions.identity === 'normalize' ? 2 : 0);
    updateState({ score: { ...state.score, pipeline: orderScore + decisionScore }, selections: { ...state.selections, pipelineOrder: order, pipelineDecisions: decisions }, submittedSteps: [...new Set([...state.submittedSteps, 3])] });
  };

  return <div className="mx-auto max-w-3xl">
    <Title />
    
    <div className="flex justify-center mb-4">
      <button 
        onClick={() => setShowHint(!showHint)}
        className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 transition shadow-sm"
      >
        <Lightbulb size={14} />
        <span>Gợi ý tư duy</span>
      </button>
    </div>

    {showHint && (
      <div className="mb-5 rounded-xl bg-amber-50/80 border border-amber-200/60 p-4 text-xs leading-relaxed text-amber-900 animate-fadeIn space-y-2">
        <p><strong>1. Thứ tự quy trình (ETL Flow):</strong> Hãy hình dung dữ liệu như nguồn nước: cần lấy nước từ sông hồ <em>(Extract)</em> → lọc sạch cát bụi và vi khuẩn <em>(Transform)</em> → đưa vào bể chứa trong nhà <em>(Load)</em> → kết nối các đường ống <em>(Model)</em> → lắp vòi nước để sử dụng <em>(Dashboard)</em>.</p>
        <p><strong>2. Vận hành Pipeline:</strong> Làm thủ công (Manual) dễ sai sót và mất thời gian, chạy liên tục từng giây (Realtime) quá tốn ngân sách máy chủ không cần thiết cho SME. Hãy tìm phương án trung hòa có tự động hóa và phát hiện lỗi.</p>
        <p><strong>3. Chuẩn hóa ID:</strong> Việc lệch định dạng ID (chữ thường / chữ hoa, có khoảng trắng...) nếu không được xử lý trước khi nạp sẽ khiến mối quan hệ giữa các bảng bị lỗi khi kết nối (Join).</p>
      </div>
    )}

    <Card className="p-6"><div className="space-y-2">{order.map((id, i) => <div key={id}><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 font-bold text-white">{i + 1}</span><span className="flex-1 font-semibold">{PIPELINE_STEPS.find(([key]) => key === id)?.[1]}</span><button disabled={submitted} onClick={() => move(i, -1)}><ChevronUp /></button><button disabled={submitted} onClick={() => move(i, 1)}><ChevronDown /></button></div>{i < order.length - 1 && <ArrowDown className="mx-auto my-1 text-slate-300" />}</div>)}</div></Card>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <SelectCard label="Pipeline nên vận hành thế nào?" value={decisions.mode} disabled={submitted} onChange={(mode) => setDecisions({ ...decisions, mode })} options={[['manual', 'Export Excel thủ công'], ['automated', 'Tự động theo lịch, có kiểm soát lỗi'], ['realtime', 'Realtime mọi dữ liệu']]} />
      <SelectCard label="CRM và Order khác định dạng customer ID?" value={decisions.identity} disabled={submitted} onChange={(identity) => setDecisions({ ...decisions, identity })} options={[['ignore', 'Giữ nguyên để load nhanh'], ['normalize', 'Chuẩn hóa trước khi nối'], ['delete', 'Xóa record không giống nhau']]} />
    </div>
    {submitted && (
      <div className="mt-5 p-5 rounded-xl border border-slate-200 bg-white shadow-sm animate-fadeIn space-y-4">
        {(() => {
          const correct = PIPELINE_STEPS.map(([id]) => id);
          const orderMatches = order.every((id, i) => id === correct[i]);
          const decisionsMatch = decisions.mode === 'automated' && decisions.identity === 'normalize';
          const isCorrect = orderMatches && decisionsMatch;

          return isCorrect ? (
            <div className="text-green-800 bg-green-50 border border-green-200 p-4 rounded-lg flex gap-3">
              <span className="text-xl">✅</span>
              <div>
                <h4 className="font-extrabold text-sm">Chính xác tuyệt vời!</h4>
                <p className="text-xs mt-1 leading-relaxed">Bạn đã thiết lập một luồng dẫn dữ liệu tự động, tối ưu chi phí và chuẩn hóa khớp mã khách hàng thành công.</p>
              </div>
            </div>
          ) : (
            <div className="text-red-800 bg-red-50 border border-red-200 p-4 rounded-lg flex gap-3">
              <span className="text-xl">✗</span>
              <div>
                <h4 className="font-extrabold text-sm">Luồng pipeline hoặc quyết định vận hành của bạn chưa tối ưu!</h4>
                <p className="text-xs mt-1 leading-relaxed">Hãy đối chiếu với quy trình chuẩn của kỹ sư dữ liệu dưới đây để hiểu rõ lý do.</p>
              </div>
            </div>
          );
        })()}
        
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-3 text-slate-700">
          <h5 className="font-black text-slate-800 uppercase tracking-wider text-[10px]">Đáp án giải thích chi tiết:</h5>
          <div>
            <span className="font-bold text-slate-900">1. Thứ tự Pipeline chuẩn:</span>
            <p className="font-mono text-brand-700 font-bold mt-1 text-[11px]">Extract → Transform → Load → Model → Dashboard</p>
            <ul className="list-disc pl-4 mt-1 text-[11px] leading-relaxed text-slate-600 space-y-1">
              <li><strong>Extract (Trích xuất):</strong> Thu thập dữ liệu thô từ nhiều nguồn khác nhau (Ads, CRM, POS, GA4).</li>
              <li><strong>Transform (Biến đổi):</strong> Làm sạch, lọc nhiễu và định dạng lại dữ liệu trước khi nạp vào kho để đảm bảo đồng bộ.</li>
              <li><strong>Load (Tải):</strong> Đẩy dữ liệu đã làm sạch vào kho lưu trữ trung tâm (BigQuery).</li>
              <li><strong>Model (Mô hình hóa):</strong> Xây dựng các quan hệ khóa (Fact & Dimension) để dễ dàng truy vấn.</li>
              <li><strong>Dashboard (Biểu diễn):</strong> Kết nối công cụ BI để hiển thị trực quan thông tin cho doanh nghiệp.</li>
            </ul>
          </div>
          
          <div className="pt-2 border-t border-slate-200">
            <span className="font-bold text-slate-900">2. Vận hành Pipeline:</span>
            <p className="mt-1 leading-relaxed text-slate-600">Chọn <span className="font-bold text-green-700">Tự động theo lịch, có kiểm soát lỗi</span> là tối ưu nhất. Làm thủ công (Manual) rất dễ sai sót và mất thời gian, còn chạy liên tục (Realtime) tuy nhanh nhưng sẽ ngốn rất nhiều ngân sách máy chủ không cần thiết đối với quy mô doanh nghiệp này.</p>
          </div>
          
          <div className="pt-2 border-t border-slate-200">
            <span className="font-bold text-slate-900">3. Khớp Customer ID:</span>
            <p className="mt-1 leading-relaxed text-slate-600">Chọn <span className="font-bold text-green-700">Chuẩn hóa trước khi nối</span>. Customer ID từ CRM và Order System thường không khớp định dạng (ví dụ: chữ hoa/thường, khoảng trắng dư thừa). Nếu giữ nguyên (Ignore) hoặc xóa (Delete), bạn sẽ làm hỏng liên kết giữa hai bảng hoặc mất dữ liệu khách hàng khi thực hiện Join.</p>
          </div>
        </div>
      </div>
    )}
    <Button onClick={submitted ? nextStep : submit} disabled={!decisions.mode || !decisions.identity} size="lg" className="mx-auto mt-8 flex gap-2">{submitted ? 'Bước tiếp theo' : 'Chạy pipeline'} <ArrowRight /></Button>
  </div>;
};

const Title = () => <div className="mb-6 text-center"><p className="text-xs font-bold uppercase tracking-widest text-brand-600">15 điểm</p><h2 className="text-3xl font-black">Xây đúng đường đi của dữ liệu</h2><p className="mt-2 text-slate-600">Sắp xếp flow và đưa ra hai quyết định vận hành pipeline.</p></div>;
const SelectCard = ({ label, value, onChange, options, disabled }: { label: string; value?: string; onChange: (v: string) => void; options: string[][]; disabled: boolean }) => <Card className="p-5"><label className="mb-3 block font-bold">{label}</label><select disabled={disabled} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-300 p-3"><option value="">Chọn phương án</option>{options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select></Card>;
type Props = { state: GameState; updateState: (value: Partial<GameState>) => void; nextStep: () => void };
