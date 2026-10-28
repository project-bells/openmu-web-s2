"use client"

import React from 'react'
import { useLanguage } from '@/app/_context/LanguageContext'

export default function DeleteConfirmationDialog({onConfirm, onCancel}: {onConfirm : () => void, onCancel: () => void}) {
  const { lang } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="flex flex-col p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl max-w-sm w-full gap-5">
        <p className="text-slate-100 text-base font-medium text-center">
          {lang === "th"
            ? "คุณแน่ใจหรือไม่ว่าต้องการลบประกาศข่าวสารนี้?"
            : "Are you sure you want to delete this news article?"}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
            onClick={onCancel}
          >
            {lang === "th" ? "ยกเลิก" : "No, Cancel"}
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors"
            onClick={onConfirm}
          >
            {lang === "th" ? "ยืนยันการลบ" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

