'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoon, FiSun, FiPlus, FiX, FiTag, FiZap } from 'react-icons/fi';
import { FaStar, FaCloudMoon } from 'react-icons/fa';

// Types
interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  isLucid: boolean;
  mood: 'calm' | 'happy' | 'anxious' | 'scary';
  intensity: number;
}

// Mock dreams
const mockDreams: Dream[] = [
  {
    id: '1',
    title: 'Neon Cityscape Flight',
    content: 'Soared through glowing skyscrapers that hummed with light. The air smelled like ozone and candy.',
    date: '2023-05-15',
    tags: ['flying', 'city', 'neon'],
    isLucid: true,
    mood: 'happy',
    intensity: 8
  },
  {
    id: '2',
    title: 'Infinite Library',
    content: 'Walked through endless book corridors. Some books floated, whispering secrets.',
    date: '2023-05-10',
    tags: ['books', 'mystery'],
    isLucid: false,
    mood: 'anxious',
    intensity: 6
  },
  {
    id: '3',
    title: 'Celestial Jellyfish Ocean',
    content: 'Floated in a cosmic sea with glowing star creatures forming constellations.',
    date: '2023-05-05',
    tags: ['space', 'ocean'],
    isLucid: true,
    mood: 'calm',
    intensity: 9
  }
];

// Mood colors
const moodColors = {
  calm: { 
    light: { bg: '#E3F2FD', text: '#0D47A1', accent: '#64B5F6' },
    dark: { bg: '#0D1B2A', text: '#E0E1DD', accent: '#415A77' }
  },
  happy: { 
    light: { bg: '#E8F5E9', text: '#1B5E20', accent: '#66BB6A' },
    dark: { bg: '#1B263B', text: '#E0E1DD', accent: '#778DA9' }
  },
  anxious: { 
    light: { bg: '#FFF8E1', text: '#FF6F00', accent: '#FFCA28' },
    dark: { bg: '#3D0000', text: '#FFD6D6', accent: '#950000' }
  },
  scary: { 
    light: { bg: '#FCE4EC', text: '#880E4F', accent: '#EC407A' },
    dark: { bg: '#1A001A', text: '#FFCCFF', accent: '#660066' }
  }
};

// Typewriter hook
function useTypewriter(text: string) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [text]);

  return displayText;
}

// 2D Galaxy View
function GalaxyView({ dreams, theme }: { dreams: Dream[], theme: 'light' | 'dark' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create bubbles
    const bubbles = dreams.map((dream, i) => {
      const angle = (i / dreams.length) * Math.PI * 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;
      return {
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
        size: 12,
        color: theme === 'dark' ? moodColors[dream.mood].dark.accent : moodColors[dream.mood].light.accent,
        offset: Math.random() * 100,
        title: dream.title
      };
    });

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach(b => {
        const t = Date.now() / 1000;
        const y = b.y + Math.sin(t + b.offset) * 15;
        const size = b.size + Math.sin(t + b.offset) * 3; // Pulsating effect
        ctx.beginPath();
        ctx.arc(b.x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.font = '14px Inter';
        ctx.fillStyle = theme === 'dark' ? '#E0E1DD' : '#333';
        ctx.fillText(b.title.slice(0, 15), b.x + size + 5, y);
      });
      requestAnimationFrame(animate);
    }
    animate();

    // Handle resize
    function handleResize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dreams, theme]);

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-2xl mb-8" />;
}

// Animated Background
function AnimatedBackground({ theme }: { theme: 'light' | 'dark' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; radius: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}

export default function DreamTracker() {
  // State
  const [dreams, setDreams] = useState<Dream[]>(mockDreams);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAddingDream, setIsAddingDream] = useState(false);
  const [newDream, setNewDream] = useState<Omit<Dream, 'id'>>({ 
    title: '', 
    content: '', 
    date: new Date().toISOString().split('T')[0], 
    tags: [], 
    isLucid: false,
    mood: 'calm',
    intensity: 5
  });
  const [currentTag, setCurrentTag] = useState('');
  const [activeDream, setActiveDream] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'galaxy'>('list');

  const inputRef = useRef<HTMLInputElement>(null);
  const typedContent = useTypewriter(newDream.content);

  // Filter dreams
  const filteredDreams = dreams.filter(dream => 
    dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dream.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dream.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Focus input when adding dream
  useEffect(() => {
    if (isAddingDream && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingDream]);

  // Toggle theme
  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  // Add new dream
  function addDream() {
    if (!newDream.title.trim() || !newDream.content.trim()) return;
    const dream: Dream = { ...newDream, id: Date.now().toString() };
    setDreams([dream, ...dreams]);
    setNewDream({ 
      title: '', 
      content: '', 
      date: new Date().toISOString().split('T')[0], 
      tags: [], 
      isLucid: false,
      mood: 'calm',
      intensity: 5
    });
    setIsAddingDream(false);
  }

  // Add tag
  function addTag() {
    if (!currentTag.trim() || newDream.tags.includes(currentTag.toLowerCase())) return;
    setNewDream({ ...newDream, tags: [...newDream.tags, currentTag.toLowerCase()] });
    setCurrentTag('');
  }

  // Remove tag
  function removeTag(tag: string) {
    setNewDream({ ...newDream, tags: newDream.tags.filter(t => t !== tag) });
  }

  return (
    <div 
      className={`min-h-screen font-sans transition-colors ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-black text-gray-100' : 'bg-gradient-to-b from-gray-100 to-gray-50 text-gray-900'}`}
      style={{ fontFamily: '"Inter", "Arial", sans-serif' }}
    >
      <AnimatedBackground theme={theme} />

      {/* Header */}
      <header className={`sticky top-0 z-20 ${theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md shadow-md`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Dream Tracker</h1>
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddingDream(true)}
              className={`flex items-center space-x-1 px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
              aria-label="Add new dream"
            >
              <FiPlus size={18} />
              <span>New Dream</span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search dreams by title, content or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg text-base ${theme === 'dark' ? 'bg-gray-800/70 border-gray-700 focus:border-purple-500' : 'bg-white/70 border-gray-300 focus:border-purple-400'} border-2 focus:outline-none`}
              aria-label="Search dreams"
            />
            {searchTerm && (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <FiX size={20} />
              </motion.button>
            )}
          </div>
        </div>

        {/* View selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-lg">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-l-lg ${viewMode === 'list' ? (theme === 'dark' ? 'bg-purple-700 text-white' : 'bg-purple-500 text-white') : (theme === 'dark' ? 'bg-gray-700/70 text-gray-300' : 'bg-gray-200/70 text-gray-700')}`}
              aria-label="List view"
            >
              List
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 ${viewMode === 'grid' ? (theme === 'dark' ? 'bg-purple-700 text-white' : 'bg-purple-500 text-white') : (theme === 'dark' ? 'bg-gray-700/70 text-gray-300' : 'bg-gray-200/70 text-gray-700')}`}
              aria-label="Grid view"
            >
              Grid
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('galaxy')}
              className={`px-4 py-2 rounded-r-lg ${viewMode === 'galaxy' ? (theme === 'dark' ? 'bg-purple-700 text-white' : 'bg-purple-500 text-white') : (theme === 'dark' ? 'bg-gray-700/70 text-gray-300' : 'bg-gray-200/70 text-gray-700')}`}
              aria-label="Galaxy view"
            >
              Galaxy
            </motion.button>
          </div>
        </div>

        {/* Galaxy View */}
        {viewMode === 'galaxy' && <GalaxyView dreams={filteredDreams.slice(0, 10)} theme={theme} />}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredDreams.map((dream) => (
              <motion.div
                key={dream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveDream(dream.id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all gradient-border ${activeDream === dream.id ? 
                  (theme === 'dark' ? 'bg-purple-900/50 border' : 'bg-purple-100/50 border') : 
                  (theme === 'dark' ? 'bg-gray-800/70 hover:bg-gray-700/70 border-gray-700' : 'bg-white/70 hover:bg-gray-50/70 border-gray-300')} border-2`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{dream.title}</h3>
                  {dream.isLucid && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-yellow-900/50 text-yellow-200' : 'bg-yellow-100/50 text-yellow-800'}`}>
                      <FiZap size={12} className="mr-1" />
                      Lucid
                    </span>
                  )}
                </div>
                <p className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} line-clamp-3 mb-3`}>{dream.content}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {dream.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`inline-block px-2 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-700/50 text-purple-300' : 'bg-gray-200/50 text-purple-700'}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">{dream.date}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`${i < Math.floor(dream.intensity / 2) ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500') : (theme === 'dark' ? 'text-gray-600' : 'text-gray-300')}`} 
                        size={12} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4 mb-12">
            {filteredDreams.map((dream) => (
              <motion.div
                key={dream.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 5 }}
                onClick={() => setActiveDream(dream.id)}
                className={`p-5 rounded-xl cursor-pointer transition-all gradient-border ${activeDream === dream.id ? 
                  (theme === 'dark' ? 'bg-purple-900/50 border-l-4 border' : 'bg-purple-100/50 border-l-4 border') : 
                  (theme === 'dark' ? 'bg-gray-800/70 hover:bg-gray-700/70 border-l-4 border-gray-700' : 'bg-white/70 hover:bg-gray-50/70 border-l-4 border-gray-300')}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{dream.title}</h3>
                  <div className="flex items-center space-x-2">
                    {dream.isLucid && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-yellow-900/50 text-yellow-200' : 'bg-yellow-100/50 text-yellow-800'}`}>
                        <FiZap size={12} className="mr-1" />
                        Lucid
                      </span>
                    )}
                    <span className="text-sm opacity-70">{dream.date}</span>
                  </div>
                </div>
                <p className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} line-clamp-2 mb-2`}>{dream.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {dream.tags.map(tag => (
                      <span 
                        key={tag} 
                        className={`inline-block px-2 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-700/50 text-purple-300' : 'bg-gray-200/50 text-purple-700'}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`${i < Math.floor(dream.intensity / 2) ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500') : (theme === 'dark' ? 'text-gray-600' : 'text-gray-300')}`} 
                        size={12} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Dream Detail */}
        {activeDream && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} mb-12 relative`}
          >
            {dreams.filter(d => d.id === activeDream).map(dream => (
              <div key={dream.id}>
                <div className="h-64 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2">{dream.title}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-base text-white/90">{dream.date}</span>
                      {dream.isLucid && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-500/30 text-yellow-300">
                          <FiZap size={14} className="mr-1" />
                          Lucid Dream
                        </span>
                      )}
                      <div className="flex items-center ml-auto">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < Math.floor(dream.intensity / 2) ? 'text-yellow-400' : 'text-white/30'}`} 
                            size={16} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-8">
                    {dream.tags.map(tag => (
                      <span
                        key={tag}
                        className={`inline-block px-3 py-1.5 rounded-full text-sm ${theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100/70 text-purple-700'}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-10 relative">
                    <div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <div className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {dream.content}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {dream.mood === 'calm' && <span className={`w-6 h-6 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'}`}></span>}
                        {dream.mood === 'happy' && <span className={`w-6 h-6 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-600'}`}></span>}
                        {dream.mood === 'anxious' && <span className={`w-6 h-6 rounded-full ${theme === 'dark' ? 'bg-yellow-400' : 'bg-yellow-600'}`}></span>}
                        {dream.mood === 'scary' && <span className={`w-6 h-6 rounded-full ${theme === 'dark' ? 'bg-red-400' : 'bg-red-600'}`}></span>}
                      </div>
                      <div>
                        <div className="text-sm opacity-70">Mood</div>
                        <div className="capitalize font-medium">{dream.mood}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="mr-3">
                        <FaCloudMoon size={24} className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} />
                      </div>
                      <div>
                        <div className="text-sm opacity-70">Intensity</div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`${i < Math.floor(dream.intensity / 2) ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500') : (theme === 'dark' ? 'text-gray-600' : 'text-gray-300')} mr-1`} 
                              size={14} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!activeDream && filteredDreams.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col items-center justify-center py-20 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'}`}
          >
            <FaCloudMoon size={72} className={`mb-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className="text-2xl font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">No dreams found</h3>
            <p className={`max-w-md text-center text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
              {searchTerm ? 'No dreams match your search.' : 'Your dream journal is empty. Add a dream to start.'}
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddingDream(true)}
              className={`flex items-center space-x-2 px-8 py-4 rounded-full ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
              aria-label="Record new dream"
            >
              <FiPlus size={20} />
              <span>Record New Dream</span>
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Add Dream Modal */}
      <AnimatePresence>
        {isAddingDream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddingDream(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className={`relative w-full max-w-2xl rounded-2xl ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} p-8`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Record New Dream</h2>
                <motion.button 
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsAddingDream(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <FiX size={24} />
                </motion.button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>Dream Title</label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={newDream.title}
                    onChange={(e) => setNewDream({...newDream, title: e.target.value})}
                    placeholder="Give your dream a title..."
                    className={`w-full px-4 py-3 rounded-lg text-base ${theme === 'dark' ? 'bg-gray-700/70 border-gray-600 focus:border-purple-500' : 'bg-white/70 border-gray-300 focus:border-purple-400'} border-2 focus:outline-none`}
                    aria-label="Dream title"
                  />
                </div>

                <div>
                  <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>Dream Content</label>
                  <textarea
                    value={newDream.content}
                    onChange={(e) => setNewDream({...newDream, content: e.target.value})}
                    placeholder="Describe your dream in detail..."
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg text-base ${theme === 'dark' ? 'bg-gray-700/70 border-gray-600 focus:border-purple-500' : 'bg-white/70 border-gray-300 focus:border-purple-400'} border-2 focus:outline-none`}
                    aria-label="Dream content"
                  />
                  {newDream.content && (
                    <div className={`mt-2 text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-mono p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                      {typedContent}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>Date</label>
                    <input
                      type="date"
                      value={newDream.date}
                      onChange={(e) => setNewDream({...newDream, date: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg text-base ${theme === 'dark' ? 'bg-gray-700/70 border-gray-600 focus:border-purple-500' : 'bg-white/70 border-gray-300 focus:border-purple-400'} border-2 focus:outline-none`}
                      aria-label="Dream date"
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>Mood</label>
                    <select
                      value={newDream.mood}
                      onChange={(e) => setNewDream({...newDream, mood: e.target.value as Dream['mood']})}
                      className={`w-full px-4 py-3 rounded-lg text-base ${theme === 'dark' ? 'bg-gray-700/70 border-gray-600 focus:border-purple-500' : 'bg-white/70 border-gray-300 focus:border-purple-400'} border-2 focus:outline-none`}
                      aria-label="Dream mood"
                    >
                      <option value="calm">Calm</option>
                      <option value="happy">Happy</option>
                      <option value="anxious">Anxious</option>
                      <option value="scary">Scary</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>Intensity</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newDream.intensity}
                      onChange={(e) => setNewDream({...newDream, intensity: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                      aria-label="Dream intensity"
                    />
                    <span className={`w-10 text-center font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                      {newDream.intensity}
                    </span>
                  </div>
                </div>

                <div>
                  <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>Tags</label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add tags (e.g. flying, water, city)"
                      className={`flex-1 px-4 py-3 rounded-l-lg text-base ${theme === 'dark' ? 'bg-gray-700/70 border-gray-600 focus:border-purple-500' : 'bg-white/70 border-gray-300 focus:border-purple-400'} border-2 focus:outline-none`}
                      aria-label="Add tag"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addTag}
                      className={`px-4 rounded-r-lg ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
                      aria-label="Add tag"
                    >
                      <FiTag size={20} />
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newDream.tags.map(tag => (
                      <div 
                        key={tag}
                        className={`flex items-center px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-700/70' : 'bg-gray-200/70'}`}
                      >
                        <span className="mr-2">#{tag}</span>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:text-gray-700"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <FiX size={16} />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={newDream.isLucid}
                        onChange={(e) => setNewDream({...newDream, isLucid: e.target.checked})}
                        className="sr-only"
                        aria-label="Lucid dream toggle"
                      />
                      <div className={`block w-14 h-8 rounded-full ${newDream.isLucid ? 'bg-purple-600' : 'bg-gray-400'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${newDream.isLucid ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <div className={`ml-3 font-medium ${newDream.isLucid ? (theme === 'dark' ? 'text-purple-400' : 'text-purple-600') : ''}`}>
                      Lucid Dream
                    </div>
                  </label>

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsAddingDream(false)}
                      className={`px-6 py-3 rounded-lg text-base ${theme === 'dark' ? 'bg-gray-700/70 hover:bg-gray-600/70' : 'bg-gray-200/70 hover:bg-gray-300/70'}`}
                      aria-label="Cancel"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={addDream}
                      disabled={!newDream.title.trim() || !newDream.content.trim()}
                      className={`px-6 py-3 rounded-lg text-base ${(!newDream.title.trim() || !newDream.content.trim()) ? 
                        (theme === 'dark' ? 'bg-purple-900/50 text-gray-400' : 'bg-purple-200/50 text-gray-500') : 
                        (theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600')} text-white`}
                      aria-label="Save dream"
                    >
                      Save Dream
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}