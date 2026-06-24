import { getRank, getTotalScore, type GameState } from '../types/game';

const ENDPOINT = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL?.trim();

export const createSubmissionId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export async function syncSubmission(action: 'start' | 'complete', state: GameState) {
  if (!ENDPOINT) throw new Error('Webhook chưa được cấu hình');

  const totalScore = getTotalScore(state.score);
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action,
      submissionId: state.submission.id,
      name: state.profile.name,
      email: state.profile.email.trim().toLowerCase(),
      classCode: state.profile.classCode,
      startedAt: state.submission.startedAt,
      completedAt: state.submission.completedAt,
      status: action === 'complete' ? 'Hoàn thành' : 'Đang làm',
      totalScore,
      rank: getRank(totalScore),
      scores: state.score,
    }),
  });

  if (!response.ok) throw new Error(`Webhook trả về ${response.status}`);
  const result = await response.json();
  if (!result.ok) throw new Error(result.error || 'Webhook không ghi được dữ liệu');
}

export const isWebhookConfigured = Boolean(ENDPOINT);
