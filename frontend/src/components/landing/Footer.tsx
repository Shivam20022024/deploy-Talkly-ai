'use client';

import Image from 'next/image';
import React from 'react';

const SocialIcon = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/[0.08] flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-theme-600 dark:hover:text-brand-primary hover:border-theme-200 dark:hover:border-brand-primary/25 hover:bg-theme-50 dark:hover:bg-white/[0.03] transition-all duration-300"
  >
    {children}
  </a>
);

export const Footer = () => {
  return (
    <footer className="relative bg-gray-50 dark:bg-bg-dark-elevated overflow-hidden pt-16 sm:pt-20 pb-8">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.06] to-transparent" />
      
      <div className="max-w-4xl mx-auto px-4 md:px-8 flex flex-col items-center text-center relative z-10">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-6">
           <Image
                          src="/logo-white.png"
                          alt="Logo"
                          width={550}
                          height={453}
                          className="h-[42px] w-auto flex-shrink-0 object-contain hidden dark:block"
                          priority
                          unoptimized
                        />
                        <Image
                          src="/logo-color.png"
                          alt="Logo"
                          width={550}
                          height={453}
                          className="h-[42px] w-auto flex-shrink-0 object-contain block dark:hidden"
                          priority
                          unoptimized
                        />
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Talkly<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-grad-1 to-brand-grad-2 dark:from-brand-primary dark:to-brand-grad-3">AI</span>
          </span>
        </div>

        <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed max-w-lg mb-8">
          We transform unstructured customer conversations into actionable sales intelligence, helping you close deals faster and smarter.
        </p>

        {/* Socials */}
        <div className="flex items-center gap-4 mb-8 md:mb-0">
          <SocialIcon href="https://instagram.com/talklyai">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.168.053 1.802.25 2.224.415.56.218.96.478 1.383.9.423.423.682.823.9 1.383.165.422.362 1.056.415 2.224.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.053 1.168-.25 1.802-.415 2.224-.218.56-.478.96-.9 1.383-.423.423-.823.682-1.383.9-.422.165-1.056.362-2.224.415-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.168-.053-1.802-.25-2.224-.415-.56-.218-.96-.478-1.383-.9-.423-.423-.682-.823-.9-1.383-.165-.422-.362-1.056-.415-2.224-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.053-1.168.25-1.802.415-2.224.218-.56.478-.96.9-1.383.423-.423.823-.682 1.383-.9.422-.165 1.056-.362 2.224-.415 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.058-2.15.258-2.915.56a5.89 5.89 0 0 0-2.126 1.383A5.89 5.89 0 0 0 .634 4.22c-.302.765-.502 1.638-.56 2.915C.014 8.333 0 8.741 0 12c0 3.259.014 3.667.072 4.947.058 1.277.258 2.15.56 2.915a5.89 5.89 0 0 0 1.383 2.126 5.89 5.89 0 0 0 2.126 1.383c.765.302 1.638.502 2.915.56 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.277-.058 2.15-.258 2.915-.56a5.89 5.89 0 0 0 2.126-1.383 5.89 5.89 0 0 0 1.383-2.126c.302-.765.502-1.638.56-2.915.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.277-.258-2.15-.56-2.915a5.89 5.89 0 0 0-1.383-2.126 5.89 5.89 0 0 0-2.126-1.383c-.765-.302-1.638-.502-2.915-.56C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://x.com/talklyai">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://linkedin.com/company/talklyai">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </SocialIcon>
        </div>

        {/* Bottom bar */}
        <div className="w-full relative pt-8 border-t border-gray-200/60 dark:border-white/[0.06]">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[300px] h-[120px] rounded-full bg-theme-100/30 dark:bg-brand-primary/[0.06] blur-[60px] pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              This product is made by Novalantis. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-400 dark:text-gray-500 font-medium">
              {/* Privacy and terms links removed */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
