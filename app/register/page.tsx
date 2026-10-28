"use client"

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify"
import { useLanguage } from "@/app/_context/LanguageContext";
import { Shield, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      toast.error(lang === "th" ? "รหัสผ่านทั้งสองช่องไม่ตรงกัน" : "The passwords must coincide");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          LoginName: username,
          EMail: email,
          Password: password,
          RepeatPassword: repeatPassword,
        }),
      }).then((resp) => resp.json());

      if (response.user === null) {
        toast.error(response.message);
      } else {
        toast.success(
          lang === "th" ? "สมัครสมาชิก Egis-MU S2 สำเร็จ! สามารถเข้าเล่นได้ทันที" : response.message
        );
        setEmail("");
        setUsername("");
        setPassword("");
        setRepeatPassword("");
      }
    } catch (err) {
      toast.error(lang === "th" ? "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่" : "Failed to register account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_30px_rgba(0,180,255,0.08)] p-5 sm:p-6 flex flex-col w-full">
      <div className="border-b border-[#163152] pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-cyan-200 tracking-wider uppercase">
            {lang === "th" ? "สมัครสมาชิก Egis-MU S2" : "Egis-MU S2 Account Registration"}
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 font-semibold text-xs">
            <Shield className="w-3.5 h-3.5 text-cyan-300" />
            <span>{lang === "th" ? "Season 2 · ไร้รีเซ็ต" : "Season 2 · No-Reset"}</span>
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {lang === "th"
            ? "สร้างบัญชีใหม่เพื่อเข้าสู่โลกแห่ง Egis-MU Season 2 คลาสสิกแท้ ไร้ระบบรีเซ็ต (No-Reset)"
            : "Create your Egis-MU Season 2 account to enter the authentic No-Reset realm"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <form
          onSubmit={onSubmit}
          className="w-full bg-[#040914] border border-[#152d4d] p-5 flex flex-col gap-4"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-200/90 mb-1.5">
              {lang === "th" ? "ชื่อบัญชีผู้ใช้ (4–10 ตัวอักษร)" : "USERNAME (4–10 characters)"}
            </label>
            <input
              type="text"
              placeholder={lang === "th" ? "กรอกชื่อผู้ใช้สำหรับเข้าเกม" : "Enter username"}
              minLength={4}
              maxLength={10}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="w-full px-3.5 py-2.5 bg-[#02050c] border border-[#19365c] text-xs text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-200/90 mb-1.5">
              {lang === "th" ? "อีเมล" : "EMAIL ADDRESS"}
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              minLength={5}
              maxLength={30}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-3.5 py-2.5 bg-[#02050c] border border-[#19365c] text-xs text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-200/90 mb-1.5">
              {lang === "th" ? "รหัสผ่าน (8–20 ตัวอักษร)" : "PASSWORD (8–20 characters)"}
            </label>
            <input
              type="password"
              placeholder={lang === "th" ? "กำหนดรหัสผ่านเข้าเกม" : "Enter password"}
              minLength={8}
              maxLength={20}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-3.5 py-2.5 bg-[#02050c] border border-[#19365c] text-xs text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-200/90 mb-1.5">
              {lang === "th" ? "ยืนยันรหัสผ่านอีกครั้ง" : "REPEAT PASSWORD"}
            </label>
            <input
              type="password"
              placeholder={lang === "th" ? "กรอกรหัสผ่านใหม่อีกครั้ง" : "Confirm password"}
              minLength={8}
              maxLength={20}
              onChange={(e) => setRepeatPassword(e.target.value)}
              value={repeatPassword}
              className="w-full px-3.5 py-2.5 bg-[#02050c] border border-[#19365c] text-xs text-cyan-50 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              required
            />
          </div>

          <label htmlFor="terms" className="flex items-center gap-2.5 text-xs text-slate-300 mt-1 cursor-pointer">
            <input
              onChange={(e) => setIsDisabled(!e.target.checked)}
              type="checkbox"
              id="terms"
              name="terms"
              checked={!isDisabled}
              className="w-4 h-4 border-[#19365c] bg-[#02050c] text-cyan-400 focus:ring-cyan-400"
            />
            <span>
              {lang === "th" ? "ฉันยอมรับ " : "I accept the "}
              <Link href="/terms-and-conditions" className="text-cyan-400 hover:underline">
                {lang === "th" ? "ข้อกำหนดและเงื่อนไขเซิร์ฟเวอร์ Egis-MU" : "Terms and Conditions"}
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={isDisabled || loading}
            className="mt-2 w-full py-2.5 px-4 bg-gradient-to-b from-[#133863] via-[#0c2544] to-[#07162c] hover:from-[#1b4e87] hover:to-[#0d2b4f] disabled:opacity-40 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,210,255,0.25)] text-cyan-100 font-bold text-xs uppercase tracking-widest transition-all"
          >
            {loading
              ? lang === "th"
                ? "กำลังสร้างบัญชี..."
                : "REGISTERING..."
              : lang === "th"
              ? "ยืนยันการสมัครสมาชิก"
              : "REGISTRATION"}
          </button>
        </form>

        <div className="flex flex-col gap-3 p-4 bg-[#040914] border border-[#152d4d] text-xs text-slate-300">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>{lang === "th" ? "สิทธิประโยชน์สำหรับสมาชิก Egis-MU" : "Egis-MU S2 Highlights"}</span>
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{lang === "th" ? "เข้าเล่นได้ทันทีหลังจากสมัคร ไม่ต้องรอยืนยันอีเมล" : "Instant access to the game realm right after registration"}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{lang === "th" ? "ระบบ Season 2 คลาสสิกแท้ ไร้รีเซ็ต เลเวลตัน 400" : "Authentic classic Season 2 progression capped at level 400"}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{lang === "th" ? "จัดการสเตตัสและล้างหัวแดง (PK) ผ่านหน้าเว็บได้ตลอด 24 ชม." : "Manage attribute points and clear PK status via Account Panel"}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
