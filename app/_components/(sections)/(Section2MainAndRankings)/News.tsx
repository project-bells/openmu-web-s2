import { prisma } from '@/lib/prisma'
import React from 'react'
import NewsCard from './(components)/NewsCard';
import NewsComplete from '@/app/_models/NewsComplete';
import { TranslatedText } from '@/app/_context/LanguageContext';
import Link from 'next/link';

export default async function News({ page }: { page: number }) {
  page = page >= 0 ? page : 0;

  const NEWS_PER_PAGE = 4;
  const SKIP = page * NEWS_PER_PAGE || 0;

  let news: NewsComplete[] = [];
  try {
    news = await prisma.openMuWeb_News.findMany({
      skip: SKIP,
      take: NEWS_PER_PAGE,
      orderBy: {
        creationDate: 'desc',
      },
    });
  } catch (e) {
    console.error("News fetch error:", e);
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        {news.map((n, i) => (
          <NewsCard news={n} key={n.id || i} index={i} shortVersion={true} />
        ))}
        {news.length === 0 && (
          <div className="p-8 bg-[#060d1b]/95 border border-[#1a385c] text-center text-slate-400 text-sm">
            <TranslatedText th="ยังไม่มีข่าวสารในขณะนี้" en="No announcements available" />
          </div>
        )}
      </div>

      {/* Classic MMORPG Numbered Pagination Bar */}
      <div className="py-3 px-4 bg-[#060d1b]/95 border border-[#1a385c] flex items-center justify-center gap-1.5 text-xs">
        <Link
          href={page > 0 ? `/?page=${page - 1}` : "/?page=0"}
          className="px-2.5 py-1 text-slate-400 hover:text-cyan-300 font-semibold transition-colors"
        >
          <TranslatedText th="< ก่อนหน้า" en="&lt; Prev" />
        </Link>
        {[0, 1, 2, 3].map((p) => {
          const active = page === p;
          return (
            <Link
              key={p}
              href={`/?page=${p}`}
              className={`w-7 h-7 flex items-center justify-center font-mono text-xs font-bold border transition-all ${
                active
                  ? "bg-[#113259] border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,210,255,0.3)]"
                  : "bg-[#040914] border-[#152c4a] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40"
              }`}
            >
              {p + 1}
            </Link>
          );
        })}
        <span className="px-1 text-slate-500">...</span>
        <Link
          href={`/?page=${page + 1}`}
          className="px-2.5 py-1 text-slate-400 hover:text-cyan-300 font-semibold transition-colors"
        >
          <TranslatedText th="ถัดไป >" en="Next &gt;" />
        </Link>
      </div>
    </div>
  );
}
