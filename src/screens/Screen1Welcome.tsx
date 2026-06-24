import { useState, type FormEvent } from 'react';
import { ArrowRight, Building2, Mail, User } from 'lucide-react';
import type { GameState } from '../types/game';
import { BUSINESS_QUESTIONS } from '../lib/constants';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

export const Screen1Welcome = ({ state, updateState, nextStep, register }: {
  state: GameState; updateState: (value: Partial<GameState>) => void; nextStep: () => void;
  register: (profile: GameState['profile']) => void;
}) => {
  const [name, setName] = useState(state.profile.name);
  const [email, setEmail] = useState(state.profile.email);
  const [classNumber, setClassNumber] = useState(state.profile.classCode.replace('AISYS', ''));
  const [question, setQuestion] = useState(state.selections.businessQuestion);
  const [registered, setRegistered] = useState(Boolean(state.submission.id));
  const [error, setError] = useState('');

  const submitProfile = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !/^\d{2}$/.test(classNumber)) {
      setError('Vui lòng nhập đủ họ tên, email hợp lệ và đúng 2 chữ số mã lớp.');
      return;
    }
    register({ name: name.trim(), email: email.trim().toLowerCase(), classCode: `AISYS${classNumber}` });
    setRegistered(true);
  };

  const QUESTION_EXPLANATIONS: Record<string, { correct: boolean; text: string }> = {
    quality_channel: {
      correct: true,
      text: "Chính xác! Đây là câu hỏi nghiệp vụ rất gần với doanh thu thực tế (Revenue) và mức độ giữ chân khách hàng (Retention), giúp doanh nghiệp trực tiếp tối ưu hóa ngân sách Marketing & Sales."
    },
    most_clicks: {
      correct: false,
      text: "Lượt click chỉ là chỉ số tương tác (Vanity Metric). Nhiều click không đồng nghĩa với việc khách hàng sẽ mua hàng hoặc quay lại, do đó không giúp tối ưu ngân sách thật."
    },
    server_speed: {
      correct: false,
      text: "Đây là câu hỏi mang tính hạ tầng kỹ thuật (IT/Infrastructure). Dù quan trọng cho hệ thống vận hành nhưng nó không giải quyết trực tiếp bài toán tối ưu ngân sách Marketing & Sales."
    },
    all_dashboard: {
      correct: false,
      text: "Lập dashboard 'tổng hợp tất cả' là sai lầm phổ biến. Khi chưa rõ câu hỏi cần trả lời, bạn sẽ tạo ra một báo cáo khổng lồ gây loãng thông tin, lãng phí thời gian và khó ra quyết định."
    }
  };

  const submitted = state.submittedSteps.includes(1);

  const submitQuestion = () => {
    if (!question) return;
    const score = question === 'quality_channel' ? 10 : 0;
    updateState({
      score: { ...state.score, businessQuestion: score },
      selections: { ...state.selections, businessQuestion: question },
      submittedSteps: [...new Set([...state.submittedSteps, 1])],
    });
  };

  if (!registered) return (
    <Card className="mx-auto max-w-2xl overflow-hidden shadow-xl">
      <div className="bg-slate-900 p-8 text-white">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-300">Case Study</p>
        <h2 className="text-3xl font-black">RetailCo đang tăng trưởng chậm</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">Dữ liệu nằm rải rác giữa Ads, GA4, CRM, Order System, Email và POS. Các team tranh luận bằng những KPI khác nhau, trong khi ngân sách marketing vẫn đang target dàn trải.</p>
      </div>
      <form onSubmit={submitProfile} className="space-y-4 p-8">
        <h3 className="text-xl font-bold">Thông tin học viên</h3>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
        <Field icon={<User size={18} />} label="Họ và tên"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" className="field-input" /></Field>
        <Field icon={<Mail size={18} />} label="Email đăng ký với TM"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="field-input" /></Field>
        <Field icon={<Building2 size={18} />} label="Mã lớp">
          <div className="flex"><span className="rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 px-4 py-3 font-bold text-slate-600">AISYS</span><input inputMode="numeric" maxLength={2} value={classNumber} onChange={(e) => setClassNumber(e.target.value.replace(/\D/g, '').slice(0, 2))} placeholder="01" className="field-input rounded-l-none" /></div>
        </Field>
        <Button type="submit" size="lg" className="w-full gap-2">Vào case <ArrowRight size={20} /></Button>
      </form>
    </Card>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 text-center"><p className="text-xs font-bold uppercase tracking-widest text-brand-600">10 điểm</p><h2 className="text-3xl font-black">Bạn phải bắt đầu từ đâu?</h2><p className="mt-2 text-slate-600">Chọn một business question đủ gần revenue để làm use case MVP đầu tiên.</p></div>
      
      <div className="grid gap-3">
        {BUSINESS_QUESTIONS.map((item) => {
          const isSelected = question === item.id;
          const isCorrectAnswer = item.id === 'quality_channel';
          
          let cardStyle = 'border-slate-200 hover:border-brand-200';
          if (isSelected && !submitted) {
            cardStyle = 'border-brand-500 bg-brand-50';
          } else if (submitted) {
            if (isCorrectAnswer) {
              cardStyle = 'border-green-500 bg-green-50/40 text-green-900';
            } else if (isSelected) {
              cardStyle = 'border-red-500 bg-red-50/40 text-red-900';
            } else {
              cardStyle = 'border-slate-100 opacity-50 bg-slate-50/10 text-slate-400';
            }
          }

          return (
            <button 
              key={item.id} 
              disabled={submitted}
              onClick={() => setQuestion(item.id)} 
              className={cn(
                'rounded-xl border-2 bg-white p-5 text-left font-semibold transition flex justify-between items-center w-full',
                cardStyle
              )}
            >
              <span>{item.label}</span>
              {submitted && (
                <div className="flex gap-2">
                  {isCorrectAnswer && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-green-600">
                      {isSelected ? 'Đúng (Đáp án)' : 'Đáp án đúng'}
                    </span>
                  )}
                  {isSelected && !isCorrectAnswer && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-red-600">
                      Bạn chọn - Sai
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {submitted && question && (
        <div className={cn(
          'mt-6 p-5 rounded-xl border text-sm leading-relaxed animate-fadeIn',
          QUESTION_EXPLANATIONS[question].correct 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        )}>
          <p className="font-bold mb-1">
            {QUESTION_EXPLANATIONS[question].correct ? '✅ Hoàn toàn chính xác!' : '❌ Chưa chính xác!'}
          </p>
          <p>{QUESTION_EXPLANATIONS[question].text}</p>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        {submitted ? (
          <Button onClick={nextStep} size="lg" className="gap-2 bg-brand-600 hover:bg-brand-700 text-white shadow">
            <span>Bước tiếp theo</span>
            <ArrowRight size={20} />
          </Button>
        ) : (
          <Button onClick={submitQuestion} disabled={!question} size="lg" className="gap-2">
            <span>Chốt Business Question</span>
            <ArrowRight size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

const Field = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <label className="block"><span className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">{icon}{label}</span>{children}</label>
);
