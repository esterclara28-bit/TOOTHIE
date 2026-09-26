/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavSection, UserProgress } from './types';
import { BADGES_LIST } from './data/dentalData';
import { Navbar } from './components/navigation/Navbar';
import { BottomNav } from './components/navigation/BottomNav';
import { HeroSection } from './components/sections/HeroSection';
import { KenaliGigiSection } from './components/sections/KenaliGigiSection';
import { CaraSikatGigiSection } from './components/sections/CaraSikatGigiSection';
import { MakananMinumanSection } from './components/sections/MakananMinumanSection';
import { PlakKarangSection } from './components/sections/PlakKarangSection';
import { GigiBerlubangSection } from './components/sections/GigiBerlubangSection';
import { QuizGamesSection } from './components/sections/QuizGamesSection';
import { PostTestSection } from './components/sections/PostTestSection';
import { FAQSection } from './components/sections/FAQSection';
import { Footer } from './components/layout/Footer';
import { BadgesModal } from './components/modals/BadgesModal';
import { AboutModal } from './components/modals/AboutModal';
import { ToothieMascot } from './components/mascot/ToothieMascot';
import { ArrowLeft, Sparkles, Award } from 'lucide-react';
import { playPop, playFanfare } from './utils/soundEffects';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'toothie_child_progress_v1';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('beranda');
  const [badgesModalOpen, setBadgesModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [badgeToast, setBadgeToast] = useState<{ title: string; icon: string } | null>(null);

  // Initialize progress from localStorage
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
      postTestCompleted: false,
      postTestScore: 0,
      brushTimerCompletedCount: 0,
      foodGameFedCount: 0,
      unlockedBadges: [],
      childName: 'Pahlawan Cilik',
    };
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch {
      // Fallback
    }
  }, [userProgress]);

  const handleNavigate = (section: NavSection) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track visited section
    if (!userProgress.visitedSections.includes(section)) {
      setUserProgress((prev) => ({
        ...prev,
        visitedSections: [...prev.visitedSections, section],
      }));
    }
  };

  const handleUnlockBadge = (badgeId: string) => {
    if (!userProgress.unlockedBadges.includes(badgeId)) {
      const badgeInfo = BADGES_LIST.find((b) => b.id === badgeId);
      setUserProgress((prev) => ({
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId],
      }));

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

        {currentSection === 'kenali-gigi' && (
          <KenaliGigiSection onUnlockBadge={handleUnlockBadge} />
        )}

        {currentSection === 'cara-sikat' && (
          <CaraSikatGigiSection onUnlockBadge={handleUnlockBadge} />
        )}

        {currentSection === 'makanan' && (
          <MakananMinumanSection onUnlockBadge={handleUnlockBadge} />
        )}

        {currentSection === 'plak-karang' && (
          <PlakKarangSection onUnlockBadge={handleUnlockBadge} />
        )}

        {currentSection === 'gigi-berlubang' && (
          <GigiBerlubangSection onUnlockBadge={handleUnlockBadge} />
        )}

        {currentSection === 'quiz-games' && (
          <QuizGamesSection
            onUnlockBadge={handleUnlockBadge}
            onRecordScore={(score) =>
              setUserProgress((prev) => ({
                ...prev,
                quizCompleted: true,
                quizHighScore: Math.max(prev.quizHighScore, score),
              }))
            }
          />
        )}

        {currentSection === 'post-test' && (
          <PostTestSection
            onUnlockBadge={handleUnlockBadge}
            childName={userProgress.childName}
            onUpdateChildName={handleUpdateChildName}
          />
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
