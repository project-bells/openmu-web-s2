"use client"

import GuildMember from "@/app/_models/guildMemeber"
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function GuildPopUp({guildName, style} : {guildName: string, style: {}}){
    const [guildMembers, setGuildMembers] = useState<GuildMember[]>([]);
    const { lang } = useLanguage();

    const guildPositions: {[index: number]: string} =
      lang === "th"
        ? { 0: "สมาชิกกิลด์", 1: "รองหัวหน้ากิลด์", 2: "หัวหน้ากิลด์" }
        : { 0: "Member", 1: "Battle Master", 2: "Guild Master" };

    useEffect(() => {
        const fetchData = async() => {
            try {
                const result = await fetch("/api/guilds/" + encodeURIComponent(guildName));
                if (result.ok) {
                    const data = await result.json();
                    setGuildMembers(Array.isArray(data) ? [...data].reverse() : []);
                }
            } catch {
                setGuildMembers([]);
            }
        }
        fetchData();
    }, [guildName])

    return (
        <div className="flex flex-col rounded-xl bg-slate-900 border border-slate-700 p-4 z-50 fixed shadow-2xl min-w-[240px]" style={style}>
            <div className="font-display text-base font-bold text-amber-400 pb-2 mb-2 border-b border-slate-800 text-left">
                {guildName}
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-400 pb-1.5 border-b border-slate-800/60">
                <span>{lang === "th" ? "ชื่อสมาชิก" : "Member"}</span>
                <span>{lang === "th" ? "ตำแหน่ง" : "Role"}</span>
            </div>
            {Array.isArray(guildMembers) && guildMembers.map((gm, i) => (
                <div key={i} className="flex justify-between items-center text-xs text-slate-200 py-1.5 border-b border-slate-800/40 last:border-0">
                    <span className="font-medium">{gm.Name}</span>
                    <span className="text-amber-400/90">{guildPositions[gm.guildStatus]}</span>
                </div>
            ))}
        </div>
    )
}