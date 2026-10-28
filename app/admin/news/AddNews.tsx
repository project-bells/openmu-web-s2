"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useLanguage } from '@/app/_context/LanguageContext';

export default function AddNews() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const router = useRouter();
    const { lang } = useLanguage();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if(role !== "GAME_MASTER"){
            router.push("/");
        }
    }, [router])

    async function addNews(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        const request = await fetch("/api/admin/news", {
            method: "POST",
            body: JSON.stringify({title, body})
        })
        const bodyy = await request.json();
        if(request.ok){
            toast.success(bodyy.message);
            setTitle("");
            setBody("");
        } else {
            toast.error(bodyy.message);
        }
    }

  return (
    <div className="flex flex-col w-full">
      <div className="border-b border-slate-800/80 pb-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-100 tracking-wide">
          {lang === "th" ? "ประกาศข่าวสารเซิร์ฟเวอร์" : "Publish Server News"}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {lang === "th" ? "สร้างประกาศอย่างเป็นทางการสำหรับเซิร์ฟเวอร์ Mu Origisns S6E3" : "Create an official announcement for the realm"}
        </p>
      </div>

      <form className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {lang === "th" ? "หัวข้อประกาศข่าวสาร" : "Announcement Title"}
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            value={title}
            type="text"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 invalid:border-red-500 transition-colors"
            placeholder={lang === "th" ? "กรอกหัวข้อข่าวสาร..." : "Enter announcement title"}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {lang === "th" ? "รายละเอียดเนื้อหาข่าวสาร" : "Article Content"}
          </label>
          <textarea
            onChange={(e) => setBody(e.target.value)}
            maxLength={3000}
            rows={7}
            value={body}
            placeholder={lang === "th" ? "เขียนรายละเอียดข่าวสารทั้งหมด..." : "Write the full announcement details..."}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 invalid:border-red-500 transition-colors"
          />
        </div>

        <button
          onClick={addNews}
          className="self-start px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
        >
          {lang === "th" ? "โพสต์ข่าวสาร" : "Add News"}
        </button>
      </form>
    </div>
  )
}

