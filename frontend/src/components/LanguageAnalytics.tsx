import React from 'react';
import { CallInteraction } from '../types';
import { Globe, Clock, TrendingUp } from 'lucide-react';

interface LanguageAnalyticsProps {
  interactions: CallInteraction[];
}

export default function LanguageAnalytics({ interactions }: LanguageAnalyticsProps) {
  // Aggregate languages
  const languageCounts = interactions.reduce((acc, call) => {
    const lang = call.language || 'English';
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1]);
    
  const totalCalls = interactions.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Language Analytics</h2>
        <div className="badge px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium">
          Multilingual Support Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="text-purple-500" />
            <h3 className="text-lg font-bold">Language Distribution</h3>
          </div>
          
          <div className="space-y-4">
            {sortedLanguages.map(([lang, count]) => (
              <div key={lang}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{lang}</span>
                  <span className="text-slate-500">{count} calls ({Math.round((count/totalCalls)*100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(count/totalCalls)*100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            
            {sortedLanguages.length === 0 && (
              <p className="text-slate-500 py-4 text-center">No language data available yet.</p>
            )}
          </div>
        </div>

        <div className="card p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-emerald-500" />
            <h3 className="text-lg font-bold">Conversion by Language</h3>
          </div>
          
          <div className="space-y-4">
            {/* Mocked conversion data for demo purposes since actual conversions need CRM sync */}
            {sortedLanguages.map(([lang, count]) => {
              const mockConversion = Math.min(100, Math.round(count * 3.5 + 20));
              return (
                <div key={`${lang}-conv`} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs">
                      {mockConversion}%
                    </div>
                    <span className="font-medium">{lang}</span>
                  </div>
                  <span className="text-sm text-slate-500">Lead Score</span>
                </div>
              );
            })}
            
            {sortedLanguages.length === 0 && (
              <p className="text-slate-500 py-4 text-center">No conversion data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
