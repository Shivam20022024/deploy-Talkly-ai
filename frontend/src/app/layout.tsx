import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Inter, Poppins } from "next/font/google";
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800",],
  variable: "--font-poppins",
})

const fontBricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800",],
  variable: "--font-bricolage",
})

export const metadata: Metadata = {
  title: "TalklyAI - Revenue Intelligence Platform",
  description: "AI for communication and learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
       className={`${fontSans.variable} ${fontBricolage.variable} ${poppins.variable} font-sans`} suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
