"use client"

import React, { useEffect, useState } from "react";

interface CloudflareTurnstileProps {
  onVerifyChange?: (verified: boolean) => void;
  autoVerify?: boolean;
}

export default function CloudflareTurnstile({
  onVerifyChange,
  autoVerify = true,
}: CloudflareTurnstileProps) {
  const [status, setStatus] = useState<"idle" | "verifying" | "verified">(
    autoVerify ? "verifying" : "idle"
  );

  useEffect(() => {
    if (autoVerify) {
      const timer = setTimeout(() => {
        setStatus("verified");
        onVerifyChange?.(true);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [autoVerify, onVerifyChange]);

  const handleToggleVerify = () => {
    if (status === "verifying") return;
    if (status === "verified") {
      // Allow re-triggering verification if clicked
      setStatus("verifying");
      onVerifyChange?.(false);
      setTimeout(() => {
        setStatus("verified");
        onVerifyChange?.(true);
      }, 550);
    } else {
      setStatus("verifying");
      setTimeout(() => {
        setStatus("verified");
        onVerifyChange?.(true);
      }, 550);
    }
  };

  return (
    <div
      onClick={handleToggleVerify}
      role="checkbox"
      aria-checked={status === "verified"}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggleVerify();
        }
      }}
      className="w-full bg-[#222222] border border-white/75 px-3 py-2.5 flex items-center justify-between gap-2 select-none cursor-pointer shadow-inner transition-colors hover:border-white"
    >
      {/* Left: Status Icon + Text */}
      <div className="flex items-center gap-2.5 min-w-0">
        {status === "verified" && (
          <span className="w-6 h-6 rounded-full bg-[#23b257] flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(35,178,87,0.45)]">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}

        {status === "verifying" && (
          <span className="w-6 h-6 flex items-center justify-center shrink-0">
            <span className="w-5 h-5 rounded-full border-2 border-slate-500 border-t-[#f48120] animate-spin" />
          </span>
        )}

        {status === "idle" && (
          <span className="w-6 h-6 rounded bg-[#181818] border border-slate-400/80 flex items-center justify-center shrink-0" />
        )}

        <span className="text-[13px] font-normal text-white truncate">
          {status === "verified"
            ? "Success!"
            : status === "verifying"
            ? "Verifying..."
            : "Verify you are human"}
        </span>
      </div>

      {/* Right: Cloudflare Logo + Privacy • Help */}
      <div className="flex flex-col items-end shrink-0 leading-none">
        <div className="flex flex-col items-end">
          {/* Cloudflare Dual-Tone Cloud SVG */}
          <svg
            viewBox="0 0 64 28"
            className="w-11 h-5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main Orange Cloud */}
            <path
              d="M44.6 22.8H16.2C12.1 22.8 8.8 19.6 8.8 15.6C8.8 12.1 11.3 9.1 14.7 8.5C16.1 4.2 20.2 1.2 25 1.2C30.6 1.2 35.3 5.3 35.9 10.7C36.8 10.2 37.9 9.9 39.1 9.9C42.5 9.9 45.3 12.6 45.4 16C48 16.4 50 18.6 50 21.3C50 22.1 49.4 22.8 48.5 22.8H44.6Z"
              fill="#F48120"
            />
            {/* Secondary Amber Cloud */}
            <path
              d="M50.8 12.2C50.2 12.2 49.6 12.3 49.1 12.5C48.2 9.4 45.3 7.1 41.9 7.1C40.9 7.1 39.9 7.3 39 7.7C39.9 9.2 40.5 11 40.6 12.9C42.9 13.4 44.7 15.4 44.8 17.8H48.6C50.4 17.8 51.8 19.2 51.8 21C51.8 21.7 51.5 22.3 51.1 22.8H56.4C59.6 22.8 62.2 20.2 62.2 17.1C62.2 14.2 60 11.8 57.1 11.5C56.2 9.5 53.7 8.9 50.8 12.2Z"
              fill="#FAAD3F"
            />
          </svg>
          <span className="text-[7.5px] font-extrabold tracking-[0.14em] text-white uppercase -mt-0.5">
            CLOUDFLARE
          </span>
        </div>

        <div
          className="flex items-center gap-1 text-[8px] text-slate-200/90 mt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white"
          >
            Privacy
          </a>
          <span>•</span>
          <a
            href="https://challenges.cloudflare.com/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white"
          >
            Help
          </a>
        </div>
      </div>
    </div>
  );
}
