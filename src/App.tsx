/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavSection, UserProgress } from './types';
import { BADGES_LIST } from './data/dentalData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/navigation/Navbar';
import { BottomNav } from './components/navigation/BottomNav';
import { HeroSection } from './components/sections/HeroSection';
import { PreTestSection } from './components/sections/PreTestSection';
import { KenaliGigiSection } from './components/sections/KenaliGigiSection';
import { CaraSikatGigiSection } from './components/sections/CaraSikatGigiSection';
import { MakananMinumanSection } from './components/sections/MakananMinumanSection';
import { PlakKarangSection } from './components/sections/PlakKarangSection';
import { GigiBerlubangSection } from './components/sections/GigiBerlubangSection';
import { QuizGamesSection } from './components/sections/QuizGamesSection';
import { PostTestSection } from './components/sections/PostTestSection';
import { RekomendasiSection } from './components/sections/RekomendasiSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { KaderRecordsSection } from './components/kader/KaderRecordsSection';
import { FAQSection } from './components/sections/FAQSection';
import { Footer } from './components/layout/Footer';
import { BadgesModal } from './components/modals/BadgesModal';
import { AboutModal } from './components/modals/AboutModal';
import { ArrowLeft, Sparkles, Award } from 'lucide-react';
import { playPop, playFanfare, playSuccess, playBoing, speakText } from './utils/soundEffects';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'toothie_child_progress_v2';

function AppContent() {
  const { currentUser, userProfile, updateUserProfile, logActivity, isAdmin, isKader, isViewer } = useAuth();

  const [currentSection, setCurrentSection] = useState<NavSection>('beranda');
  const [badgesModalOpen, setBadgesModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [badgeToast, setBadgeToast] = useState<{ title: string; icon: string } | null>(null);

  // Initialize progress
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      visitedSections: ['beranda'],
      quizCompleted: false,
      quizHighScore: 0,
      preTestCompleted: false,
      preTestScore: undefined,
      postTestCompleted: false,
      postTestScore: 0,
      brushTimerCompletedCount: 0,
      foodGameFedCount: 0,
      unlockedBadges: [],
      childName: 'Pahlawan Cilik',
    };
  });

  // Sync with Firebase profile if logged in
  useEffect(() => {
    if (userProfile) {
      setUserProgress((prev) => ({
        ...prev,
        childName: userProfile.displayName || prev.childName,
        visitedSections: Array.from(new Set([...prev.visitedSections, ...(userProfile.completedModules || [])])),
        unlockedBadges: Array.from(new Set([...prev.unlockedBadges, ...(userProfile.unlockedBadges || [])])),
        preTestCompleted: userProfile.preTestCompleted ?? prev.preTestCompleted,
        preTestScore: userProfile.preTestScore ?? prev.preTestScore,
        postTestCompleted: userProfile.postTestCompleted ?? prev.postTestCompleted,
        postTestScore: userProfile.postTestScore ?? prev.postTestScore,
        quizHighScore: Math.max(prev.quizHighScore, userProfile.quizHighScore || 0),
        quizCompleted: userProfile.quizCompleted || prev.quizCompleted,
      }));
    }
  }, [userProfile]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch {
      // Fallback
    }
  }, [userProgress]);

  // Gamification prerequisites check
  const isSectionUnlocked = (section: NavSection): boolean => {
    if (isAdmin) return true; // Admins bypass locks
    const completed = userProgress.visitedSections;

    switch (section) {
      case 'beranda':
      case 'pre-test':
      case 'rekomendasi':
      case 'faq':
      case 'tentang':
        return true;
      case 'kenali-gigi':
        return Boolean(userProgress.preTestCompleted || completed.includes('pre-test'));
      case 'cara-sikat':
        return completed.includes('kenali-gigi');
      case 'makanan':
        return completed.includes('cara-sikat');
      case 'plak-karang':
        return completed.includes('makanan');
      case 'gigi-berlubang':
        return completed.includes('plak-karang');
      case 'quiz-games':
        return completed.includes('plak-karang');
      case 'post-test':
        return completed.includes('gigi-berlubang') && completed.includes('quiz-games');
      case 'admin-dashboard':
        return isAdmin || isViewer;
      case 'kader-records':
        return isAdmin || isKader;
      default:
        return true;
    }
  };

  const handleNavigate = (section: NavSection) => {
    if (!isSectionUnlocked(section)) {
      playBoing();
      speakText('Materi ini masih terkunci! Selesaikan materi sebelumnya terlebih dahulu ya.');
      return;
    }

    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!userProgress.visitedSections.includes(section)) {
      setUserProgress((prev) => {
        const updated = [...prev.visitedSections, section];
        if (currentUser) {
          updateUserProfile({ completedModules: updated });
        }
        return { ...prev, visitedSections: updated };
      });
    }
  };

  const handleCompleteModule = async (moduleId: string) => {
    playSuccess();
    confetti({ particleCount: 70, spread: 60 });

    setUserProgress((prev) => {
      const updated = Array.from(new Set([...prev.visitedSections, moduleId]));
      if (currentUser) {
        updateUserProfile({ completedModules: updated });
        logActivity('COMPLETE_MODULE', `Menyelesaikan materi modul: ${moduleId}`);
      }
      return { ...prev, visitedSections: updated };
    });
  };

  const handleFinishPreTest = async (score: number) => {
    setUserProgress((prev) => {
      const updatedSections = Array.from(new Set([...prev.visitedSections, 'pre-test', 'kenali-gigi']));
      const newObj = {
        ...prev,
        preTestCompleted: true,
        preTestScore: score,
        visitedSections: updatedSections,
      };
      if (currentUser) {
        updateUserProfile({
          preTestScore: score,
          preTestCompleted: true,
          preTestDate: new Date().toISOString(),
          completedModules: updatedSections,
        });
        logActivity('FINISH_PRETEST', `Menyelesaikan Pre-Test dengan nilai: ${score}`);
      }
      return newObj;
    });
  };

  const handleFinishPostTest = async (score: number) => {
    setUserProgress((prev) => {
      const updatedSections = Array.from(new Set([...prev.visitedSections, 'post-test', 'rekomendasi']));
      const newObj = {
        ...prev,
        postTestCompleted: true,
        postTestScore: score,
        visitedSections: updatedSections,
      };
      if (currentUser) {
        updateUserProfile({
          postTestScore: score,
          postTestCompleted: true,
          postTestDate: new Date().toISOString(),
          completedModules: updatedSections,
        });
        logActivity('FINISH_POSTTEST', `Menyelesaikan Post-Test dengan nilai: ${score}`);
      }
      return newObj;
    });
  };

  const handleRecordQuizScore = async (score: number) => {
    setUserProgress((prev) => {
      const newHighScore = Math.max(prev.quizHighScore, score);
      const updatedSections = Array.from(new Set([...prev.visitedSections, 'quiz-games']));
      const newObj = {
        ...prev,
        quizCompleted: true,
        quizHighScore: newHighScore,
        visitedSections: updatedSections,
      };
      if (currentUser) {
        updateUserProfile({
          quizHighScore: newHighScore,
          quizCompleted: true,
          completedModules: updatedSections,
        });
        logActivity('FINISH_QUIZ', `Menyelesaikan Kuis Petualangan dengan skor: ${score}`);
      }
      return newObj;
    });
  };

  const handleUnlockBadge = async (badgeId: string) => {
    if (!userProgress.unlockedBadges.includes(badgeId)) {
      const badgeInfo = BADGES_LIST.find((b) => b.id === badgeId);
      const newBadges = [...userProgress.unlockedBadges, badgeId];

      setUserProgress((prev) => ({
        ...prev,
        unlockedBadges: newBadges,
      }));

      if (currentUser) {
        updateUserProfile({ unlockedBadges: newBadges });
      }

      playFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.8 },
      });

      if (badgeInfo) {
        setBadgeToast({ title: badgeInfo.title, icon: badgeInfo.icon });
        setTimeout(() => setBadgeToast(null), 4000);
      }
    }
  };

  const handleUpdateChildName = (name: string) => {
    setUserProgress((prev) => ({
      ...prev,
      childName: name,
    }));
    if (currentUser) {
      updateUserProfile({ displayName: name });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F9FD] text-slate-800 font-sans relative selection:bg-sky-200">
      {/* Toast Notification when earning a badge */}
      {badgeToast && (
        <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 bg-gradient-to-r from-amber-400 to-yellow-400 text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-3 animate-bounce">
          <span className="text-3xl">{badgeToast.icon}</span>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider block text-amber-950">
              Piala Baru Terbuka! 🏆
            </span>
            <span className="text-sm font-black text-white">{badgeToast.title}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        unlockedBadgeCount={userProgress.unlockedBadges.length}
        totalBadgeCount={BADGES_LIST.length}
        onOpenBadgesModal={() => setBadgesModalOpen(true)}
        onOpenAboutModal={() => setAboutModalOpen(true)}
        completedModules={userProgress.visitedSections}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Subpage Breadcrumb / Back button */}
        {currentSection !== 'beranda' && (
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => {
                playPop();
                handleNavigate('beranda');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-sky-100 hover:border-sky-300 text-sky-700 font-black text-xs sm:text-sm shadow-xs transition-all hover:-translate-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>

            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              Toothie • Petualangan Gigi Sehat
            </span>
          </div>
        )}

        {/* Dynamic Section Switcher */}
        {currentSection === 'beranda' && (
          <HeroSection
            onNavigate={handleNavigate}
            userProgress={userProgress}
            totalBadges={BADGES_LIST.length}
          />
        )}

        {currentSection === 'pre-test' && (
          <PreTestSection
            onFinishPreTest={handleFinishPreTest}
            onNavigate={handleNavigate}
            initialScore={userProgress.preTestScore}
            isAlreadyCompleted={userProgress.preTestCompleted}
          />
        )}

        {currentSection === 'kenali-gigi' && (
          <KenaliGigiSection
            onUnlockBadge={handleUnlockBadge}
            onCompleteModule={handleCompleteModule}
            onNavigate={handleNavigate}
            isCompleted={userProgress.visitedSections.includes('kenali-gigi')}
          />
        )}

        {currentSection === 'cara-sikat' && (
          <CaraSikatGigiSection
            onUnlockBadge={handleUnlockBadge}
            onCompleteModule={handleCompleteModule}
            onNavigate={handleNavigate}
          />
        )}

        {currentSection === 'makanan' && (
          <MakananMinumanSection
            onUnlockBadge={handleUnlockBadge}
            onCompleteModule={handleCompleteModule}
            onNavigate={handleNavigate}
          />
        )}

        {currentSection === 'plak-karang' && (
          <PlakKarangSection
            onUnlockBadge={handleUnlockBadge}
            onCompleteModule={handleCompleteModule}
            onNavigate={handleNavigate}
          />
        )}

        {currentSection === 'gigi-berlubang' && (
          <GigiBerlubangSection
            onUnlockBadge={handleUnlockBadge}
            onCompleteModule={handleCompleteModule}
            onNavigate={handleNavigate}
          />
        )}

        {currentSection === 'quiz-games' && (
          <QuizGamesSection
            onUnlockBadge={handleUnlockBadge}
            onRecordScore={handleRecordQuizScore}
            onNavigate={handleNavigate}
            isLocked={!isAdmin && !userProgress.visitedSections.includes('plak-karang')}
          />
        )}

        {currentSection === 'post-test' && (
          <PostTestSection
            onUnlockBadge={handleUnlockBadge}
            childName={userProgress.childName}
            onUpdateChildName={handleUpdateChildName}
            onFinishPostTest={handleFinishPostTest}
            onNavigate={handleNavigate}
            preTestScore={userProgress.preTestScore}
            isLocked={!isAdmin && (!userProgress.visitedSections.includes('gigi-berlubang') || !userProgress.visitedSections.includes('quiz-games'))}
          />
        )}

        {currentSection === 'rekomendasi' && (
          <RekomendasiSection
            userProfile={userProfile}
            onNavigate={handleNavigate}
          />
        )}

        {currentSection === 'admin-dashboard' && (
          <AdminDashboard />
        )}

        {currentSection === 'kader-records' && (
          <KaderRecordsSection />
        )}

        {currentSection === 'faq' && <FAQSection />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAboutModal={() => setAboutModalOpen(true)}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onOpenBadgesModal={() => setBadgesModalOpen(true)}
      />

      {/* Modals */}
      <BadgesModal
        isOpen={badgesModalOpen}
        onClose={() => setBadgesModalOpen(false)}
        unlockedBadgeIds={userProgress.unlockedBadges}
      />

      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
