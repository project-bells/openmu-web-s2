"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { useLanguage } from '@/app/_context/LanguageContext'

export default function ReturnToHomeButton() {
    const router = useRouter();
    const { lang } = useLanguage();

    function onClickAction(){
        router.push("/")
    }

  return (
    <button
      onClick={onClickAction}
      className="self-start px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors whitespace-nowrap shrink-0"
    >
      {lang === "th" ? "← กลับสู่หน้าแรก" : "← Return to Home"}
    </button>
  )
}

