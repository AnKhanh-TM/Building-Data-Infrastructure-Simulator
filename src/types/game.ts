export interface UserProfile {
  name: string;
  classCode: string;
}

export interface GameState {
  currentStep: number;
  profile: UserProfile;
  score: {
    info: number;
    sources: number;
    pipeline: number;
    warehouse: number;
    dataModel: number;
    dashboard: number;
    completion: number;
  };
  selections: {
    sources: string[];
    sourceQuestions: Record<string, string>;
    pipelineAnswer: string;
    warehouseAnswer: string;
    modelConnections: Record<string, string>;
    dashboardKPIs: string[];
    dashboardADO?: { audience: string, breakdown: string };
  };
}

export const INITIAL_STATE: GameState = {
  currentStep: 1,
  profile: { name: '', classCode: '' },
  score: {
    info: 0,
    sources: 0,
    pipeline: 0,
    warehouse: 0,
    dataModel: 0,
    dashboard: 0,
    completion: 0,
  },
  selections: {
    sources: [],
    sourceQuestions: {},
    pipelineAnswer: '',
    warehouseAnswer: '',
    modelConnections: {},
    dashboardKPIs: [],
  }
};
