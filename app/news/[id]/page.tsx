import NewsCard from '@/app/_components/(sections)/(Section2MainAndRankings)/(components)/NewsCard';
import ReturnToHomeButton from '@/app/_components/(sections)/(Section2MainAndRankings)/(components)/ReturnToHomeButton';
import NewsComplete from '@/app/_models/NewsComplete'
import { prisma } from '@/lib/prisma'
import React from 'react'
import { TranslatedText } from '@/app/_context/LanguageContext';

export default async function page({ params }: { params: { id: string } }) {
  let news: NewsComplete | null = null;
  try {
    if (params.id) {
      news = await prisma.openMuWeb_News.findFirst({
        where: {
          id: params.id,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <ReturnToHomeButton />
      {news ? (
        <NewsCard news={news} shortVersion={false} />
      ) : (
        <div className="bg-[#060d1b]/95 border border-[#1a385c] p-8 text-center">
          <p className="text-slate-300 text-base font-medium">
            <TranslatedText th="ไม่พบข้อมูลข่าวสารที่คุณต้องการ!" en="No News was found!" />
          </p>
        </div>
      )}
    </div>
  );
}
