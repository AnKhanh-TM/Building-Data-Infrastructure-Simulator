import { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  CloudOff, 
  History, 
  RefreshCw, 
  RotateCcw, 
  Trophy,
  ArrowRight,
  Database,
  GitBranch,
  Layout,
  HelpCircle
} from 'lucide-react';
import type { GameState, GameScore } from '../types/game';
import { getRank, getTotalScore } from '../types/game';
import { isWebhookConfigured } from '../lib/submission';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { 
  BUSINESS_QUESTIONS, 
  MAPPING_TASKS, 
  PIPELINE_STEPS, 
  WAREHOUSE_OPTIONS, 
  CORRECT_MODEL_CONNECTIONS,
  DASHBOARD_OPTIONS
} from '../lib/constants';

const EXPECTED_METRICS = ['revenue', 'cac', 'ltv', 'repeat_rate', 'roas'];
const EXPECTED_FIELDS = ['customer_id', 'source_campaign', 'order_value', 'order_date', 'ad_spend'];


const LABELS: Record<keyof GameScore, [string, number]> = {
  businessQuestion: ['Business Question', 10], 
  dataMapping: ['Data Mapping', 15], 
  pipeline: ['Pipeline & ETL', 15],
  warehouse: ['Data Warehouse', 10], 
  dataModel: ['Data Model', 20], 
  dashboard: ['ADO & Dashboard', 20], 
  opportunity: ['AI Opportunity', 10],
};

const FIELD_LABELS: Record<string, string> = {
  source_campaign: 'Kênh Marketing (Source/Campaign)',
  order_revenue: 'Doanh thu (Order Revenue)',
  customer_id: 'Khách hàng (Customer ID)',
  order_date: 'Ngày mua hàng (Order Date)',
  ad_spend: 'Chi phí quảng cáo (Ad Spend)',
  customer_revenue: 'Doanh thu theo khách (LTV)',
  email_open: 'Tỷ lệ mở Email',
  cpu_usage: 'Hiệu suất Server'
};

const SOURCE_LABELS: Record<string, string> = {
  ads: 'Ads Platforms',
  ga4: 'GA4 (Google Analytics)',
  orders: 'Order System',
  crm: 'CRM',
  email: 'Email Automation',
  pos: 'Offline POS'
};

export const Screen7Result = ({ state, retrySync, resetGame }: { state: GameState; retrySync: () => void; resetGame: () => void }) => {
  const [review, setReview] = useState(false);
  const total = getTotalScore(state.score);
  const weak = (Object.entries(state.score) as [keyof GameScore, number][]).filter(([key, value]) => value < LABELS[key][1] * .6);
  
  const sel = state.selections;

  return <div className="mx-auto max-w-4xl space-y-6">
    <Card className="overflow-hidden text-center shadow-2xl">
      <div className="h-2 bg-gradient-to-r from-brand-500 via-green-500 to-amber-500" />
      <div className="p-8 sm:p-10">
        <Trophy size={58} className="mx-auto mb-4 text-amber-500 animate-bounce" />
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Case hoàn thành</p>
        <h2 className="text-4xl font-black text-slate-800">{total}/100</h2>
        <p className="mt-2 text-xl font-bold text-slate-600">{getRank(total)}</p>
        
        <div className="mt-6">
          <SyncStatus status={state.submission.completeSync} configured={isWebhookConfigured} />
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            {state.submission.completeSync === 'failed' && (
              <Button onClick={retrySync} variant="outline" className="gap-2">
                <RefreshCw size={18} /> Gửi lại kết quả
              </Button>
            )}
            <Button onClick={() => setReview(!review)} variant="outline" className="gap-2">
              <History size={18} /> {review ? 'Ẩn review' : 'Xem review chi tiết'}
            </Button>
            <Button onClick={resetGame} className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
              <RotateCcw size={18} /> Làm lại từ đầu
            </Button>
          </div>
        </div>
      </div>
    </Card>

    {weak.length > 0 && (
      <Card className="border-amber-200 bg-amber-50 p-5 shadow-sm">
        <h3 className="flex items-center gap-2 font-black text-amber-900"><AlertTriangle /> Mảng kiến thức cần ôn tập thêm</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {weak.map(([key]) => <span key={key} className="rounded-full bg-white border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-sm">{LABELS[key][0]}</span>)}
        </div>
      </Card>
    )}

    {review && (
      <div className="space-y-4 animate-fadeIn">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-lg font-black text-slate-800">Báo cáo chi tiết & So sánh đáp án</h3>
          <p className="text-xs text-slate-400">Xem lại các lựa chọn của bạn (màu đỏ nếu sai) đối chiếu với đáp án chuẩn của chuyên gia (màu xanh lá).</p>
        </div>

        {/* Step 1 Review */}
        <Card className="p-5 space-y-3 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 text-sm">Bước 1: Chọn Business Question</h4>
            <ScoreBadge score={state.score.businessQuestion} max={10} />
          </div>
          <div className="text-xs space-y-2">
            <div>
              <span className="text-slate-400 uppercase font-black text-[9px] block">Lựa chọn của bạn</span>
              <span className={cn(
                "font-semibold p-2 rounded block mt-1 border",
                sel.businessQuestion === 'quality_channel' 
                  ? "bg-green-50 border-green-200 text-green-800" 
                  : "bg-red-50 border-red-200 text-red-800"
              )}>
                {BUSINESS_QUESTIONS.find(q => q.id === sel.businessQuestion)?.label || sel.businessQuestion || 'Chưa chọn'}
              </span>
            </div>
            {sel.businessQuestion !== 'quality_channel' && (
              <div>
                <span className="text-green-700 font-bold block mt-1">
                  ✓ Đáp án đúng: Kênh nào mang lại khách hàng mua nhiều và quay lại?
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Step 2 Review */}
        <Card className="p-5 space-y-3 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 text-sm">Bước 2: ASK → DATA Mapping (Ánh xạ dữ liệu)</h4>
            <ScoreBadge score={state.score.dataMapping} max={15} />
          </div>
          <div className="text-xs space-y-4">
            {MAPPING_TASKS.map((task) => {
              const userMap = sel.sourceMappings[task.id] || { fields: [], sources: [] };
              const pickedFields = userMap.fields || [];
              const pickedSources = userMap.sources || [];
              
              const isCorrectFields = task.requiredFields.every(f => pickedFields.includes(f)) && pickedFields.every(f => task.requiredFields.includes(f));
              const isCorrectSources = task.requiredSources.every(s => pickedSources.includes(s)) && pickedSources.every(s => task.requiredSources.includes(s));
              
              const missedFields = task.requiredFields.filter(f => !pickedFields.includes(f));
              const missedSources = task.requiredSources.filter(s => !pickedSources.includes(s));
              
              return (
                <div key={task.id} className="border-t border-slate-100 pt-3 first:border-0 first:pt-0 space-y-2">
                  <p className="font-bold text-slate-700">{task.question}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Fields */}
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 block uppercase">Trường thông tin (Fields)</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {pickedFields.map(fId => {
                          const isCorrect = task.requiredFields.includes(fId);
                          return (
                            <span key={fId} className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold border", isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800")}>
                              {isCorrect ? '✓' : '✗'} {FIELD_LABELS[fId] || fId}
                            </span>
                          );
                        })}
                        {missedFields.map(fId => (
                          <span key={`missed-${fId}`} className="px-1.5 py-0.5 rounded text-[10px] font-semibold border border-dashed border-amber-300 bg-amber-50/50 text-amber-800">
                            ⚠ [Thiếu] {FIELD_LABELS[fId] || fId}
                          </span>
                        ))}
                        {pickedFields.length === 0 && missedFields.length === 0 && <span className="text-slate-400 italic">Trống</span>}
                      </div>
                      {!isCorrectFields && (
                        <div className="mt-2 text-green-700 text-[10px] font-bold">
                          Đáp án đúng: {task.requiredFields.map(f => FIELD_LABELS[f]).join(', ')}
                        </div>
                      )}
                    </div>
                    {/* Sources */}
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 block uppercase">Nguồn lưu trữ (Sources)</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {pickedSources.map(sId => {
                          const isCorrect = task.requiredSources.includes(sId);
                          return (
                            <span key={sId} className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold border", isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800")}>
                              {isCorrect ? '✓' : '✗'} {SOURCE_LABELS[sId] || sId}
                            </span>
                          );
                        })}
                        {missedSources.map(sId => (
                          <span key={`missed-${sId}`} className="px-1.5 py-0.5 rounded text-[10px] font-semibold border border-dashed border-amber-300 bg-amber-50/50 text-amber-800">
                            ⚠ [Thiếu] {SOURCE_LABELS[sId] || sId}
                          </span>
                        ))}
                        {pickedSources.length === 0 && missedSources.length === 0 && <span className="text-slate-400 italic">Trống</span>}
                      </div>
                      {!isCorrectSources && (
                        <div className="mt-2 text-green-700 text-[10px] font-bold">
                          Đáp án đúng: {task.requiredSources.map(s => SOURCE_LABELS[s]).join(' + ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Step 3 Review */}
        <Card className="p-5 space-y-3 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 text-sm">Bước 3: Pipeline & ETL</h4>
            <ScoreBadge score={state.score.pipeline} max={15} />
          </div>
          <div className="text-xs space-y-3">
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase block">Thứ tự luồng dẫn dữ liệu của bạn:</span>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {sel.pipelineOrder.map((stepId, idx) => {
                  const expectedOrder = PIPELINE_STEPS.map(([id]) => id);
                  const isCorrectPos = stepId === expectedOrder[idx];
                  return (
                    <div key={stepId} className="flex items-center gap-1">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-semibold border",
                        isCorrectPos ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                      )}>
                        {idx + 1}. {PIPELINE_STEPS.find(([id]) => id === stepId)?.[1]?.split(' ')[0] || stepId}
                      </span>
                      {idx < sel.pipelineOrder.length - 1 && <span className="text-slate-300">→</span>}
                    </div>
                  );
                })}
              </div>
              {JSON.stringify(sel.pipelineOrder) !== JSON.stringify(PIPELINE_STEPS.map(([id]) => id)) && (
                <div className="mt-2 text-green-700 font-bold text-[10px]">
                  ✓ Thứ tự đúng: Extract → Transform → Load → Model → Dashboard
                </div>
              )}
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase block">Cách vận hành pipeline:</span>
                <span className={cn(
                  "font-semibold block p-1 px-2 rounded mt-1 border text-[10px] w-fit",
                  sel.pipelineDecisions.mode === 'automated' ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                )}>
                  {sel.pipelineDecisions.mode === 'automated' ? 'Tự động theo lịch (Đúng)' : sel.pipelineDecisions.mode === 'manual' ? 'Thủ công (Sai)' : 'Realtime (Chưa tối ưu chi phí)'}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase block">Định dạng Customer ID:</span>
                <span className={cn(
                  "font-semibold block p-1 px-2 rounded mt-1 border text-[10px] w-fit",
                  sel.pipelineDecisions.identity === 'normalize' ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                )}>
                  {sel.pipelineDecisions.identity === 'normalize' ? 'Chuẩn hóa trước khi nối (Đúng)' : 'Bỏ qua / Xóa (Sai)'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 4 Review */}
        <Card className="p-5 space-y-3 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 text-sm">Bước 4: Data Warehouse</h4>
            <ScoreBadge score={state.score.warehouse} max={10} />
          </div>
          <div className="text-xs space-y-3">
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase block">Lựa chọn kho lưu trữ:</span>
              <span className={cn(
                "font-semibold block p-2 rounded mt-1 border w-fit",
                sel.warehouseAnswer === 'bigquery' ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
              )}>
                {WAREHOUSE_OPTIONS.find(w => w.id === sel.warehouseAnswer)?.label || sel.warehouseAnswer || 'Chưa chọn'}
              </span>
              {sel.warehouseAnswer !== 'bigquery' && (
                <div className="mt-1.5 text-green-700 font-bold">✓ Đáp án đúng: BigQuery</div>
              )}
            </div>

              {(() => {
                const missedReasons = ['scale', 'ecosystem', 'automation'].filter(r => !sel.warehouseReasons.includes(r));
                const REASON_LABELS: Record<string, string> = {
                  scale: 'Scale tốt khi dữ liệu tăng',
                  ecosystem: 'Tích hợp tốt với GA4',
                  automation: 'Phù hợp pipeline tự động',
                };

                return (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Các lý do phù hợp bạn đã chọn:</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {sel.warehouseReasons.map(rId => {
                        const isCorrect = ['scale', 'ecosystem', 'automation'].includes(rId);
                        const reasonLabel = rId === 'scale' ? 'Scale tốt khi dữ liệu tăng' : rId === 'ecosystem' ? 'Tích hợp tốt với GA4' : rId === 'automation' ? 'Phù hợp pipeline tự động' : rId === 'no_sql' ? 'Không cần biết SQL' : 'Luôn miễn phí';
                        return (
                          <span key={rId} className={cn("px-2 py-0.5 rounded text-[10px] font-semibold border", isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800")}>
                            {isCorrect ? '✓' : '✗'} {reasonLabel}
                          </span>
                        );
                      })}
                      {missedReasons.map(rId => (
                        <span key={`missed-${rId}`} className="px-2 py-0.5 rounded text-[10px] font-semibold border border-dashed border-amber-300 bg-amber-50/50 text-amber-800">
                          ⚠ [Thiếu] {REASON_LABELS[rId] || rId}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-green-700 text-[10px] font-bold">
                      Lý do đúng: Scale tốt khi dữ liệu tăng, Tích hợp GA4, Phù hợp tự động hóa.
                    </div>
                  </div>
                );
              })()}
          </div>
        </Card>

        {/* Step 5 Review */}
        <Card className="p-5 space-y-3 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 text-sm">Bước 5: Data Model (Star Schema)</h4>
            <ScoreBadge score={state.score.dataModel} max={20} />
          </div>
          <div className="text-xs space-y-2">
            <span className="text-[9px] font-black text-slate-400 uppercase block">Các mối nối bạn đã thiết lập:</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {sel.modelConnections.map(conn => {
                const isCorrect = CORRECT_MODEL_CONNECTIONS.includes(conn);
                return (
                  <span key={conn} className={cn("p-1.5 px-2.5 rounded font-mono text-[10px] border flex justify-between items-center", isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800")}>
                    <span>{conn.replace('>', ' → ')}</span>
                    <span className="font-bold">{isCorrect ? '✓' : '✗'}</span>
                  </span>
                );
              })}
              {CORRECT_MODEL_CONNECTIONS.filter(conn => !sel.modelConnections.includes(conn)).map(conn => (
                <span key={`missed-${conn}`} className="p-1.5 px-2.5 rounded font-mono text-[10px] border border-dashed border-amber-300 bg-amber-50/50 text-amber-800 flex justify-between items-center">
                  <span>⚠ [Thiếu] {conn.replace('>', ' → ')}</span>
                  <span className="font-bold">?</span>
                </span>
              ))}
            </div>
            <div className="mt-2 text-green-700 text-[10px] font-bold">
              Các mối nối đúng: 
              <ul className="list-disc pl-4 mt-1 font-mono text-[9px]">
                <li>fact_orders.customer_id → dim_customer.customer_id</li>
                <li>fact_orders.product_id → dim_product.product_id</li>
                <li>fact_orders.channel_id → dim_channel.channel_id</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Step 6 Review */}
        <Card className="p-5 space-y-3 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 text-sm">Bước 6: Dashboard Brief & AI</h4>
            <ScoreBadge score={state.score.dashboard + state.score.opportunity} max={30} />
          </div>
          <div className="text-xs space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase block">Business Question (ASK):</span>
                <span className={cn(
                  "font-semibold block p-1 px-2 rounded mt-1 border text-[10px]",
                  sel.dashboard.ask === 'quality_channel' ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                )}>
                  {sel.dashboard.ask === 'quality_channel' ? 'Kênh mua nhiều & quay lại (Đúng)' : 'Lượt click / Server (Sai)'}
                </span>
              </div>
              
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase block">Cơ hội mở rộng AI (Opportunity):</span>
                <span className={cn(
                  "font-semibold block p-1 px-2 rounded mt-1 border text-[10px]",
                  sel.opportunity === 'ads_agent' ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                )}>
                  {sel.opportunity === 'ads_agent' ? 'Ads Optimization Agent (Đúng)' : 'Nhận diện khuôn mặt/Chatbot (Chưa phù hợp)'}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase block">KPIs đã chọn:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {sel.dashboard.metrics.map(metricId => {
                    const isCorrect = EXPECTED_METRICS.includes(metricId);
                    const label = DASHBOARD_OPTIONS.metrics.find((x) => x[0] === metricId)?.[1] || metricId;
                    return (
                      <span key={metricId} className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold border", isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800")}>
                        {isCorrect ? '✓' : '✗'} {label}
                      </span>
                    );
                  })}
                  {EXPECTED_METRICS.filter(m => !sel.dashboard.metrics.includes(m)).map(mId => {
                    const label = DASHBOARD_OPTIONS.metrics.find((x) => x[0] === mId)?.[1] || mId;
                    return (
                      <span key={`missed-${mId}`} className="px-1.5 py-0.5 rounded text-[10px] font-semibold border border-dashed border-amber-300 bg-amber-50/50 text-amber-800">
                        ⚠ [Thiếu] {label}
                      </span>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase block">Fields đã chọn:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {sel.dashboard.fields.map(fId => {
                    const isCorrect = EXPECTED_FIELDS.includes(fId);
                    return (
                      <span key={fId} className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold border", isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800")}>
                        {isCorrect ? '✓' : '✗'} {FIELD_LABELS[fId] || fId}
                      </span>
                    );
                  })}
                  {EXPECTED_FIELDS.filter(f => !sel.dashboard.fields.includes(f)).map(fId => {
                    const label = DASHBOARD_OPTIONS.fields.find((x) => x[0] === fId)?.[1] || fId;
                    return (
                      <span key={`missed-${fId}`} className="px-1.5 py-0.5 rounded text-[10px] font-semibold border border-dashed border-amber-300 bg-amber-50/50 text-amber-800">
                        ⚠ [Thiếu] {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )}
  </div>;
};

const ScoreBadge = ({ score, max }: { score: number; max: number }) => (
  <span className={cn(
    "text-xs font-black px-2 py-1 rounded shadow-sm",
    score >= max * 0.8 ? "bg-green-600 text-white" : score >= max * 0.5 ? "bg-amber-500 text-white" : "bg-red-600 text-white"
  )}>
    {score}/{max}
  </span>
);

const SyncStatus = ({ status, configured }: { status: GameState['submission']['completeSync']; configured: boolean }) => {
  if (!configured) return <p className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800"><CloudOff size={18} /> Chưa cấu hình Google Sheets webhook. Kết quả vẫn được lưu trên thiết bị.</p>;
  if (status === 'synced') return <p className="flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-800"><CheckCircle2 size={18} /> Kết quả đã được ghi nhận trên Google Sheets.</p>;
  if (status === 'failed') return <p className="flex items-center justify-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700"><CloudOff size={18} /> Chưa gửi được kết quả. Bài làm không bị mất.</p>;
  return <p className="rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-700">Đang ghi nhận kết quả...</p>;
};

