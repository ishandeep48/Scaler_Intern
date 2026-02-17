import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BrainBolt ⚡',
  description: 'Adaptive Infinite Quiz',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={cn(inter.className, "h-full bg-slate-950 text-slate-100 overflow-hidden antialiased")}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}
