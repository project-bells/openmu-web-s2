"use client"

import { getSession } from "next-auth/react";
import { useState } from "react"
import { toast } from "react-toastify"
import { useLanguage } from "@/app/_context/LanguageContext";

export default function Account() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");
    const [loginName, setLoginName] = useState("")
    const { lang } = useLanguage();

    //set lognName
    async function setName(){
        const session = await getSession();
        setLoginName(session?.user.username!)
    }

    async function changePassword(e: React.MouseEvent<HTMLElement>){
        e.preventDefault()
        await setName();
        const result = await fetch("/api/account/changepassword", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: loginName,
                oldPassword: oldPassword,
                newPassword: newPassword,
                repeatNewPassword: repeatNewPassword
            })
        })
        const body = await result.json()
        if(result.ok){
            toast.success(body.message)
            setOldPassword("");
            setNewPassword("");
            setRepeatNewPassword("");
        } else {
            toast.error(body.message)
        }
    }

  return (
    <div className="flex flex-col w-full">
      <div className="border-b border-slate-800/80 pb-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-100 tracking-wide">
          {lang === "th" ? "ตั้งค่าความปลอดภัยบัญชี" : "Account Security"}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {lang === "th" ? "เปลี่ยนรหัสผ่านบัญชีผู้ใช้งานของคุณ" : "Update your account password"}
        </p>
      </div>

      <form className="max-w-md w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {lang === "th" ? "รหัสผ่านปัจจุบัน" : "Current Password"}
          </label>
          <input
            onChange={(e) => setOldPassword(e.target.value)}
            value={oldPassword}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 invalid:border-red-500 transition-colors"
            type="password"
            name="oldPassword"
            id="oldPassword"
            placeholder={lang === "th" ? "กรอกรหัสผ่านปัจจุบัน" : "Enter current password"}
            minLength={8}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {lang === "th" ? "รหัสผ่านใหม่" : "New Password"}
          </label>
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 invalid:border-red-500 transition-colors"
            type="password"
            name="newPassword"
            id="newPassword"
            placeholder={lang === "th" ? "กรอกรหัสผ่านใหม่" : "Enter new password"}
            minLength={8}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {lang === "th" ? "ยืนยันรหัสผ่านใหม่" : "Repeat New Password"}
          </label>
          <input
            onChange={(e) => setRepeatNewPassword(e.target.value)}
            value={repeatNewPassword}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 invalid:border-red-500 transition-colors"
            type="password"
            name="repeatNewPassword"
            id="repeatNewPassword"
            placeholder={lang === "th" ? "กรอกรหัสผ่านใหม่อีกครั้ง" : "Repeat new password"}
            minLength={8}
          />
        </div>

        <button
          onClick={(e) => changePassword(e)}
          className="mt-2 w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
        >
          {lang === "th" ? "บันทึกรหัสผ่านใหม่" : "Change Password"}
        </button>
      </form>
    </div>
  )
}

