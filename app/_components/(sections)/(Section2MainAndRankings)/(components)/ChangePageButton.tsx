"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { useLanguage } from '@/app/_context/LanguageContext';

//if forward then go forward else go to prev page
export default function ChangePageButton({forward} : {forward: boolean}) {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "0");
    const router = useRouter();
    const { lang } = useLanguage();

    function onClickAction(){
        if(forward){
            router.push("/?page="+ (page+1));
        } else {
            router.push("/?page="+ (page-1));
        }
    }

  return (
    <button
      onClick={onClickAction}
      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors whitespace-nowrap shrink-0"
    >
      {forward
        ? lang === "th" ? "หน้าถัดไป →" : "Next Page →"
        : lang === "th" ? "← หน้าก่อนหน้า" : "← Previous Page"}
    </button>
  )
}

