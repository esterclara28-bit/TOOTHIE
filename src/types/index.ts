export type NavSection =
  | 'beranda'
  | 'kenali-gigi'
  | 'cara-sikat'
  | 'makanan'
  | 'plak-karang'
  | 'gigi-berlubang'
  | 'quiz-games'
  | 'post-test'
  | 'faq'
  | 'tentang';

export interface ToothPart {
  id: string;
  name: string;
  indonesianName: string;
  role: string;
  count: string;
  funFact: string;
  color: string;
  accentColor: string;
  position: { x: number; y: number };
}

export interface ToothLayer {
  id: string;
  name: string;
  title: string;
  description: string;
  characteristics: string;
  careTip: string;
  color: string;
  tagColor: string;
}

export interface BrushingStep {
  stepNumber: number;
  title: string;
  description: string;
  tip: string;
  duration: string;
  visualType: 'setup' | 'outside' | 'inside' | 'chewing' | 'tongue' | 'rinse' | 'store';
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'sehat' | 'manis';
  emoji: string;
  effectTitle: string;
  effectDescription: string;
  toothieReaction: 'happy' | 'warning';
  healthScore: number; // +10 for healthy, -5 for sugary
}

export interface PlakStage {
  stage: number;
  title: string;
  badgeText: string;
  description: string;
  mascotMood: 'sparkle' | 'neutral' | 'worried' | 'sad';
  solution: string;
  appearanceDescription: string;
}

export interface CavityStage {
  stage: number;
  title: string;
  warningLevel: 'Aman' | 'Waspada' | 'Bahaya' | 'Harus ke Dokter';
  description: string;
  sensation: string;
  action: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  explanation: string;
  hint: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export interface UserProgress {
  visitedSections: string[];
  quizCompleted: boolean;
  quizHighScore: number;
  postTestCompleted: boolean;
  postTestScore: number;
  brushTimerCompletedCount: number;
  foodGameFedCount: number;
  unlockedBadges: string[];
  childName: string;
}
