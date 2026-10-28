import { prisma } from '@/lib/prisma'
import { Guild } from '@prisma/client'
import { TranslatedText } from '@/app/_context/LanguageContext'
import Link from 'next/link'
import { IcyPanelHeader } from '@/app/_components/EgisMuLogo'

export default async function TopGuilds() {
  const guilds: Guild[] = await getTop5Guilds();

  return (
    <div className="w-full bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_25px_rgba(0,180,255,0.08)] overflow-hidden">
      <IcyPanelHeader title={<TranslatedText th="อันดับกิลด์สูงสุด" en="TOP GUILDS" />} />

      <div className="p-3.5 bg-gradient-to-b from-[#071122] to-[#040914]">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[11px] text-slate-400 border-b border-[#132946]">
              <th className="text-left font-semibold pb-2 w-6">#</th>
              <th className="text-left font-semibold pb-2 uppercase tracking-wider">
                <TranslatedText th="ชื่อกิลด์" en="NAME" />
              </th>
              <th className="text-right font-semibold pb-2">
                <TranslatedText th="คะแนน" en="Score" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#10233d]/70">
            {guilds.map((g, i) => (
              <tr key={g.Name} className="hover:bg-cyan-500/5 transition-colors">
                <td className="py-2 font-mono tabular-nums text-[11px] text-slate-400">{i + 1}.</td>
                <td className="py-2 font-medium text-[11px] text-cyan-50">{g.Name}</td>
                <td className="py-2 font-mono tabular-nums text-right text-[11px] font-bold text-cyan-300">
                  {g.Score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 pt-2.5 border-t border-[#132946] flex items-center justify-between text-[11px]">
          <Link
            href="/ranking"
            className="text-slate-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
          >
            <TranslatedText th="กิลด์ทั้งหมด" en="All guilds" />
          </Link>
          <Link
            href="/ranking"
            className="px-2.5 py-1 bg-[#0b1c36] hover:bg-[#122b52] border border-cyan-400/40 text-cyan-200 text-[10px] font-semibold tracking-wider transition-all"
          >
            <TranslatedText th="+ ดูเพิ่ม" en="+ more" />
          </Link>
        </div>
      </div>
    </div>
  )
}

async function getTop5Guilds() {
  try {
    const guilds: Guild[] = await prisma.guild.findMany({
      take: 5,
      orderBy: {
        Score: "desc"
      }
    });
    return Array.isArray(guilds) ? guilds : [];
  } catch (e) {
    console.error("TopGuilds fetch error:", e);
    return [];
  }
}
