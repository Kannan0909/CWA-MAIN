export type Message = {
  id: number;
  source: 'Boss' | 'Family' | 'Agile' | 'Ethical/Legal' | 'Court Order';
  text: string;
  isCritical: boolean;
  penaltyKey?: 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy' | 'PrivacyBreach' | 'SecurityNegligence' | 'PENALTY' | 'Distraction';
  timestamp?: Date;
  gameTime?: number;
  messageType?: 'initial' | 'urgent' | 'distraction';
  priority?: 'low' | 'medium' | 'high' | 'critical';
};
