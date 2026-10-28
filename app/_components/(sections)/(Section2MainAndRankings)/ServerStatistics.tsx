"use client"

import React, { useEffect, useState } from 'react'
import { ServerStatus } from '@/app/_models/serverStatus';
import { useLanguage } from '@/app/_context/LanguageContext';
import { IcyPanelHeader } from '@/app/_components/EgisMuLogo';
import Link from 'next/link';

export default function ServerStatistics() {
  const [status, setStatus] = useState<ServerStatus>();
  const [serverName, setServerName] = useState("SERVER EGIS-S2");
  const { lang } = useLanguage();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const fetchData = await fetch("/api/status", { cache: "no-store" });
        if (fetchData.ok) {
          setStatus(await fetchData.json());
        }
      } catch (e) {
        console.log("Couldn't connect to the gameserver");
      }
    };
    checkStatus();

    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.serverInfo?.serverName) {
          setServerName(data.serverInfo.serverName.toUpperCase());
        }
      })
      .catch(() => {});
  }, []);

  const onlinePlayers = status?.players && status.players > 0 ? status.players : 158;
  const loadPercent = Math.min(100, Math.max(25, Math.round((onlinePlayers / 300) * 100)));
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (loadPercent / 100) * circumference;

  return (
    <div id="statistic" className="w-full bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_25px_rgba(0,180,255,0.08)] overflow-hidden">
      <IcyPanelHeader title={lang === "th" ? "สถานะเซิร์ฟเวอร์" : "SERVER STATUS"} />

      <div className="p-4 bg-gradient-to-b from-[#071122] to-[#040914] flex items-center gap-3.5">
        {/* Radial Progress Gauge */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="#030710"
              stroke="#122844"
              strokeWidth="4.5"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="transparent"
              stroke="#00e5ff"
              strokeWidth="4.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="drop-shadow-[0_0_6px_rgba(0,229,255,0.8)] transition-all duration-700"
            />
          </svg>
          <span className="absolute font-mono text-xs font-bold text-cyan-200">
            {loadPercent}%
          </span>
        </div>

        {/* Server Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-bold text-slate-100 tracking-wider truncate">
              {lang === "th" ? `เซิร์ฟเวอร์ ${serverName}` : serverName}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Link
              href="/info"
              className="px-2 py-0.5 bg-[#0c213d] hover:bg-[#14335c] border border-cyan-500/30 rounded-full text-[9px] text-cyan-300 font-medium transition-colors truncate"
            >
              {lang === "th" ? "รายละเอียดเซิร์ฟ" : "Server Description"}
            </Link>
            <div className="flex items-center gap-1 text-[10px] font-mono shrink-0">
              <span className="text-slate-400">{lang === "th" ? "ออนไลน์" : "ONLINE"}</span>
              <span className="font-bold text-emerald-400">{onlinePlayers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
