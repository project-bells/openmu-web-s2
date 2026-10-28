"use client"

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import AddStatsIcon from "@/public/img/account/add-stats.png";
import ClearPkIcon from "@/public/img/account/clear-pk.png";
import ResetStats from "@/public/img/account/reset-stats.png";
import ResetIcon from "@/public/img/account/reset.png";
import AddStatsCard from "./AddStatsCard";
import { useEffect, useState } from "react";
import { getImage, getClassName } from "@/app/_utils/characterAvatarReturn";
import { CharacterEdit } from "../_models/characterEdit";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/_context/LanguageContext";
import type { CharacterFeatureSettings } from "@/lib/siteConfig";
import { ArrowUpCircle, Shield } from "lucide-react";

const defaultCharSettings: CharacterFeatureSettings = {
  pk: { enabled: true, zenCost: 1000000 },
  reset: { enabled: false, zenCost: 0, requiredLevel: 400, maxReset: 0 },
  relevel: { enabled: false, zenCost: 2000000, targetLevel: 400 },
  addStats: { enabled: true },
  resetStats: { enabled: true, zenCost: 3000000 },
};

export default function CharactersPage({
  result,
  initialSettings,
}: {
  result: CharacterEdit[];
  initialSettings?: CharacterFeatureSettings;
}) {
  const [characters, setCharacters] = useState([false, false, false, false, false]);
  const [lastClicked, setLastClicked] = useState(-1);
  const [settings, setSettings] = useState<CharacterFeatureSettings>(
    initialSettings || defaultCharSettings
  );
  const { lang } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.characterSettings) {
          setSettings(data.characterSettings);
        }
      })
      .catch(() => {});
  }, []);

  function openStatistic(index: number) {
    const arr = Array(5).fill(false);
    if (lastClicked !== index) {
      arr[index] = true;
      setLastClicked(index);
    } else {
      arr[index] = false;
      setLastClicked(-1);
    }
    setCharacters(arr);
  }

  async function resetCharacter(name: string, clasId: string) {
    const response = await fetch("/api/characters/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, clasId }),
    });
    const body = await response.json();
    if (response.ok) {
      toast.success(body.message);
      router.refresh();
    } else {
      toast.error(body.message);
    }
  }

  async function pkClear(name: string) {
    const response = await fetch("/api/characters/pkclear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const body = await response.json();
    if (response.ok) {
      toast.success(body.message);
      router.refresh();
    } else {
      toast.error(body.message);
    }
  }

  async function relevelCharacter(name: string) {
    const response = await fetch("/api/characters/relevel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const body = await response.json();
    if (response.ok) {
      toast.success(body.message);
      router.refresh();
    } else {
      toast.error(body.message);
    }
  }

  async function resetStats(name: string, clasId: string) {
    const response = await fetch("/api/characters/resetStats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, clasId }),
    });
    const body = await response.json();
    if (response.ok) {
      toast.success(body.message);
      openStatistic(-1);
      router.refresh();
    } else {
      toast.error(body.message);
    }
  }

  return (
    <div className="bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_30px_rgba(0,180,255,0.08)] p-5 sm:p-6 flex flex-col w-full">
      <div className="border-b border-[#163152] pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-cyan-200 tracking-wider uppercase">
            {lang === "th" ? "จัดการตัวละคร (Egis-MU S2)" : "Character Management (Egis-MU S2)"}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/15 border border-cyan-400/40 text-xs font-semibold text-cyan-200">
            <Shield className="w-3.5 h-3.5 text-cyan-300" />
            <span>{lang === "th" ? "ระบบไร้รีเซ็ต · เลเวลตัน 400" : "No-Reset Realm · Max Lv 400"}</span>
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {lang === "th"
            ? "จัดสรรแต้มสเตตัส ล้างสถานะหัวแดง (PK) และรีเซ็ตค่าสเตตัสตัวละครในบัญชีของคุณ"
            : "Distribute stat points, clear PK status, and reallocate attributes in your account"}
        </p>
      </div>

      {result.length === 0 && (
        <div className="bg-[#040914] border border-[#152d4d] p-8 text-center">
          <p className="text-slate-300 text-sm font-medium">
            {lang === "th"
              ? "ยังไม่มีตัวละครที่สร้างไว้ในบัญชีนี้ (กรุณาสร้างตัวละครในตัวเกมหรือเข้าสู่ระบบ)"
              : "There are no created characters on this account at the moment."}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {result?.map((c, i) => (
          <div
            key={c.name}
            className="bg-[#040914] border border-[#152d4d] p-5 flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src={getImage(c.characterClassId) as StaticImport}
                  alt="character_avatar"
                  width={48}
                  height={48}
                  className="border border-cyan-500/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-slate-100">{c.name}</h3>
                    <span className="px-2 py-0.5 bg-[#081529] border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold">
                      {getClassName(c.characterClassId)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono tabular-nums">
                    <span>
                      {lang === "th" ? "เลเวล:" : "Level:"}{" "}
                      <strong className="text-cyan-300 font-bold">{c.lvl}</strong> / 400
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {lang === "th" ? "แต้มคงเหลือ:" : "Points:"}{" "}
                      <strong className="text-emerald-400 font-bold">{c.levelUpPoints}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {settings.reset?.enabled && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0a192f] hover:bg-[#102849] border border-cyan-500/40 text-xs font-bold text-slate-200 transition-colors whitespace-nowrap shrink-0"
                    onClick={() => resetCharacter(c.name, c.characterClassId)}
                  >
                    <Image
                      src={ResetIcon}
                      width={18}
                      alt="reset_icon"
                      className="w-4 h-4 object-contain"
                    />
                    <span>{lang === "th" ? "รีเซ็ตเลเวล" : "Reset"}</span>
                  </button>
                )}

                {settings.relevel?.enabled && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-colors whitespace-nowrap shrink-0"
                    onClick={() => relevelCharacter(c.name)}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>{lang === "th" ? "รีเลเวล" : "Relevel"}</span>
                  </button>
                )}

                {settings.pk?.enabled && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold text-rose-300 transition-colors whitespace-nowrap shrink-0"
                    onClick={() => pkClear(c.name)}
                  >
                    <Image
                      src={ClearPkIcon}
                      width={18}
                      alt="clear_pk_icon"
                      className="w-4 h-4 object-contain"
                    />
                    <span>{lang === "th" ? "ล้างหัวแดง (PK)" : "PK Clear"}</span>
                  </button>
                )}

                {settings.addStats?.enabled && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-b from-[#133863] to-[#0a213d] hover:from-[#1b4e87] hover:to-[#0d2b4f] border border-cyan-400/60 text-cyan-100 text-xs font-bold transition-colors whitespace-nowrap shrink-0"
                    onClick={() => openStatistic(i)}
                  >
                    <Image
                      src={AddStatsIcon}
                      width={18}
                      alt="add_stats_icon"
                      className="w-4 h-4 object-contain"
                    />
                    <span>
                      {characters[i]
                        ? lang === "th"
                          ? "ปิดหน้าต่างแต้ม"
                          : "Close Stats"
                        : lang === "th"
                        ? "อัปแต้มสเตตัส"
                        : "Add Stats"}
                    </span>
                  </button>
                )}

                {settings.resetStats?.enabled && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0a192f] hover:bg-[#102849] border border-[#1d3e69] text-xs font-bold text-slate-200 transition-colors whitespace-nowrap shrink-0"
                    onClick={() => resetStats(c.name, c.characterClassId)}
                  >
                    <Image
                      src={ResetStats}
                      width={18}
                      alt="reset_stats_icon"
                      className="w-4 h-4 object-contain"
                    />
                    <span>{lang === "th" ? "รีเซ็ตสเตตัส" : "Reset Stats"}</span>
                  </button>
                )}
              </div>
            </div>

            {characters[i] && (
              <div className="pt-4 border-t border-[#152d4d]">
                <AddStatsCard characterEdit={c} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
