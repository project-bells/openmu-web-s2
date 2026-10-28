"use client"

import { useLanguage } from "@/app/_context/LanguageContext";
import { Shield } from "lucide-react";

export default function TermsAndConditions() {
  const { lang } = useLanguage();

  return (
    <div className="bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_30px_rgba(0,180,255,0.08)] p-5 sm:p-6 flex flex-col w-full gap-6">
      <div className="border-b border-[#163152] pb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h1 className="font-display text-xl sm:text-2xl font-bold text-cyan-200 tracking-wider uppercase">
            {lang === "th" ? "ข้อกำหนดและเงื่อนไขการใช้งาน Egis-MU S2" : "Egis-MU S2 Terms and Conditions"}
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {lang === "th"
            ? "ข้อตกลงผู้ใช้งาน นโยบายความเป็นส่วนตัว และกฎระเบียบของเซิร์ฟเวอร์ Egis-MU Season 2"
            : "User agreement, privacy policy, and server rules for Egis-MU Season 2"}
        </p>
      </div>

      {lang === "th" ? (
        <div className="bg-[#040914] border border-[#152d4d] p-5 sm:p-6 flex flex-col gap-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            ยินดีต้อนรับสู่ <strong>Egis-MU S2</strong>! ข้อกำหนดและเงื่อนไขฉบับนี้ระบุถึงกฎระเบียบและแนวทางในการใช้งานเว็บไซต์และเซิร์ฟเวอร์ของ Egis-MU S2
          </p>
          <p>
            การเข้าใช้งานเว็บไซต์นี้ถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขทั้งหมด หากคุณไม่ตกลงที่จะปฏิบัติตามข้อกำหนดที่ระบุไว้ในหน้านี้ กรุณางดใช้งานเว็บไซต์ Egis-MU S2
          </p>
          <h2 className="font-display text-base font-bold text-cyan-300 mt-2">การใช้งานคุกกี้</h2>
          <p>
            เว็บไซต์ของเรามีการใช้งานคุกกี้เพื่อจดจำสถานะการเข้าสู่ระบบและการตั้งค่าภาษาของผู้ใช้งาน การเข้าใช้งาน Egis-MU S2 ถือว่าคุณยินยอมให้ใช้คุกกี้ตามนโยบายความเป็นส่วนตัวของเรา
          </p>
          <h2 className="font-display text-base font-bold text-cyan-300 mt-2">สิทธิ์การใช้งานและกฎระเบียบเซิร์ฟเวอร์</h2>
          <p>
            คุณสามารถเข้าใช้งานเว็บไซต์และบริการของ Egis-MU S2 เพื่อความบันเทิงส่วนบุคคลภายใต้ข้อกำหนดดังต่อไปนี้ โดยห้ามกระทำการใดๆ ดังนี้:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-slate-300">
            <li>นำข้อมูลหรือเนื้อหาจาก Egis-MU S2 ไปเผยแพร่ซ้ำโดยไม่ได้รับอนุญาต</li>
            <li>ใช้โปรแกรมช่วยเล่นที่ส่งผลกระทบต่อความสมดุล การดัดแปลงแพ็กเก็ต หรือแสวงหาผลประโยชน์จากช่องโหว่ของระบบ</li>
            <li>คัดลอก ดัดแปลง หรือทำซ้ำส่วนหนึ่งส่วนใดของเว็บไซต์</li>
            <li>ก่อกวนหรือสร้างความเสียหายต่อผู้เล่นคนอื่นและระบบเซิร์ฟเวอร์</li>
          </ul>
        </div>
      ) : (
        <div className="bg-[#040914] border border-[#152d4d] p-5 sm:p-6 flex flex-col gap-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Welcome to <strong>Egis-MU S2</strong>! These terms and conditions outline the rules and regulations for the use of Egis-MU S2&apos;s Website and Server.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Egis-MU S2 if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <h2 className="font-display text-base font-bold text-cyan-300 mt-2">Cookies</h2>
          <p>
            We employ the use of cookies. By accessing Egis-MU S2, you agreed to use cookies in agreement with the Privacy Policy. Most interactive websites use cookies to let us retrieve the user&apos;s details for each visit.
          </p>
          <h2 className="font-display text-base font-bold text-cyan-300 mt-2">License &amp; Server Code of Conduct</h2>
          <p>
            Unless otherwise stated, Egis-MU S2 and/or its licensors own the intellectual property rights for all custom web material on Egis-MU S2. You may access this from Egis-MU S2 for your personal gaming entertainment subjected to restrictions set in these terms:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-slate-300">
            <li>Do not republish material from Egis-MU S2 without permission</li>
            <li>Do not use illegal third-party hacks, packet injectors, or exploit bugs</li>
            <li>Do not reproduce, duplicate or copy material from Egis-MU S2</li>
            <li>Respect fair play and community standards</li>
          </ul>
        </div>
      )}
    </div>
  );
}
