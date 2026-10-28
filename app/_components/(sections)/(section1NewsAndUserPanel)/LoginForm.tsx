"use client"

import React, { useState, useCallback } from "react"
import { signIn } from "next-auth/react"
import { toast } from "react-toastify"
import Link from "next/link"
import { useLanguage } from "@/app/_context/LanguageContext"
import CloudflareTurnstile from "@/app/_components/CloudflareTurnstile"

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [cfVerified, setCfVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  const handleVerifyChange = useCallback((verified: boolean) => {
    setCfVerified(verified);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error(
        lang === "th"
          ? "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"
          : "Please enter username and password"
      );
      return;
    }

    if (!cfVerified) {
      toast.error(
        lang === "th"
          ? "กรุณายืนยันตัวตนด้วย Cloudflare ก่อนเข้าสู่ระบบ"
          : "Please complete the Cloudflare security check"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (res?.error) {
        toast.error(
          lang === "th"
            ? "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
            : "Invalid username or password"
        );
      } else {
        if (rememberMe) {
          localStorage.setItem("remembered_username", username);
        } else {
          localStorage.removeItem("remembered_username");
        }
        toast.success(
          lang === "th"
            ? "เข้าสู่ระบบสำเร็จ ยินดีต้อนรับสู่ Egis-MU!"
            : "Logged in to Egis-MU successfully!"
        );
        localStorage.setItem(
          "role",
          username.toLowerCase() === "admin" ? "GAME_MASTER" : "USER"
        );
        window.dispatchEvent(new Event("site-config-updated"));
        window.location.reload();
      }
    } catch (e) {
      toast.error(
        lang === "th"
          ? "เกิดข้อผิดพลาดในการเชื่อมต่อ"
          : "Login error, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        {/* Username Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-username"
            className="text-xs font-bold text-slate-200 tracking-wide"
          >
            {lang === "th" ? "ชื่อผู้ใช้ (Username)" : "Username"}
          </label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={lang === "th" ? "กรอกชื่อบัญชีผู้ใช้" : "Enter username"}
            className="w-full px-3 py-2.5 rounded-md bg-[#0a0d14] border border-slate-600/80 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,210,255,0.2)] transition-all"
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-password"
            className="text-xs font-bold text-slate-200 tracking-wide"
          >
            {lang === "th" ? "รหัสผ่าน (Password)" : "Password"}
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={lang === "th" ? "กรอกรหัสผ่าน" : "Enter password"}
            className="w-full px-3 py-2.5 rounded-md bg-[#0a0d14] border border-slate-600/80 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,210,255,0.2)] transition-all"
            required
          />
        </div>

        {/* Remember me Checkbox */}
        <label className="inline-flex items-center gap-2 cursor-pointer select-none pt-0.5">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded bg-[#1f2430] border border-slate-500 text-cyan-500 focus:ring-0 focus:ring-offset-0 accent-cyan-500 cursor-pointer"
          />
          <span className="text-xs font-bold text-slate-300">
            {lang === "th" ? "จดจำฉันไว้ในระบบ (Remember me)" : "Remember me"}
          </span>
        </label>

        {/* Cloudflare Turnstile Widget */}
        <div className="pt-0.5">
          <CloudflareTurnstile onVerifyChange={handleVerifyChange} />
        </div>

        {/* Submit Button */}
        <div className="pt-1 flex justify-center">
          <button
            type="submit"
            disabled={loading || !cfVerified}
            className="w-full py-2.5 px-4 rounded-md bg-gradient-to-b from-[#133863] via-[#0c2544] to-[#07162c] hover:from-[#1a4b82] hover:to-[#0c2544] border border-cyan-400/60 shadow-[0_0_14px_rgba(0,210,255,0.25)] text-xs font-bold uppercase tracking-[0.16em] text-cyan-100 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? lang === "th"
                ? "กำลังเข้าสู่ระบบ..."
                : "SIGNING IN..."
              : lang === "th"
              ? "เข้าสู่ระบบ"
              : "SIGN IN"}
          </button>
        </div>
      </form>

      <div className="pt-2 border-t border-[#132842]/80 flex flex-col items-center gap-1 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Link href="/account" className="hover:text-cyan-300 transition-colors">
            {lang === "th" ? "ลืมรหัสผ่าน?" : "Lost Password?"}
          </Link>
          <span className="text-slate-600">|</span>
          <Link
            href="/register"
            className="text-cyan-400 hover:text-cyan-200 font-semibold transition-colors"
          >
            {lang === "th" ? "สมัครสมาชิกใหม่" : "Registration"}
          </Link>
        </div>
        <Link
          href="/info"
          className="text-[10px] text-cyan-500/80 hover:text-cyan-300 transition-colors"
        >
          {lang === "th"
            ? "คู่มือการเชื่อมต่อ & ข้อมูลเซิร์ฟเวอร์"
            : "Server Connection Guide & Info"}
        </Link>
      </div>
    </div>
  );
}
