import React from 'react'
import { prisma } from "@/lib/prisma"
import { CharacterRanking } from '@/app/_models/character';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from "next/image"
import { getImage, getClassName } from '@/app/_utils/characterAvatarReturn';
import { TranslatedText } from '@/app/_context/LanguageContext';
import Link from 'next/link';
import { IcyPanelHeader } from '@/app/_components/EgisMuLogo';

export default async function TopPlayers() {
  const characters: CharacterRanking[] = await getTop5Characters();

  return (
    <div className="w-full bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_25px_rgba(0,180,255,0.08)] overflow-hidden">
      <IcyPanelHeader title={<TranslatedText th="อันดับผู้เล่นสูงสุด" en="TOP PLAYERS" />} />

      <div className="p-3.5 bg-gradient-to-b from-[#071122] to-[#040914]">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[11px] text-slate-400 border-b border-[#132946]">
              <th className="text-left font-semibold pb-2 w-6">#</th>
              <th className="text-left font-semibold pb-2 uppercase tracking-wider">
                <TranslatedText th="ชื่อตัวละคร" en="NAME" />
              </th>
              <th className="text-center font-semibold pb-2 w-12">
                <TranslatedText th="เลเวล" en="LvL" />
              </th>
              <th className="text-right font-semibold pb-2 w-12">
                <TranslatedText th="อาชีพ" en="Class" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#10233d]/70">
            {characters.map((c, i) => (
              <tr key={c.Name} className="hover:bg-cyan-500/5 transition-colors">
                <td className="py-2 font-mono tabular-nums text-[11px] text-slate-400">{i + 1}.</td>
                <td className="py-2 font-medium text-slate-200 flex items-center gap-1.5">
                  <Image
                    className="rounded-sm border border-cyan-500/30"
                    src={(getImage(c.CharacterClassId) as StaticImport)}
                    width={18}
                    height={18}
                    alt="character_avatar"
                  />
                  <span className="truncate max-w-[92px] text-[11px] text-cyan-50 font-medium">{c.Name}</span>
                </td>
                <td className="py-2 font-mono tabular-nums text-center text-[11px] font-bold text-cyan-300">
                  {c.lvl}
                </td>
                <td className="py-2 font-mono text-right text-[11px] text-slate-300">
                  {getClassName(c.CharacterClassId)}
                </td>
              </tr>
            ))}
            {characters.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-xs text-slate-500">
                  <TranslatedText th="ไม่มีข้อมูลตัวละคร" en="No characters found" />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-3 pt-2.5 border-t border-[#132946] flex items-center justify-between text-[11px]">
          <Link
            href="/ranking"
            className="text-slate-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
          >
            <TranslatedText th="ผู้เล่นทั้งหมด" en="All players" />
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

async function getTop5Characters () {
  try {
    const statAttribute: CharacterRanking[] = 
    await prisma.$queryRaw`SELECT sa."CharacterId", c."Name" , c."CharacterClassId" ,
      MAX(CASE WHEN sa."DefinitionId"  = '89a891a7-f9f9-4ab5-af36-12056e53a5f7' THEN sa."Value"  ELSE 0 END) AS resets,
      MAX(CASE WHEN sa."DefinitionId"  = '560931ad-0901-4342-b7f4-fd2e2fcc0563' THEN sa."Value"  ELSE 0 END) AS lvl,
      MAX(CASE WHEN sa."DefinitionId"  = '70cd8c10-391a-4c51-9aa4-a854600e3a9f' THEN sa."Value"  ELSE 0 END) AS masterlvl
    FROM 
    data."StatAttribute" sa
    inner join data."Character" c   on  sa."CharacterId" = c."Id" 
    GROUP BY sa."CharacterId", c."Name" , c."CharacterClassId"
    ORDER BY lvl DESC, masterlvl desc, resets desc
    limit 5;`
    return Array.isArray(statAttribute) ? statAttribute.slice(0, 5) : [];
  } catch (e) {
    console.error("TopPlayers fetch error:", e);
    return [];
  }
}
