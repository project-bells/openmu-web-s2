"use client"
import NewsComplete from '@/app/_models/NewsComplete'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import { useLanguage } from '@/app/_context/LanguageContext'

const NEWS_BANNERS = [
  "/img/slider-img-3.jpg",
  "/img/slider-img-1.jpg",
  "/img/castle_siege_banner_bg.jpg",
  "/img/slider-img-2.jpg",
  "/img/img-util.jpg",
];

const BILINGUAL_NEWS_MAP: Record<
  string,
  {
    defaultTitleEn: string;
    defaultTitleTh: string;
    titleTh: string;
    titleEn: string;
    bodyTh: string;
    bodyEn: string;
    authorTh: string;
    authorEn: string;
  }
> = {
  "default-1": {
    defaultTitleEn: "NEWS TITLE - GOOD NEWS TODAY · EGIS-MU SEASON 2",
    defaultTitleTh: "ประกาศข่าวดีวันนี้ · เปิดตำนาน EGIS-MU SEASON 2 (ไร้ระบบรีเซ็ต)",
    titleTh: "ประกาศข่าวดีวันนี้ · เปิดตำนาน EGIS-MU SEASON 2 (ไร้ระบบรีเซ็ต)",
    titleEn: "NEWS TITLE - GOOD NEWS TODAY · EGIS-MU SEASON 2",
    bodyTh:
      "สงครามแห่งอาณาจักรได้ปะทุขึ้นอีกครั้ง เหล่าอสูรแห่งความมืดและกองทัพของ Kundun กำลังรุกรานทวีป MU! ขอต้อนรับเหล่านักรบเข้าสู่ Egis-MU Season 2 คลาสสิกแท้ในรูปแบบ No-Reset (เลเวลตัน 400) ที่ทุกเลเวล เพชร Bless, Soul และไอเทมยอดเยี่ยมทุกชิ้นมีคุณค่าระยะยาวอย่างแท้จริง ร่วมจัดตั้งปาร์ตี้และออกผจญภัยได้แล้ววันนี้!",
    bodyEn:
      "War broke out between kingdoms. Wild animals turn into raging beasts and the dead return to life, craving for blood. Fight against the dark influence of Kundun across the continent of Egis-MU Season 2! Experience true classic No-Reset progression capped at Level 400, where every Jewel of Bless, Soul, and Excellent piece holds lasting value.",
    authorTh: "ทีมงาน Egis-MU",
    authorEn: "Egis-MU Team",
  },
  "default-2": {
    defaultTitleEn: "VALLEY OF LOREN · CASTLE SIEGE & KALIMA KUNDUN SCHEDULE",
    defaultTitleTh: "ตารางศึกชิงปราสาท VALLEY OF LOREN & เวลาเกิดบอส KALIMA KUNDUN",
    titleTh: "ตารางศึกชิงปราสาท VALLEY OF LOREN & เวลาเกิดบอส KALIMA KUNDUN",
    titleEn: "VALLEY OF LOREN · CASTLE SIEGE & KALIMA KUNDUN SCHEDULE",
    bodyTh:
      "เตรียมความพร้อมให้กับพันธมิตรกิลด์ของคุณสำหรับมหาสงครามชิงปราสาท Castle Siege ทุกวันอาทิตย์ เวลา 20:00 - 22:00 น. กิลด์ที่ครอบครองปราสาทจะได้รับสิทธิ์เข้าสู่แผนที่ Land of Trials, ระบบผสมไอเทม Lord Mix และภาษีประจำเมือง นอกจากนี้บอส Illusion of Kundun ใน Kalima ชั้น 6 จะเกิดทุกๆ 12 ชั่วโมง พร้อมดรอปเซ็ตไอเทมโบราณ (Ancient) และอาวุธเลเวล 380 แท้ตามแบบฉบับ Season 2",
    bodyEn:
      "Prepare your guild alliances for the weekly Castle Siege battle every Sunday at 20:00 - 22:00 GMT+7. The ruling alliance gains exclusive access to Land of Trials, Lord Mix crafting, and Castle Tax rewards. In addition, Illusion of Kundun in Kalima 6 respawns every 12 hours with authentic Season 2 Ancient & 380-level item drops.",
    authorTh: "ทีมงาน Egis-MU",
    authorEn: "Egis-MU Team",
  },
  "default-3": {
    defaultTitleEn: "PURE NO-RESET BALANCE & PLAY-TO-WIN GUARANTEE",
    defaultTitleTh: "สมดุล 5 อาชีพคลาสสิก & การันตีสังคมเกม PLAY-TO-WIN 100%",
    titleTh: "สมดุล 5 อาชีพคลาสสิก & การันตีสังคมเกม PLAY-TO-WIN 100%",
    titleEn: "PURE NO-RESET BALANCE & PLAY-TO-WIN GUARANTEE",
    bodyTh:
      "เซิร์ฟเวอร์ Egis-MU Season 2 ออกแบบระบบเศรษฐกิจและการต่อสู้ภายใต้แนวคิด No-Reset (เลเวลตัน 400) อย่างแท้จริง ไม่มีระบบ Web-Shop ขายไอเทมโกงสเตตัส ทุกสายอาชีพทั้ง 5 คลาส (Dark Knight, Dark Wizard, Fairy Elf, Magic Gladiator และ Dark Lord) ได้รับการปรับสมดุลอย่างพิถีพิถัน ทั้งสำหรับการเก็บเลเวลเป็นปาร์ตี้ ลงดันเจี้ยน Blood Castle, Devil Square, Chaos Castle และการประลอง PvP",
    bodyEn:
      "Egis-MU Season 2 is strictly engineered around a No-Reset economy (Max Level 400). There are no overpowered Web-Shop items or custom stats. All 5 classic classes (Dark Knight, Dark Wizard, Fairy Elf, Magic Gladiator, and Dark Lord) are carefully balanced for party leveling, Blood Castle, Devil Square, Chaos Castle, and PvP.",
    authorTh: "ทีมงาน Egis-MU",
    authorEn: "Egis-MU Team",
  },
};

export default function NewsCard({
  news,
  shortVersion,
  index = 0,
}: {
  news: NewsComplete;
  shortVersion?: boolean;
  index?: number;
}) {
  const [role, setRole] = useState<string | null>();
  const [showDialog, setShowDialog] = useState(false);
  const { lang } = useLanguage();

  function hideDialog() {
    setShowDialog(false);
  }

  const router = useRouter();
  function goToNewsPage() {
    router.push("/news/" + news.id);
  }

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  async function deleteNews() {
    const request = await fetch("/api/admin/news/" + news.id, {
      method: "DELETE",
      headers: { "x-admin-auth": "egis-admin" },
    });
    const result = await request.json();
    if (request.ok) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    hideDialog();
  }

  const bannerSrc = NEWS_BANNERS[index % NEWS_BANNERS.length];
  const localized = BILINGUAL_NEWS_MAP[news.id];
  const isUneditedDefault =
    localized &&
    (news.title === localized.defaultTitleEn || news.title === localized.defaultTitleTh);

  const displayTitle = isUneditedDefault
    ? lang === "th"
      ? localized.titleTh
      : localized.titleEn
    : news.title || (lang === "th" ? "ข่าวสารและประกาศจากเซิร์ฟเวอร์" : "NEWS TITLE - GOOD NEWS TODAY");

  const displayBody = isUneditedDefault
    ? lang === "th"
      ? localized.bodyTh
      : localized.bodyEn
    : news.body;

  const displayAuthor = isUneditedDefault
    ? lang === "th"
      ? localized.authorTh
      : localized.authorEn
    : news.author || (lang === "th" ? "ทีมงาน Egis-MU" : "Egis-MU Team");

  const formattedDate = new Date(news.creationDate).toLocaleDateString(
    lang === "th" ? "th-TH" : "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  );

  return (
    <article className="bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_30px_rgba(0,180,255,0.08)] overflow-hidden transition-all hover:border-cyan-400/50">
      {showDialog && <DeleteConfirmationDialog onConfirm={deleteNews} onCancel={hideDialog} />}

      {/* Top Header Bar with Title & Icy Cyan Glow Underline */}
      <div className="relative px-5 py-3.5 bg-gradient-to-r from-[#09162b] via-[#0e2240] to-[#09162b] border-b border-[#1b3b61] flex items-center justify-between gap-4">
        <h3
          onClick={goToNewsPage}
          className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-cyan-300 hover:text-cyan-100 transition-colors cursor-pointer drop-shadow-[0_0_8px_rgba(0,210,255,0.35)]"
        >
          {displayTitle}
        </h3>

        {role === "GAME_MASTER" && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="px-2.5 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-[10px] font-bold uppercase text-cyan-200 transition-colors"
              onClick={() => router.push("/admin?tab=news")}
            >
              {lang === "th" ? "แก้ไข" : "Edit"}
            </button>
            <button
              className="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/40 text-[10px] font-bold uppercase text-rose-200 transition-colors"
              onClick={() => setShowDialog(true)}
            >
              {lang === "th" ? "ลบข่าว" : "Delete"}
            </button>
          </div>
        )}

        <div className="absolute bottom-0 left-5 w-28 h-[2px] bg-gradient-to-r from-cyan-400 via-cyan-300 to-transparent shadow-[0_0_8px_#00e5ff]" />
      </div>

      {/* Main Article Body */}
      <div className="p-5 flex flex-col gap-4 bg-gradient-to-b from-[#071122] to-[#040914]">
        <div
          onClick={goToNewsPage}
          className="relative w-full h-44 sm:h-52 border border-cyan-400/40 shadow-[0_0_20px_rgba(0,210,255,0.15)] overflow-hidden cursor-pointer group"
        >
          <Image
            src={bannerSrc}
            alt={displayTitle}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040914]/80 via-transparent to-transparent" />
        </div>

        <div
          onClick={goToNewsPage}
          className="text-xs sm:text-[13px] text-slate-300/95 leading-relaxed cursor-pointer space-y-2"
        >
          <p className="whitespace-pre-line">
            {shortVersion && displayBody.length > 420
              ? displayBody.slice(0, 420) + "..."
              : displayBody}
          </p>
        </div>

        <div className="pt-3 border-t border-[#122844] flex items-center justify-between gap-4 text-[11px]">
          <div className="text-slate-400" suppressHydrationWarning>
            <span>{lang === "th" ? "วันที่: " : "Date: "}</span>
            <span className="text-cyan-400 font-medium" suppressHydrationWarning>
              {formattedDate}
            </span>
            <span className="text-slate-500 ml-1">
              · {lang === "th" ? `โดย ${displayAuthor}` : `by ${displayAuthor}`}
            </span>
          </div>

          <button
            type="button"
            onClick={goToNewsPage}
            className="px-5 py-1.5 bg-gradient-to-b from-[#133863] via-[#0c2544] to-[#07162c] hover:from-[#1b4e87] hover:to-[#0d2b4f] border border-cyan-400/60 shadow-[0_0_12px_rgba(0,210,255,0.25)] text-[11px] font-bold uppercase tracking-widest text-cyan-100 hover:text-white transition-all"
          >
            {lang === "th" ? "อ่านเพิ่มเติม" : "MORE"}
          </button>
        </div>
      </div>
    </article>
  );
}
