'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Globe, Mic, Save, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>(['English', 'Hindi', 'Tamil']);
  const [preferredVoice, setPreferredVoice] = useState('Female');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const availableLanguages = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 
    'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Bhojpuri', 'Odia', 
    'Assamese', 'Urdu'
  ];

  useEffect(() => {
    // Load from local storage for mockup purposes
    const stored = localStorage.getItem('talklyOrgSettings');
    if (stored) {
      const parsed = JSON.parse(stored);
      setDefaultLanguage(parsed.defaultLanguage || 'English');
      setSupportedLanguages(parsed.supportedLanguages || ['English', 'Hindi']);
      setPreferredVoice(parsed.preferredVoice || 'Female');
    }
  }, []);

  const toggleLanguage = (lang: string) => {
    setSupportedLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('talklyOrgSettings', JSON.stringify({
        defaultLanguage,
        supportedLanguages,
        preferredVoice
      }));
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" />
            Organization Settings
          </h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            Configure default multilingual behaviors and AI voice preferences.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
        >
          {isSaving ? <span className="animate-pulse">Saving...</span> : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-indigo-500" />
            Language Preferences
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Default Campaign Language</label>
              <select 
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:border-blue-500 outline-none"
              >
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">This language will be pre-selected for new outbound campaigns.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Supported Languages</label>
              <div className="grid grid-cols-2 gap-3">
                {availableLanguages.map(lang => (
                  <label key={lang} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={supportedLanguages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{lang}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-bg-dark-surface border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Mic className="w-5 h-5 text-purple-500" />
            AI Voice Configuration
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Preferred Voice Profile</label>
              <select 
                value={preferredVoice}
                onChange={(e) => setPreferredVoice(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:border-purple-500 outline-none"
              >
                <option value="Female">Female (Professional)</option>
                <option value="Male">Male (Authoritative)</option>
                <option value="Female-Casual">Female (Casual/Friendly)</option>
                <option value="Male-Casual">Male (Casual/Friendly)</option>
              </select>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-100 dark:border-purple-500/20">
              <h4 className="text-sm font-bold text-purple-800 dark:text-purple-400 mb-1">Dynamic Accent Matching</h4>
              <p className="text-xs text-purple-600 dark:text-purple-300 leading-relaxed">
                When the AI engine detects a specific regional language, it will automatically attempt to use an accent appropriate for that region (e.g. Marathi accent for Marathi calls) if supported by the Voice Provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
