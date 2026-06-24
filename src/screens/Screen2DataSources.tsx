import { useState } from 'react';
import { 
  ArrowRight, 
  Folder, 
  FolderOpen, 
  Info, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  BookOpen,
  Database,
  Check
} from 'lucide-react';
import type { GameState } from '../types/game';
import { FIELD_OPTIONS, MAPPING_TASKS, SOURCE_OPTIONS } from '../lib/constants';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

// Mapping business terms to technical terms
const BUSINESS_MAPPING: Record<string, { label: string; tech: string; desc: string; mainSources: string[] }> = {
  order_revenue: {
    label: 'Doanh thu',
    tech: 'order_revenue',
    desc: 'Giá trị tiền thanh toán thực tế của đơn hàng khi giao dịch thành công.',
    mainSources: ['orders']
  },
  source_campaign: {
    label: 'Kênh Marketing',
    tech: 'source_campaign',
    desc: 'Nguồn truy cập hoặc tên chiến dịch dẫn người dùng truy cập web (fb/ads, google/organic).',
    mainSources: ['ads', 'ga4']
  },
  customer_id: {
    label: 'Khách hàng',
    tech: 'customer_id',
    desc: 'Mã định danh duy nhất của mỗi khách hàng để lưu trữ và liên kết hành vi.',
    mainSources: ['crm', 'orders']
  },
  order_date: {
    label: 'Ngày mua hàng',
    tech: 'order_date',
    desc: 'Thời gian ghi nhận giao dịch mua hàng và cờ mua lặp lại (repeat flag).',
    mainSources: ['orders']
  },
  ad_spend: {
    label: 'Chi phí quảng cáo',
    tech: 'ad_spend',
    desc: 'Ngân sách thực tế đã tiêu tốn cho các chiến dịch hiển thị quảng cáo.',
    mainSources: ['ads']
  },
  customer_revenue: {
    label: 'Doanh thu theo khách',
    tech: 'customer_revenue',
    desc: 'Tổng số tiền tích lũy chi tiêu tính trên từng khách hàng (Lifetime Value - LTV).',
    mainSources: ['crm', 'orders']
  },
  email_open: {
    label: 'Tỷ lệ mở Email',
    tech: 'email_open',
    desc: 'Số lượng hoặc tỷ lệ khách hàng mở email chăm sóc tự động được gửi đi.',
    mainSources: ['email']
  },
  cpu_usage: {
    label: 'Hiệu suất Server',
    tech: 'cpu_usage',
    desc: 'Tần suất và mức độ xử lý chip của máy chủ, dùng đo lường sức mạnh kỹ thuật.',
    mainSources: []
  }
};

const TASK_HINTS: Record<string, string> = {
  revenue_channel: '💡 Để biết doanh thu thực tế phát sinh từ đâu, bạn cần tìm thông tin "Doanh thu" ở hệ thống lưu đơn hàng. Đồng thời, để đối chiếu kênh quảng cáo nào dẫn họ vào web, bạn cần thông tin truy cập web ghi nhận chiến dịch.',
  repeat_customer: '💡 Muốn biết "Kênh nào" khách hàng quay lại mua, bạn bắt buộc phải có thông tin định danh "Khách hàng" để biết họ là ai, "Ngày mua hàng" để kiểm tra giao dịch lặp lại, và trường "Kênh Marketing" từ GA4 để biết nguồn gốc truy cập của đơn hàng.',
  cac_ltv: '💡 Chi phí chạy chiến dịch quảng cáo được cấu hình và tiêu tiền ở các nền tảng chạy Ads. Còn giá trị khách hàng đóng góp trọn đời (LTV) tính trên tổng chi tiêu đơn hàng của họ ở CRM hoặc Order System.'
};

const TASK_FEEDBACK: Record<string, { success: string; error: string }> = {
  revenue_channel: {
    success: '✅ Chính xác! Doanh thu thực tế (order_revenue) chỉ được sinh ra và ghi nhận chính xác tại Order System. Để biết doanh thu đó đến từ kênh tiếp thị nào, bạn đối chiếu trường source_campaign từ GA4 (hệ thống lưu vết truy cập web).',
    error: '❌ Chưa chuẩn xác. Hãy nhớ: Doanh thu thật nằm ở hệ thống đặt hàng (Order System), còn chiến dịch quảng cáo dẫn khách đến web do Google Analytics (GA4) ghi nhận.'
  },
  repeat_customer: {
    success: '✅ Chính xác! Để phân tích khách quay lại theo kênh, bạn cần kết hợp Mã khách hàng (customer_id) & Ngày mua hàng (order_date) từ Order System/CRM, cùng với Kênh Marketing (source_campaign) từ GA4 để truy vết nguồn gốc truy cập.',
    error: '❌ Chưa chuẩn xác. Muốn biết từ "kênh nào" quay lại mua, bạn bắt buộc phải chọn "Kênh Marketing" (source_campaign) được lưu trữ tại GA4, kết hợp dữ liệu định danh và giao dịch từ CRM và Order System.'
  },
  cac_ltv: {
    success: '✅ Chính xác! Chi phí quảng cáo (ad_spend) được lưu trữ tại nền tảng Ads. Doanh thu tích lũy của từng khách hàng (customer_revenue) để tính LTV được quản lý trong CRM và hệ thống Order.',
    error: '❌ Chưa chuẩn xác. Chi phí quảng cáo chỉ tồn tại trên Ads Platforms. Doanh thu của khách hàng nằm ở CRM / Order System.'
  }
};

// Data Catalog structure containing categories and items
const DATA_CATALOG = [
  {
    id: 'ads',
    name: 'Ads Platforms',
    desc: 'Nơi thiết lập và chạy quảng cáo (Facebook/Google Ads). Lưu chi phí, lượt hiển thị, click.',
    theme: 'border-blue-200 bg-blue-50/50 text-blue-900 ring-blue-500/20',
    headerTheme: 'bg-blue-600 text-white',
    fields: [
      { id: 'source_campaign', name: 'Source / campaign', desc: 'Nguồn & chiến dịch quảng cáo' },
      { id: 'ad_spend', name: 'Ad spend', desc: 'Ngân sách chi phí quảng cáo đã tiêu' },
      { id: 'clicks', name: 'Clicks (Lượt click)', desc: 'Tổng số lượt click vào quảng cáo', mock: true },
      { id: 'impressions', name: 'Impressions (Hiển thị)', desc: 'Lượt hiển thị của bài viết quảng cáo', mock: true },
    ]
  },
  {
    id: 'ga4',
    name: 'GA4 (Google Analytics)',
    desc: 'Theo dõi hành vi người dùng trên website (lượt xem trang, nguồn truy cập, thiết bị).',
    theme: 'border-amber-200 bg-amber-50/50 text-amber-900 ring-amber-500/20',
    headerTheme: 'bg-amber-600 text-white',
    fields: [
      { id: 'source_campaign', name: 'Source / campaign', desc: 'Nguồn & chiến dịch dẫn khách vào web' },
      { id: 'sessions', name: 'Sessions (Phiên)', desc: 'Số phiên truy cập của người dùng trên web', mock: true },
      { id: 'landing_page', name: 'Landing page (Trang đích)', desc: 'Trang đầu tiên người dùng click vào', mock: true },
      { id: 'device', name: 'Device (Thiết bị)', desc: 'Thiết bị người dùng sử dụng (Mobile/Desktop)', mock: true },
    ]
  },
  {
    id: 'orders',
    name: 'Order System (Đơn hàng)',
    desc: 'Hệ thống quản lý đơn hàng. Lưu thông tin thanh toán, giá trị, thời gian và trạng thái.',
    theme: 'border-emerald-200 bg-emerald-50/50 text-emerald-900 ring-emerald-500/20',
    headerTheme: 'bg-emerald-600 text-white',
    fields: [
      { id: 'order_revenue', name: 'Order ID / revenue', desc: 'Doanh thu và mã số của đơn hàng' },
      { id: 'customer_id', name: 'Customer ID', desc: 'Mã số khách hàng thực hiện thanh toán đơn hàng' },
      { id: 'order_date', name: 'Order date / repeat flag', desc: 'Ngày giờ đặt hàng và cờ mua lặp lại' },
      { id: 'customer_revenue', name: 'Revenue theo customer', desc: 'Tổng tiền tích lũy từ các đơn hàng' },
    ]
  },
  {
    id: 'crm',
    name: 'CRM (Hồ sơ khách hàng)',
    desc: 'Lưu trữ hồ sơ cá nhân khách hàng, lịch sử chăm sóc và phân khúc phân loại.',
    theme: 'border-teal-200 bg-teal-50/50 text-teal-900 ring-teal-500/20',
    headerTheme: 'bg-teal-600 text-white',
    fields: [
      { id: 'customer_id', name: 'Customer ID', desc: 'Mã số định danh khách hàng trong tệp khách hàng' },
      { id: 'customer_revenue', name: 'Revenue theo customer', desc: 'Doanh thu trọn đời (LTV) tính theo khách' },
      { id: 'email', name: 'Email', desc: 'Địa chỉ thư điện tử cá nhân', mock: true },
      { id: 'phone', name: 'Phone', desc: 'Số điện thoại cá nhân khách hàng', mock: true },
      { id: 'segment', name: 'Segment (Phân khúc)', desc: 'Phân loại khách hàng (VIP, Tiềm năng, Chờ kích hoạt)', mock: true },
    ]
  },
  {
    id: 'email',
    name: 'Email Automation',
    desc: 'Hệ thống gửi thư chăm sóc khách hàng tự động và tiếp thị qua email.',
    theme: 'border-indigo-200 bg-indigo-50/50 text-indigo-900 ring-indigo-500/20',
    headerTheme: 'bg-indigo-600 text-white',
    fields: [
      { id: 'email_open', name: 'Email open rate', desc: 'Tỷ lệ mở thư tiếp thị được gửi đi' },
      { id: 'delivery_rate', name: 'Delivery rate', desc: 'Tỷ lệ gửi thư vào hòm thư thành công', mock: true },
    ]
  },
  {
    id: 'pos',
    name: 'Offline POS',
    desc: 'Hệ thống thanh toán tại quầy trực tiếp của các cửa hàng offline.',
    theme: 'border-purple-200 bg-purple-50/50 text-purple-900 ring-purple-500/25',
    headerTheme: 'bg-purple-600 text-white',
    fields: [
      { id: 'store_id', name: 'Store ID', desc: 'Mã cửa hàng phát sinh giao dịch', mock: true },
      { id: 'cashier_id', name: 'Cashier ID', desc: 'Mã số nhân viên thu ngân thanh toán', mock: true },
    ]
  }
];

export const Screen2DataSources = ({ state, updateState, nextStep }: Props) => {
  const submitted = state.submittedSteps.includes(2);
  const [mappings, setMappings] = useState<Record<string, { fields: string[]; sources: string[] }>>(() => {
    // Make sure all tasks are initialized to prevent undefined state issues
    const initial = { ...state.selections.sourceMappings };
    MAPPING_TASKS.forEach(t => {
      if (!initial[t.id]) {
        initial[t.id] = { fields: [], sources: [] };
      } else {
        // Safe check for legacy or corrupted local storage state
        initial[t.id] = {
          fields: Array.isArray((initial[t.id] as any).fields) ? (initial[t.id] as any).fields : [],
          sources: Array.isArray((initial[t.id] as any).sources) ? (initial[t.id] as any).sources : [],
        };
      }
    });
    return initial as Record<string, { fields: string[]; sources: string[] }>;
  });
  
  // Navigation for active task to reduce cognitive load (Tabbed workspace)
  const [activeTaskId, setActiveTaskId] = useState<string>(MAPPING_TASKS[0].id);
  
  // Expand/collapse folders for Data Catalog
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    ads: true,
    ga4: true,
    orders: true,
    crm: true
  });
  
  // Hovered field tracking for Data Dictionary Tooltip and Catalog highlighting
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  
  // Custom states for interactive elements
  const [showHint, setShowHint] = useState<boolean>(false);
  const [error, setError] = useState('');

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelection = (taskId: string, type: 'fields' | 'sources', optionId: string) => {
    if (submitted) return;
    setError('');
    
    const taskMapping = mappings[taskId] || { fields: [], sources: [] };
    const currentList = taskMapping[type] || [];
    
    const newList = currentList.includes(optionId) 
      ? currentList.filter(x => x !== optionId) 
      : [...currentList, optionId];
      
    setMappings({
      ...mappings,
      [taskId]: {
        ...taskMapping,
        [type]: newList
      }
    });
  };

  const activeTask = MAPPING_TASKS.find(t => t.id === activeTaskId)!;
  const currentSelection = mappings[activeTaskId] || { fields: [], sources: [] };
  const currentSelectionFields = currentSelection.fields || [];
  const currentSelectionSources = currentSelection.sources || [];

  const submit = () => {
    const incompleteTasks: string[] = [];
    MAPPING_TASKS.forEach((task, idx) => {
      if (!mappings[task.id]?.fields?.length || !mappings[task.id]?.sources?.length) {
        incompleteTasks.push(`Câu ${idx + 1}`);
      }
    });

    if (incompleteTasks.length > 0) {
      setError(`Bạn chưa điền đầy đủ. Vui lòng chọn ít nhất một thông tin và một nguồn dữ liệu tại: ${incompleteTasks.join(', ')} (hãy nhấp vào các Tab ở trên để hoàn tất).`);
      return;
    }
    
    let score = 0;
    MAPPING_TASKS.forEach((task) => {
      const answer = mappings[task.id] || { fields: [], sources: [] };
      const picked = [...(answer.fields || []), ...(answer.sources || [])];
      const correct = [...task.requiredFields, ...task.requiredSources];
      const correctCount = picked.filter((id) => correct.includes(id)).length;
      const wrongCount = picked.filter((id) => !correct.includes(id)).length;
      score += Math.max(0, Math.min(5, correctCount * 1.5 - wrongCount));
    });
    
    updateState({ 
      score: { ...state.score, dataMapping: Math.round(score) }, 
      selections: { ...state.selections, sourceMappings: mappings }, 
      submittedSteps: [...new Set([...state.submittedSteps, 2])] 
    });
  };

  const getFieldInfo = (fieldId: string | null) => {
    if (!fieldId) return null;
    if (BUSINESS_MAPPING[fieldId]) {
      return {
        label: BUSINESS_MAPPING[fieldId].label,
        tech: BUSINESS_MAPPING[fieldId].tech,
        desc: BUSINESS_MAPPING[fieldId].desc,
        mainSources: BUSINESS_MAPPING[fieldId].mainSources || []
      };
    }
    for (const source of DATA_CATALOG) {
      const f = source.fields.find(field => field.id === fieldId);
      if (f) {
        return {
          label: f.name,
          tech: f.id,
          desc: f.desc,
          mainSources: [source.id]
        };
      }
    }
    return null;
  };

  // Helper to determine if a source card should be highlighted based on selections/hover
  const isSourceHighlighted = (sourceId: string) => {
    // Highlight if selected by the user for the current task
    if (currentSelectionSources.includes(sourceId)) return true;
    
    // Highlight if the user is hovering over a field that belongs to this source
    if (hoveredField) {
      const info = getFieldInfo(hoveredField);
      if (info && info.mainSources.includes(sourceId)) return true;
    }
    
    // Highlight if any selected field in the current task belongs to this source
    const hasSelectedFieldInSource = currentSelectionFields.some(fieldId => {
      const info = getFieldInfo(fieldId);
      return info && info.mainSources.includes(sourceId);
    });
    if (hasSelectedFieldInSource) return true;

    return false;
  };

  // Check if answers for active task are correct for feedback display
  const isActiveTaskCorrect = () => {
    const picked = [...currentSelectionFields, ...currentSelectionSources];
    const correct = [...activeTask.requiredFields, ...activeTask.requiredSources];
    return correct.every(id => picked.includes(id)) && picked.every(id => correct.includes(id));
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">15 điểm</p>
        <h2 className="text-3xl font-black text-slate-800">ASK → DATA: Khám phá bản đồ dữ liệu</h2>
        <p className="mx-auto mt-2 max-w-3xl text-sm text-slate-500">
          Hãy đóng vai trò một Data Analyst. Bạn có 3 câu hỏi nghiệp vụ. Hãy chọn các trường dữ liệu cần thiết và nguồn lưu trữ phù hợp trong danh mục Catalog bên phải.
        </p>
      </div>

      {/* Tabs navigation for active task */}
      <div className="flex border-b border-slate-200 gap-1 bg-slate-100/80 p-1.5 rounded-xl">
        {MAPPING_TASKS.map((task, idx) => {
          const isSelected = activeTaskId === task.id;
          const hasSelections = (mappings[task.id]?.fields?.length ?? 0) > 0 && (mappings[task.id]?.sources?.length ?? 0) > 0;
          const partiallySelected = (mappings[task.id]?.fields?.length ?? 0) > 0 || (mappings[task.id]?.sources?.length ?? 0) > 0;
          return (
            <button
              key={task.id}
              onClick={() => {
                setActiveTaskId(task.id);
                setError('');
                setShowHint(false);
              }}
              className={cn(
                'flex-1 text-center py-2.5 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2',
                isSelected 
                  ? 'bg-white text-brand-600 shadow-sm border border-slate-200/50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-black text-slate-600">
                {idx + 1}
              </span>
              <span className="truncate">{task.question}</span>
              {hasSelections ? (
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" title="Đã hoàn tất chọn" />
              ) : partiallySelected ? (
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" title="Chưa chọn đủ fields/sources" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300 shrink-0" title="Chưa điền" />
              )}
            </button>
          );
        })}
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Column: Selection Workspace */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 border-slate-200 shadow-sm relative overflow-hidden bg-white">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500" />
            
            <div className="flex justify-between items-start gap-2 mb-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Business Question</p>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">{activeTask.question}</h3>
              </div>
              <button 
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-2 py-1 rounded-md border border-brand-100 hover:border-brand-200 transition"
              >
                <Lightbulb size={13} />
                <span>Gợi ý</span>
              </button>
            </div>

            {showHint && (
              <div className="mb-4 rounded-lg bg-amber-50/70 border border-amber-200/60 p-3 text-xs leading-relaxed text-amber-900 animate-fadeIn">
                {TASK_HINTS[activeTaskId]}
              </div>
            )}

            {/* Step 1: Select Information (Business Terms) */}
            <div className="space-y-3 mt-4">
              <div>
                <span className="text-[10px] font-black uppercase text-brand-600 tracking-wider">Bước 1</span>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Chọn thông tin bạn cần để trả lời (Cần chọn {activeTask.requiredFields.length} trường)</h4>
              </div>
              
              <div className="grid gap-2 grid-cols-2">
                {FIELD_OPTIONS.map(([id]) => {
                  const item = BUSINESS_MAPPING[id];
                  if (!item) return null;
                  const isSelected = currentSelectionFields.includes(id);
                  
                  return (
                    <button
                      key={id}
                      disabled={submitted}
                      onMouseEnter={() => setHoveredField(id)}
                      onMouseLeave={() => setHoveredField(null)}
                      onClick={() => toggleSelection(activeTaskId, 'fields', id)}
                      className={cn(
                        'p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-20 group hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30',
                        isSelected 
                          ? 'border-brand-500 bg-brand-50/50 text-slate-800' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      )}
                    >
                      <div className="flex justify-between items-start w-full gap-1">
                        <span className="text-xs font-bold leading-tight line-clamp-2">{item.label}</span>
                        {isSelected && (
                          <span className="h-4 w-4 bg-brand-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      
                      {/* Mapping to technical term */}
                      <span className="font-mono text-[9px] text-slate-400 group-hover:text-brand-600 transition truncate mt-1">
                        {isSelected ? `↓ ${item.tech}` : item.tech}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Data Source (Where to get it) */}
            <div className="space-y-3 mt-6 pt-5 border-t border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-brand-600 tracking-wider">Bước 2</span>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Chọn nguồn lưu trữ thông tin này</h4>
              </div>

              <div className="grid gap-2 grid-cols-2">
                {SOURCE_OPTIONS.map(([id, label]) => {
                  const isSelected = currentSelectionSources.includes(id);
                  return (
                    <button
                      key={id}
                      disabled={submitted}
                      onClick={() => toggleSelection(activeTaskId, 'sources', id)}
                      className={cn(
                        'p-2.5 rounded-lg border text-left text-xs font-bold transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
                        isSelected 
                          ? 'border-brand-500 bg-brand-50/50 text-brand-800' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      )}
                    >
                      <Database size={13} className={isSelected ? 'text-brand-500' : 'text-slate-400'} />
                      <span className="truncate">{label}</span>
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-brand-600 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-step feedback (only shown when submitted) */}
            {submitted && (
              <div className="mt-5 p-3 rounded-lg text-xs border animate-fadeIn">
                {isActiveTaskCorrect() ? (
                  <div className="text-green-800 bg-green-50 border-green-100 flex gap-2">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-600" />
                    <p className="leading-relaxed">{TASK_FEEDBACK[activeTaskId].success}</p>
                  </div>
                ) : (
                  <div className="text-red-800 bg-red-50 border-red-100 flex gap-2">
                    <XCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                    <p className="leading-relaxed">
                      {TASK_FEEDBACK[activeTaskId].error}
                      <span className="block mt-1 font-bold text-green-800">
                        Đáp án đúng: Fields: {activeTask.requiredFields.map(f => BUSINESS_MAPPING[f]?.label).join(', ')} | Sources: {activeTask.requiredSources.map(s => DATA_CATALOG.find(c => c.id === s)?.name).join(' + ')}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

        </div>

        {/* Right Column: Data Catalog */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-slate-400" />
              <h3 className="text-sm font-black text-slate-700">Data Catalog (Danh mục Dữ liệu)</h3>
            </div>
            <span className="text-[10px] text-slate-400 italic">Nhấp vào thư mục để xem cấu trúc bên trong</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {DATA_CATALOG.map((source) => {
              const isExpanded = expandedFolders[source.id] ?? false;
              const isHighlighted = isSourceHighlighted(source.id);
              
              return (
                <div 
                  key={source.id} 
                  className={cn(
                    'rounded-xl border transition-all duration-200 overflow-hidden shadow-sm flex flex-col',
                    isHighlighted 
                      ? 'border-brand-500 ring-2 ring-brand-500/25 translate-y-[-1px] shadow' 
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  {/* Folder Header */}
                  <button
                    onClick={() => toggleFolder(source.id)}
                    className={cn(
                      'p-3.5 flex items-center justify-between font-bold text-left text-xs transition border-b border-slate-100',
                      isHighlighted ? 'bg-brand-500/10 text-brand-900' : 'bg-slate-50 text-slate-700 hover:bg-slate-100/50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <FolderOpen size={16} className="text-brand-500" />
                      ) : (
                        <Folder size={16} className="text-slate-400" />
                      )}
                      <span className="font-extrabold text-sm tracking-tight">{source.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {isExpanded ? 'Đóng' : `Xem (${source.fields.length})`}
                    </span>
                  </button>

                  {/* Folder Body */}
                  {isExpanded && (
                    <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        {/* Description */}
                        <p className="text-[11px] text-slate-400 leading-snug mb-3">
                          {source.desc}
                        </p>

                        {/* Fields List */}
                        <div className="space-y-1.5">
                          {source.fields.map((field) => {
                            const isFieldSelected = currentSelectionFields.includes(field.id);
                            
                            return (
                              <div
                                key={field.id}
                                onMouseEnter={() => setHoveredField(field.id)}
                                onMouseLeave={() => setHoveredField(null)}
                                className={cn(
                                  'flex flex-col p-2 rounded-lg border text-left text-[11px] transition-all relative',
                                  field.mock ? 'bg-slate-50/50 border-slate-100/70 text-slate-400' : 'border-slate-100 bg-white text-slate-600',
                                  isFieldSelected && !field.mock && 'bg-brand-50 border-brand-200 text-brand-800'
                                )}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-mono font-bold">{field.name}</span>
                                  {field.mock ? (
                                    <span className="text-[9px] bg-slate-100 text-slate-400 px-1 rounded-sm uppercase font-semibold">
                                      Mock (Bỏ qua)
                                    </span>
                                  ) : (
                                    <span className="text-[9px] bg-brand-50 text-brand-600 px-1 rounded-sm uppercase font-semibold">
                                      Use Case
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-0.5">{field.desc}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
      </div>

      {/* Global submission button */}
      <div className="flex flex-col items-center justify-center pt-4 border-t border-slate-200">
        <Button 
          onClick={submitted ? nextStep : submit} 
          size="lg" 
          className="w-full sm:w-auto min-w-[200px] gap-2 shadow bg-brand-600 hover:bg-brand-700 text-white"
        >
          <span>{submitted ? 'Chuyển sang Bước tiếp theo' : 'Nộp câu trả lời & Kiểm tra'}</span>
          <ArrowRight size={18} />
        </Button>
        <p className="text-[10px] text-slate-400 mt-2">
          Sau khi bấm Nộp, hệ thống sẽ kiểm tra và hiển thị feedback giải thích trực quan cho từng câu hỏi.
        </p>
        {error && (
          <div className="mt-3 rounded-lg bg-red-50 p-3.5 text-xs font-bold text-red-700 shadow-sm border border-red-100 flex items-center gap-2 max-w-xl text-left animate-fadeIn">
            <XCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

type Props = { 
  state: GameState; 
  updateState: (value: Partial<GameState>) => void; 
  nextStep: () => void 
};

