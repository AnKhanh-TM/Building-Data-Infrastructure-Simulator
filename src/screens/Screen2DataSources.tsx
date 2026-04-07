import { useState } from 'react';
import type { GameState } from '../types/game';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScreenProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
  nextStep: () => void;
}

const SOURCES = [
  { id: 'ga4', label: 'Google Analytics (GA4)', icon: '📊' },
  { id: 'crm', label: 'Hệ thống CRM', icon: '👥' },
  { id: 'ads', label: 'Facebook / Google Ads', icon: '🎯' },
  { id: 'pos', label: 'Hệ thống Đơn hàng (POS/ERP)', icon: '🛒' },
  { id: 'email', label: 'Email Marketing', icon: '✉️' },
  { id: 'heatmap', label: 'Website Heatmap', icon: '🔥' },
];

const QUESTIONS = [
  { id: 'q_a', text: 'Funnel mua hàng đang rớt ở bước nào trên website?' },
  { id: 'q_b', text: 'Tỷ lệ khách hàng cũ quay lại mua thêm là bao nhiêu?' },
  { id: 'q_c', text: 'Kênh quảng cáo nào mang lại chi phí trên mỗi đơn hàng rẻ nhất?' },
  { id: 'q_d', text: 'Nhóm khách hàng nào mang lại nhiều doanh thu nhất?' },
  { id: 'q_e', text: 'Tỷ lệ khách hàng mở nhắc nhở khuyến mãi là bao nhiêu?' },
  { id: 'q_f', text: 'Người dùng hay bấm vào banner nào nhiều nhất trên trang chủ?' },
];

const CORRECT_MAPPINGS = {
  ga4: 'q_a',
  crm: 'q_b',
  ads: 'q_c',
  pos: 'q_d',
  email: 'q_e',
  heatmap: 'q_f',
};

export const Screen2DataSources = ({ state, updateState, nextStep }: ScreenProps) => {
  const isSubmitted = state.submittedSteps.includes(2);
  const [selectedSources, setSelectedSources] = useState<string[]>(state.selections.sources || []);
  const [mappings, setMappings] = useState<Record<string, string>>(state.selections.sourceQuestions || {});
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(isSubmitted);

  const toggleSource = (sourceId: string) => {
    if (isSubmitted) return;
    setSelectedSources(prev => {
      if (prev.includes(sourceId)) {
        const newMappings = { ...mappings };
        delete newMappings[sourceId];
        setMappings(newMappings);
        return prev.filter(id => id !== sourceId);
      }
      return [...prev, sourceId];
    });
    setError('');
  };

  const handleSelectQuestion = (sourceId: string, questionId: string) => {
    if (isSubmitted) return;
    setMappings(prev => ({ ...prev, [sourceId]: questionId }));
    setError('');
  };

  const handleSubmit = () => {
    // Check if at least 3 sources are selected
    if (selectedSources.length < 3) {
      setError('Vui lòng chọn ít nhất 3 data sources quan trọng.');
      return;
    }

    // Check if all selected sources have a question mapped
    const unmapped = selectedSources.filter(id => !mappings[id]);
    if (unmapped.length > 0) {
      setError('Vui lòng chọn câu hỏi kinh doanh (business question) tương ứng cho các sources đã chọn.');
      return;
    }

    // Must include core sources for this specific business objective
    const CORE_SOURCES = ['ga4', 'crm', 'pos'];
    const hasCore = CORE_SOURCES.filter(id => selectedSources.includes(id));
    if (hasCore.length < 2) {
       setError('Hãy suy nghĩ kỹ hơn. Để hiểu thói quen mua hàng, bạn nên cần những nguồn dữ liệu chứa hành vi web, danh sách khách hàng và lịch sử đơn hàng.');
       return;
    }

    // Calculate score (Max 25 pts)
    let correctCount = 0;
    selectedSources.forEach(source => {
      if (CORRECT_MAPPINGS[source as keyof typeof CORRECT_MAPPINGS] === mappings[source]) {
        correctCount++;
      }
    });

    const score = Math.min(5 + (correctCount * 5), 25);

    updateState({
      score: { ...state.score, sources: score },
      selections: { ...state.selections, sources: selectedSources, sourceQuestions: mappings },
      submittedSteps: [...state.submittedSteps, 2]
    });
    setShowFeedback(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Bước 1: Xác định Data Sources</h2>
        <p className="text-slate-600">
          Hãy chọn các Data Source phù hợp để trả lời mục tiêu kinh doanh và gắn với câu hỏi tương ứng.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SOURCES.map(source => {
          const isSelected = selectedSources.includes(source.id);
          const isCorrectMapping = mappings[source.id] === CORRECT_MAPPINGS[source.id as keyof typeof CORRECT_MAPPINGS];
          
          return (
            <Card 
              key={source.id} 
              className={cn(
                "p-4 transition-all duration-200 border-2",
                isSelected ? "border-brand-500 bg-brand-50/30" : "border-slate-200 hover:border-brand-200 cursor-pointer",
                showFeedback && isSelected && (isCorrectMapping ? "border-green-500 bg-green-50/50" : "border-amber-500 bg-amber-50/50"),
                isSubmitted && "cursor-default"
              )}
            >
              <div 
                className={cn("flex items-center justify-between mb-2", !isSubmitted && "cursor-pointer")}
                onClick={() => toggleSource(source.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{source.icon}</span>
                  <span className="font-semibold text-slate-800">{source.label}</span>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  isSelected ? "bg-brand-500 border-brand-500 text-white" : "border-slate-300"
                )}>
                  {isSelected && <CheckCircle2 size={16} />}
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-brand-100 animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-semibold text-brand-700 mb-2 uppercase tracking-wide">
                    Giải quyết câu hỏi nào?
                  </label>
                  <select 
                    className={cn(
                      "w-full text-sm p-2 rounded border border-brand-200 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-brand-500",
                      isSubmitted && "bg-slate-50 cursor-not-allowed"
                    )}
                    value={mappings[source.id] || ''}
                    onChange={(e) => handleSelectQuestion(source.id, e.target.value)}
                    disabled={isSubmitted}
                  >
                    <option value="" disabled>-- Chọn câu hỏi kinh doanh --</option>
                    {QUESTIONS.map(q => (
                      <option key={q.id} value={q.id} className="whitespace-normal">
                        {q.text}
                      </option>
                    ))}
                  </select>
                  
                  {showFeedback && (
                    <div className={cn(
                      "mt-3 text-xs p-2 rounded flex items-start gap-2",
                      isCorrectMapping ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    )}>
                      {isCorrectMapping ? <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> : <AlertCircle size={14} className="mt-0.5 shrink-0" />}
                      <p>
                        {isCorrectMapping 
                          ? "Chính xác! Source này cung cấp đúng dữ liệu để trả lời câu hỏi này." 
                          : `Chưa chuẩn. Câu hỏi này phù hợp hơn với ${SOURCES.find(s => s.id === Object.keys(CORRECT_MAPPINGS).find(key => CORRECT_MAPPINGS[key as keyof typeof CORRECT_MAPPINGS] === mappings[source.id]))?.label || 'nguồn khác'}.`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        {!isSubmitted ? (
          <Button onClick={handleSubmit} size="lg" className="flex items-center gap-2">
            Nộp bài <ArrowRight size={20} />
          </Button>
        ) : (
          <Button onClick={nextStep} size="lg" className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            Tiếp tục <ArrowRight size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};
