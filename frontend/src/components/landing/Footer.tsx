'use client';

import React from 'react';

const SocialIcon = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-[#DBB7F2] hover:border-[#DBB7F2]/25 hover:bg-white/[0.03] transition-all duration-300"
  >
    {children}
  </a>
);

export const Footer = () => {
  const linkGroups = [
    {
      title: 'Quick Links',
      links: ['Home', 'About', 'Features', 'Pricing', 'Blog', 'Contact'],
    },
    {
      title: 'Product',
      links: ['Voice Intelligence', 'Lead Scoring', 'Agent Coaching', 'Live Monitoring', 'Integrations', 'API Docs'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Changelog', 'FAQ', 'Privacy Policy', 'Terms of Service', 'Security'],
    },
  ];

  return (
    <footer className="relative bg-[#0A0A1C] overflow-hidden">
      {/* Top divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-16 sm:pt-20 pb-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand column – spans 2 cols on lg */}
          <div className="lg:col-span-2 space-y-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#DBB7F2] to-[#7A668A]">
                <span className="text-[#181623] font-black text-lg">T</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Talkly<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DBB7F2] to-[#EDDBF9]">AI</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs">
              We transform unstructured customer conversations into actionable sales intelligence, helping you close deals faster and smarter.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <SocialIcon href="#">
                {/* Instagram */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#">
                {/* X / Twitter */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#">
                {/* LinkedIn */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Link columns */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-white mb-5">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 font-medium hover:text-[#DBB7F2] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="relative pt-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

          {/* Centered glow */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[300px] h-[120px] rounded-full bg-[#DBB7F2]/[0.06] blur-[60px] pointer-events-none" />

          <p className="text-center text-xs text-gray-600 font-medium">
            © {new Date().getFullYear()} TalklyAI Technologies Inc. All Rights Reserved · <a href="#" className="hover:text-[#DBB7F2] transition-colors">Privacy</a> · <a href="#" className="hover:text-[#DBB7F2] transition-colors">Terms</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
