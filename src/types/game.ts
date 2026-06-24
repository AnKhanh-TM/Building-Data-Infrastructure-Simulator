export type SyncStatus = 'idle' | 'pending' | 'synced' | 'failed';

export interface UserProfile {
  name: string;
  email: string;
  classCode: string;
}

export interface GameScore {
  businessQuestion: number;
  dataMapping: number;
  pipeline: number;
  warehouse: number;
  dataModel: number;
  dashboard: number;
  opportunity: number;
}

export interface GameSelections {
  businessQuestion: string;
  sourceMappings: Record<string, { fields: string[]; sources: string[] }>;
  pipelineOrder: string[];
  pipelineDecisions: Record<string, string>;
  warehouseAnswer: string;
  warehouseReasons: string[];
  modelConnections: string[];
  dashboard: {
    ask: string;
    metrics: string[];
    fields: string[];
    breakdown: string;
    cadence: string;
  };
  opportunity: string;
}

export interface SubmissionState {
  id: string;
  startedAt: string;
  completedAt: string;
  startSync: SyncStatus;
  completeSync: SyncStatus;
}

export interface GameState {
  currentStep: number;
  submittedSteps: number[];
  profile: UserProfile;
  score: GameScore;
  selections: GameSelections;
  submission: SubmissionState;
}

export const EMPTY_SCORE: GameScore = {
  businessQuestion: 0,
  dataMapping: 0,
  pipeline: 0,
  warehouse: 0,
  dataModel: 0,
  dashboard: 0,
  opportunity: 0,
};

export const EMPTY_SELECTIONS: GameSelections = {
  businessQuestion: '',
  sourceMappings: {},
  pipelineOrder: [],
  pipelineDecisions: {},
  warehouseAnswer: '',
  warehouseReasons: [],
  modelConnections: [],
  dashboard: { ask: '', metrics: [], fields: [], breakdown: '', cadence: '' },
  opportunity: '',
};

export const EMPTY_SUBMISSION: SubmissionState = {
  id: '',
  startedAt: '',
  completedAt: '',
  startSync: 'idle',
  completeSync: 'idle',
};

export const INITIAL_STATE: GameState = {
  currentStep: 1,
  submittedSteps: [],
  profile: { name: '', email: '', classCode: '' },
  score: { ...EMPTY_SCORE },
  selections: { ...EMPTY_SELECTIONS },
  submission: { ...EMPTY_SUBMISSION },
};

export const getTotalScore = (score: GameScore) =>
  Object.values(score).reduce((total, value) => total + value, 0);

export const getRank = (total: number) => {
  if (total >= 86) return 'Data-Driven Manager';
  if (total >= 66) return 'Strategic Data Lead';
  if (total >= 41) return 'Growth Data Practitioner';
  return 'Data Foundation Starter';
};
