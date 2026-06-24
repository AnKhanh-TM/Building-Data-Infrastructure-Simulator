import { useState } from 'react';
import { ArrowRight, Link2, Lightbulb } from 'lucide-react';
import type { GameState } from '../types/game';
import { CORRECT_MODEL_CONNECTIONS, MODEL_TABLES } from '../lib/constants';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

const CONNECTIONS = [
  ...CORRECT_MODEL_CONNECTIONS,
  'dim_customer.customer_id>dim_product.product_id',
  'fact_orders.order_id>dim_customer.customer_id',
  'dim_channel.campaign>dim_product.category',
];

export const Screen5DataModel = ({ state, updateState, nextStep }: Props) => {
  const submitted = state.submittedSteps.includes(5);
  const [selected, setSelected] = useState(state.selections.modelConnections);
  const [showHint, setShowHint] = useState(false);

  const toggle = (id: string) => setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  
  const submit = () => {
    const correct = selected.filter((x) => CORRECT_MODEL_CONNECTIONS.includes(x)).length;
    const wrong = selected.length - correct;
    updateState({ score: { ...state.score, dataModel: Math.round(Math.max(0, Math.min(20, correct * 6.67 - wrong * 3))) }, selections: { ...state.selections, modelConnections: selected }, submittedSteps: [...new Set([...state.submittedSteps, 5])] });
  };

  return <div className="mx-auto max-w-6xl">
    <div className="mb-6 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">20 điểm</p>
      <h2 className="text-3xl font-black">Hoàn thiện Star Schema</h2>
      <p className="mt-2 text-slate-600">Fact Orders nằm ở trung tâm. Chọn tất cả quan hệ khóa đúng và tránh nối các dimensions tùy tiện.</p>
    </div>

    <div className="flex justify-center mb-5">
      <button 
        onClick={() => setShowHint(!showHint)}
        className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 transition shadow-sm"
      >
        <Lightbulb size={14} />
        <span>Gợi ý tư duy</span>
      </button>
    </div>

    {showHint && (
      <div className="mb-6 rounded-xl bg-amber-50/80 border border-amber-200/60 p-4 text-xs leading-relaxed text-amber-900 max-w-4xl mx-auto animate-fadeIn space-y-2">
        <p><strong>1. Mô hình hình Sao (Star Schema):</strong> Bảng Fact <code>fact_orders</code> (chứa các chỉ số đo lường như doanh thu) phải nằm ở tâm ngôi sao. Các bảng Dimension <code>dim_...</code> (chứa thuộc tính mô tả như thông tin khách hàng, sản phẩm, chiến dịch) bao quanh ngôi sao.</p>
        <p><strong>2. Nguyên tắc kết nối:</strong> Chỉ kết nối từ <strong>Fact → Dimension</strong> thông qua các khóa định danh tương ứng có mặt ở cả 2 bảng (ví dụ: trường <code>customer_id</code> ở bảng Fact nối tới <code>customer_id</code> ở bảng Dimension).</p>
        <p><strong>3. Tránh nối chéo các Dimension:</strong> Không bao giờ nối trực tiếp Dimension này với Dimension khác (ví dụ: không nối Customer trực tiếp sang Product) vì giữa chúng không có liên kết giao dịch trực tiếp, liên kết như vậy sẽ phá vỡ mô hình sao.</p>
      </div>
    )}

    <div className="grid gap-4 md:grid-cols-4">{Object.entries(MODEL_TABLES).map(([table, columns]) => <Card key={table} className={cn('overflow-hidden', table === 'fact_orders' && 'border-brand-400 ring-2 ring-brand-100')}><div className="bg-slate-900 p-3 text-sm font-black uppercase text-white">{table}</div><div className="p-3">{columns.map((column) => <p key={column} className="border-b border-slate-100 py-2 font-mono text-xs">{column}</p>)}</div></Card>)}</div>
    <Card className="mt-5 p-5"><h3 className="mb-4 font-bold">Chọn quan hệ</h3><div className="grid gap-2 md:grid-cols-2">{CONNECTIONS.map((connection) => <button disabled={submitted} key={connection} onClick={() => toggle(connection)} className={cn('flex items-center gap-2 rounded-lg border p-3 text-left font-mono text-xs', selected.includes(connection) ? 'border-brand-500 bg-brand-50' : 'border-slate-200')}><Link2 size={16} />{connection.replace('>', ' → ')}</button>)}</div></Card>
    {submitted && <p className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-800">Star Schema đúng nối Fact Orders tới Customer, Product và Channel bằng các foreign key tương ứng. Model này cho phép phân tích revenue và retention theo channel.</p>}
    <Button disabled={!selected.length} onClick={submitted ? nextStep : submit} size="lg" className="mx-auto mt-8 flex gap-2">{submitted ? 'Thiết kế dashboard' : 'Kiểm tra model'} <ArrowRight /></Button>
  </div>;
};

type Props = { state: GameState; updateState: (value: Partial<GameState>) => void; nextStep: () => void };
