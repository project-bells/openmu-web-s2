import './globals.css'
import type { Metadata } from 'next'
import Navbar from './_components/(navbar)/Navbar'
import Footer from './_components/(footer)/Footer'
import AccountPanel from './_components/(sections)/(section1NewsAndUserPanel)/AccountPanel'
import TopPlayers from './_components/(sections)/(Section2MainAndRankings)/TopPlayers'
import TopGuilds from './_components/(sections)/(Section2MainAndRankings)/TopGuilds'
import RightSidebar from './_components/(sections)/(Section2MainAndRankings)/RightSidebar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LanguageProvider } from './_context/LanguageContext'

export const metadata: Metadata = {
  title: 'Egis-MU S2 — Dark Fantasy Season 2 No-Reset Server',
  description: 'Egis-MU S2 — ตำนานมิวออนไลน์ Season 2 คลาสสิกแท้ ไร้ระบบรีเซ็ต (No-Reset) เลเวลตัน 400 สงคราม Castle Siege และระบบสมดุลคลาสเต็มรูปแบบ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className="dark">
      <body className="font-sans min-h-screen m-0 flex flex-col items-center w-full bg-[#03060c] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-100">
        <LanguageProvider>
          {/* Mystical Dark-Fantasy Background Texture & Icy Aura */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,180,255,0.14)_0%,rgba(4,10,24,0.92)_55%,#03060c_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[420px] bg-[url('~/public/img/bg-footer.jpg')] bg-bottom bg-cover bg-no-repeat opacity-20" />
          </div>

          {/* Top Hero Header + Horizontal Navigation Bar */}
          <Navbar />

          {/* Classic 3-Column MMORPG Grid Layout */}
          <main className="relative z-10 w-full max-w-[1200px] px-3 sm:px-6 pt-5 pb-12">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Account Panel, Top Players, Top Guilds */}
              <aside className="lg:col-span-3 w-full flex flex-col gap-5 order-2 lg:order-1">
                <AccountPanel />
                <TopPlayers />
                <TopGuilds />
              </aside>

              {/* Center Column: News Feed ("News Title - Good News Today") or Active Route Content */}
              <section className="lg:col-span-6 w-full min-w-0 order-1 lg:order-2">
                {children}
              </section>

              {/* Right Column: Download & Registration CTAs, Server Status, Fast Links, Forum Topics */}
              <div className="lg:col-span-3 w-full order-3">
                <RightSidebar />
              </div>
            </div>
          </main>

          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            closeOnClick
            pauseOnHover
            theme="dark"
          />
        </LanguageProvider>
      </body>
    </html>
  )
}
