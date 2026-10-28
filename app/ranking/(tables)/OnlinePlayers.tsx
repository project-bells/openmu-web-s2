"use client"
import { CharacterOnline } from "@/app/_models/characterOnline"
import { useEffect, useState } from "react"
import { getImage } from '@/app/_utils/characterAvatarReturn';
import Image from "next/image"
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import MapsEnum from "@/app/_utils/mapEnum";
import { toast } from "react-toastify";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function OnlinePlayers() {
    const [characters, setCharacters] = useState<CharacterOnline[]>([])
    const { lang } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const status = await fetch("/api/status", { cache: "no-store" });
            if (status.ok) {
              const serverStatus = await status.json();
              const result = await fetch("/api/characters/ranking/online", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(serverStatus)
              });
              const final = await result.json();
              setCharacters(Array.isArray(final) ? final : []);
            } else {
              toast.error(lang === "th" ? "ไม่สามารถตรวจสอบรายชื่อผู้เล่นออนไลน์ได้ในขณะนี้" : "There was a problem trying to find the online users. Try again later.");
            }    
          } catch (e) {
            toast.error(lang === "th" ? "เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง" : "There was a problem! Try again later");
          }
        }
        fetchData()
    }, [lang])

  return (
    <div className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-900/90 text-xs text-slate-400 border-b border-slate-800">
          <tr>
            <th className="text-left font-medium py-3.5 pl-4 w-12">#</th>
            <th className="text-left font-medium py-3.5">
              {lang === "th" ? "ตัวละคร" : "Character"}
            </th>
            <th className="text-right font-medium py-3.5">
              {lang === "th" ? "แผนที่" : "Map"}
            </th>
            <th className="text-right font-medium py-3.5 pr-4">
              {lang === "th" ? "พิกัด" : "Coordinates"}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {characters.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-sm text-slate-400">
                {lang === "th" ? "ยังไม่มีผู้เล่นออนไลน์ในขณะนี้" : "No players are currently online."}
              </td>
            </tr>
          ) : (
            characters.map((c, i) => (
              <tr key={c.Name} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3 pl-4 font-mono tabular-nums text-xs text-slate-400">{i + 1}</td>
                <td className="py-3 font-medium text-slate-100 flex items-center gap-3">
                  <Image
                    className="rounded-lg border border-slate-700"
                    src={(getImage(c.CharacterClassId) as StaticImport)}
                    width={32}
                    height={32}
                    alt="character_avatar"
                  />
                  <span>{c.Name}</span>
                </td>
                <td className="py-3 text-right text-slate-300">
                  {Object.values(MapsEnum)[Object.keys(MapsEnum).indexOf(c.CurrentMapId!)] || "Lorencia"}
                </td>
                <td className="py-3 pr-4 font-mono tabular-nums text-right text-amber-400">
                  {c.PositionX}, {c.PositionY}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

