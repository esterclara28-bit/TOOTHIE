export type NavSection =
  | 'beranda'
  | 'kenali-gigi'
  | 'cara-sikat'
  | 'makanan'
  | 'plak-karang'
  | 'gigi-berlubang'
  | 'pre-test'
  | 'quiz-games'
  | 'post-test'
  | 'rekomendasi'
  | 'admin-dashboard'
  | 'kader-records'
  | 'faq'
  | 'tentang';

export type UserRole = 'super_admin' | 'admin' | 'kader' | 'pengguna' | 'viewer';
export type AgeGroup = 'anak_6_8' | 'anak_9_12' | 'remaja_13_17' | 'dewasa_ortu';
export type EducationLevel = 'TK_PAUD' | 'SD_Kelas_1_3' | 'SD_Kelas_4_6' | 'SMP_SMA' | 'Diploma_Sarjana';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  ageGroup?: AgeGroup;
  educationLevel?: EducationLevel;
  assignedKaderId?: string;
  assignedKaderName?: string;
  completedModules: string[];
  unlockedBadges: string[];
  preTestScore?: number;
  preTestCompleted?: boolean;
  preTestDate?: string;
  postTestScore?: number;
  postTestCompleted?: boolean;
  postTestDate?: string;
  quizHighScore: number;
  quizCompleted: boolean;
  brushTimerCompletedCount: number;
  foodGameFedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: UserRole;
  action: 'LOGIN' | 'LOGOUT' | 'COMPLETE_MODULE' | 'FINISH_QUIZ' | 'FINISH_PRETEST' | 'FINISH_POSTTEST' | 'CHANGE_ROLE' | 'DELETE_USER' | 'ADD_RECORD' | 'UPDATE_RECORD' | 'DELETE_RECORD';
  targetId?: string;
  details: string;
  createdAt: string;
}

export interface CommunityRecord {
  id: string;
  name: string;
  age: number;
  ageGroup: AgeGroup;
  educationLevel: EducationLevel;
  parentName?: string;
  phoneOrContact?: string;
  kaderId: string;
  kaderName: string;
  brushingHabit2x: boolean;
  hasCavity: boolean;
  preTestScore?: number;
  postTestScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningRecommendation {
  id: string;
  title: string;
  category: 'perlu_pengulangan' | 'pengayaan' | 'pendampingan_kader' | 'kebiasaan_sehat';
  message: string;
  actionLabel: string;
  targetSection: NavSection;
  urgency: 'tinggi' | 'sedang' | 'rendah';
  suggestedAction: string;
}

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
  healthScore: number;
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
  categoryTag?: 'anatomi' | 'sikat' | 'makanan' | 'plak' | 'karies';
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
  preTestCompleted?: boolean;
  preTestScore?: number;
  postTestCompleted: boolean;
  postTestScore: number;
  brushTimerCompletedCount: number;
  foodGameFedCount: number;
  unlockedBadges: string[];
  childName: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}
