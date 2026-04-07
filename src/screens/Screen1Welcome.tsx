import React, { useState } from 'react';
import type { GameState } from '../types/game';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, KeyRound, ArrowRight, Target } from 'lucide-react';

interface ScreenProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
  nextStep: () => void;
}

export const Screen1Welcome = ({ state, updateState, nextStep }: ScreenProps) => {
  const [name, setName] = useState(state.profile.name);
  const [classCode, setClassCode] = useState(state.profile.classCode);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !classCode.trim()) return;

    updateState({
      profile: { name: name.trim(), classCode: classCode.trim() },
      score: { ...state.score, info: 0 } // No points for info anymore
    });
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!isSubmitted ? (
        <Card className="p-8 shadow-xl border-t-4 border-t-brand-500">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Build Your Data System</h2>
            <p className="text-slate-500">Thử thách xây dựng Data Infrastructure</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Họ và Tên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors outline-none text-slate-800"
                    placeholder="VD: Nguyễn Văn A"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Mã Lớp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors outline-none text-slate-800"
                    placeholder="VD: ABC01"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full flex items-center gap-2 text-lg mt-4">
              Bắt đầu thử thách <ArrowRight size={20} />
            </Button>
          </form>
        </Card>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="p-8 shadow-xl bg-gradient-to-br from-white to-brand-50 border-brand-200">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center shadow-inner">
                <Target size={32} />
              </div>
            </div>

            <div className="text-center space-y-4 mb-8">
              <h3 className="text-sm font-bold tracking-widest text-brand-600 uppercase">Business Objective</h3>
              <p className="text-2xl font-semibold text-slate-800 leading-snug">
                Doanh nghiệp muốn: <br />
                <span className="text-brand-700">"Hiểu rõ thói quen mua hàng của khách hàng để đưa ra chiến lược marketing & sales hiệu quả hơn."</span>
              </p>
            </div>

            <div className="bg-white/60 p-4 rounded-lg border border-brand-100 text-slate-600 text-center mb-8 text-sm">
              Nhiệm vụ của bạn là xây dựng một Data Infrastructure từ đầu đến cuối để giải quyết được bài toán kinh doanh này.
            </div>

            <Button onClick={nextStep} size="lg" className="w-full flex items-center gap-2 text-lg shadow-lg shadow-brand-500/20">
              Tiếp tục <ArrowRight size={20} />
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
