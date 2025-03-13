import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Logo from "../components/logo/supabase-logo"
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Full viewport height */}
          <main className="h-screen flex flex-col gap-7">
            
            {/* Navigation Baimage.pngr (Fixed Height) */}
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  <a href="/">
                    <Logo></Logo>
                  </a>
                </div>
                {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
              </div>
            </nav>

            {/* Main content (takes remaining space) */}
            <div className="flex-1 flex w-full max-w-7xl mx-auto ">
              <div className="flex-1 overflow-auto">{children}</div>
            </div>

            {/* Footer (Fixed Height) */}
            <footer className="w-full h-16 flex items-center justify-center border-t mx-auto text-center text-xs gap-8">
              <p>
                Provided to you by <span className="font-bold">Locked In Industries</span>
              </p>
              <ThemeSwitcher />
            </footer>

          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
