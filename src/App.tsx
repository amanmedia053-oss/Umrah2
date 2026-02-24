import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Heart,
  Settings,
  Info,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Heart as HeartIcon,
  Share2,
  Star,
  MessageCircle,
  Send,
  Mail
} from 'lucide-react';

import {
  useTheme,
  getAccentClass,
  getAccentTextClass,
  getAccentHex,
  ThemeColor
} from './context/ThemeContext';

import { useAudio, Lesson } from './context/AudioContext';


// =========================
// Bottom Navigation
// =========================

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const { isDarkMode, accentColor } = useTheme();
  const accentText = getAccentTextClass(accentColor);

  const tabs = [
    { id: 'home', label: 'کورپاڼه', icon: Home },
    { id: 'favs', label: 'خوښي شوي', icon: Heart },
    { id: 'settings', label: 'تنظيمات', icon: Settings },
    { id: 'about', label: 'زموږ په اړه', icon: Info },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 flex items-center justify-around border-t z-40 backdrop-blur-md
        ${isDarkMode ? 'bg-black/95 border-white/10' : 'bg-white/95 border-black/5'}`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(64px + env(safe-area-inset-bottom))'
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full transition-colors
              ${isActive ? accentText : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}
          >
            <Icon size={20} className={isActive ? 'scale-110' : ''} />
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};


// =========================
// Home Screen
// =========================

const HomeScreen = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { playLesson } = useAudio();
  const { isDarkMode, accentColor } = useTheme();

  useEffect(() => {
    fetch('/lessons.json')
      .then(res => res.json())
      .then(data => setLessons(data));
  }, []);

  return (
    <div style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>

      {/* HEADER */}
      <div
        className={`relative overflow-hidden mb-6 rounded-b-[40px] ${getAccentClass(accentColor)}`}
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 32px)',
          paddingBottom: '24px'
        }}
      >
        <div className="absolute inset-0 opacity-10 islamic-pattern" />
        <div className="relative z-10 text-white px-6">
          <h1 className="text-3xl font-bold mb-2">د عمرې لارښود</h1>
          <p className="opacity-80 text-sm">ټول ضروري احکام او فضائل په آډيو بڼه</p>
        </div>
      </div>

      <div className="px-6">
        <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          ټول درسونه
        </h2>

        {lessons.map((lesson) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => playLesson(lesson)}
            className={`p-4 rounded-2xl mb-4 cursor-pointer
              ${isDarkMode
                ? 'bg-zinc-900 border border-white/5'
                : 'bg-white shadow-sm border border-black/5'
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
                <Play size={20} className={getAccentTextClass(accentColor)} />
              </div>

              <div className="flex-1">
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {lesson.title}
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {lesson.duration} آډيو
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


// =========================
// Main App
// =========================

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { isDarkMode, accentColor } = useTheme();

  // 🔥 Dynamic Status Bar Color
  useEffect(() => {
    let meta = document.querySelector("meta[name=theme-color]");
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", getAccentHex(accentColor));
  }, [accentColor]);

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-md mx-auto min-h-screen relative">

        <main>
          {activeTab === 'home' && <HomeScreen />}
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}