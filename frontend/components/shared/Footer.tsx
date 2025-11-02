'use client';

import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200/50 dark:border-slate-800/50 mt-16">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              PlayNew.ai
            </span>
          </div>
          <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
            © 2025 PlayNew.ai. 探索 Web3 新玩法 · 仅供学习参考，投资有风险
          </p>
        </div>
      </div>
    </footer>
  );
}
