import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TalkRegal - A safe space for Regals to chat.",
  description: "A safe space for Regals to chat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position='top-center' richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
