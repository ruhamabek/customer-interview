"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Copy, RotateCcw, Check, Sparkles } from 'lucide-react';
import { generateInterviewQuestions } from '../lib/gemini';

export function QuestionUI() {
  const [jobTitle, setJobTitle] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!jobTitle.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setQuestions([]);

    try {
      const result = await generateInterviewQuestions(jobTitle);
      setQuestions(result);
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const reset = () => {
    setJobTitle('');
    setQuestions([]);
    setError(null);
  };

  return (
    <div className="h-screen flex flex-col bg-editorial-bg text-editorial-ink font-sans overflow-hidden">
      {/* Top Navigation */}
      <nav className="h-20 border-b border-editorial-ink/10 px-12 flex items-center justify-between flex-shrink-0 bg-editorial-bg/80 backdrop-blur-sm z-20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-editorial-ink rotate-45"></div>
          <span className="font-serif italic text-2xl tracking-tight">InterviewPrep.ai</span>
        </div>
        <div className="flex gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold items-center">
          <button onClick={reset} className="hover:opacity-50 transition-opacity flex items-center gap-2">
            <RotateCcw size={14} />
            <span>Reset Session</span>
          </button>
          <span className="opacity-30">|</span>
          <a href="#" className="border-b border-editorial-ink pb-1">Assistant</a>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar / Left Panel */}
        <aside className="w-90 border-r border-editorial-ink/10 p-12 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-12">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-editorial-ink/50 block mb-4 font-bold">Current Target Role</label>
              <form onSubmit={handleGenerate} className="relative group">
                <input 
                  type="text" 
                  id="job-title-input"
                  placeholder="Senior Software Engineer..."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-transparent border-b-2 border-editorial-ink py-2 text-2xl font-serif focus:outline-none placeholder:opacity-20 placeholder:italic transition-all"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-editorial-ink/5 text-[9px] rounded uppercase font-bold tracking-wider">Professional</span>
                  <span className="px-2 py-1 bg-editorial-ink/5 text-[9px] rounded uppercase font-bold tracking-wider">Curated</span>
                </div>
              </form>
            </div>

            <div className="p-6 bg-editorial-accent rounded-xl">
              <p className="text-xs leading-relaxed italic text-editorial-ink/70">
                "Precision over genericism. Our AI crafts questions that probe actual expertise rather than surface-level definitions."
              </p>
            </div>
          </div>

          <div className="pt-8">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-[11px] text-red-600 mb-4 font-bold uppercase tracking-wider"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !jobTitle.trim()}
              className="w-full bg-editorial-ink text-white py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden group shadow-xl shadow-editorial-ink/10 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating</span>
                </>
              ) : (
                <>
                  <span>Prepare Inquiries</span>
                  <Send size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Main Display Area */}
        <main className="flex-1 p-16 overflow-y-auto">
          <header className="mb-16">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-7xl font-serif leading-none mb-6 italic tracking-tighter"
            >
              Tailored Inquiries
            </motion.h1>
            <div className="h-[2px] w-32 bg-editorial-ink mb-8"></div>
            <p className="text-editorial-ink/60 max-w-md text-sm leading-relaxed font-medium">
              {jobTitle ? (
                <>Focused prompts designed to evaluate behavioral patterns and technical competency within the context of <span className="text-editorial-ink font-bold">{jobTitle}</span>.</>
              ) : (
                "Please specify a target role in the sidebar to begin generating professional interview prompts."
              )}
            </p>
          </header>

          {/* Results List */}
          <div className="space-y-0 relative">
            <AnimatePresence mode="popLayout" initial={false}>
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <motion.div
                    key={`${index}-${question.slice(0, 5)}`}
                    id={`question-card-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative border-t border-editorial-ink/10 py-10 flex gap-10 items-start hover:bg-editorial-paper px-8 -mx-8 transition-all duration-300 first:border-t-0"
                  >
                    <span className="font-serif italic text-2xl opacity-20 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-medium leading-snug mb-4">
                        {question}
                      </h3>
                      <div className="flex gap-4 items-center">
                        <span className={`text-[10px] uppercase font-bold tracking-[0.15em] ${
                          index === 0 ? 'text-[#A52A2A]' : index === 1 ? 'text-[#2E8B57]' : 'text-[#4682B4]'
                        }`}>
                          {index === 0 ? 'Behavioral' : index === 1 ? 'Strategic' : 'Practical'}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-editorial-ink/20"></div>
                        <span className="text-[10px] uppercase font-bold text-editorial-ink/30 tracking-[0.1em]">Assessment Prompt</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => copyToClipboard(question, index)}
                      className={`p-3 rounded-full transition-all duration-300 cursor-pointer ${
                        copiedIndex === index 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-editorial-ink/5 text-editorial-ink/40 opacity-0 group-hover:opacity-100 hover:bg-editorial-ink hover:text-white'
                      }`}
                    >
                      {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </motion.div>
                ))
              ) : !isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-12 border-t border-editorial-ink/10"
                >
                  <div className="flex flex-col items-center justify-center text-center py-20 bg-editorial-accent/30 rounded-3xl border border-dashed border-editorial-ink/20">
                    <Sparkles size={40} className="text-editorial-ink/20 mb-6" />
                    <h2 className="text-2xl font-serif italic mb-2 tracking-tight">Awaiting Definition</h2>
                    <p className="text-editorial-ink/40 text-sm max-w-xs mx-auto">
                      Use the target role input to define the scope of our inquiry generation.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      {['Data Engineer', 'Lead Architect', 'Content Strategist'].map(ex => (
                        <button 
                          key={ex} 
                          onClick={() => setJobTitle(ex)}
                          className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 bg-editorial-ink/5 hover:bg-editorial-ink hover:text-white transition-all rounded-full cursor-pointer"
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {questions.length > 0 && (
              <div className="border-t border-editorial-ink/10 pt-8" />
            )}
          </div>
        </main>
      </div>

      <footer className="h-12 border-t border-editorial-ink/10 px-12 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-editorial-ink/40 flex-shrink-0 bg-editorial-bg font-bold">
        <span>Prepared for: {jobTitle || "Initial Assessment"}</span>
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`}></div>
            <span>Session: {isLoading ? 'Generating' : 'Active'}</span>
          </div>
          <span className="opacity-30">|</span>
          <span>Inquiries: {questions.length}/3</span>
        </div>
      </footer>
    </div>
  );
}
