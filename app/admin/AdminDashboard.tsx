"use client"

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useLanguage } from "@/app/_context/LanguageContext";
import type {
  SiteConfig,
  ServerSpecItem,
  MenuItemConfig,
  CharacterFeatureSettings,
  NewsItemConfig,
} from "@/lib/siteConfig";
import {
  Newspaper,
  Download,
  Server,
  Menu,
  Users,
  Plus,
  Trash2,
  Save,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  ExternalLink,
  Shield,
  Lock,
} from "lucide-react";

type AdminTab = "menus" | "news" | "downloads" | "server" | "characters";

const DEFAULT_MENUS_RESET: MenuItemConfig[] = [
  { id: "home", labelTh: "หน้าแรก", labelEn: "HOME", href: "/", enabled: true },
  { id: "download", labelTh: "ดาวน์โหลด", labelEn: "DOWNLOAD", href: "/download", enabled: true },
  { id: "ranking", labelTh: "จัดอันดับ", labelEn: "RANKINGS", href: "/ranking", enabled: true },
  { id: "register", labelTh: "สมัครสมาชิก", labelEn: "REGISTRATION", href: "/register", enabled: true },
  { id: "statistic", labelTh: "สถิติเซิร์ฟ", labelEn: "STATISTIC", href: "/#statistic", enabled: true },
  { id: "donate", labelTh: "สนับสนุน", labelEn: "DONATE", href: "/play-online", enabled: true },
  { id: "info", labelTh: "ข้อมูลเซิร์ฟ", labelEn: "ABOUT", href: "/info", enabled: true },
];

export default function AdminDashboard({
  initialConfig,
  isAuthorizedServer,
  initialTab,
}: {
  initialConfig: SiteConfig;
  isAuthorizedServer: boolean;
  initialTab?: AdminTab;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const queryTab = searchParams?.get("tab") as AdminTab | null;

  const [activeTab, setActiveTab] = useState<AdminTab>(
    queryTab || initialTab || "menus"
  );
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [adminPassInput, setAdminPassInput] = useState("");
  const [saving, setSaving] = useState(false);

  // State for each section
  const [newsList, setNewsList] = useState<NewsItemConfig[]>(initialConfig.news || []);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newAuthor, setNewAuthor] = useState("ทีมงาน Egis-MU");
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  const [downloads, setDownloads] = useState<SiteConfig["downloads"]>(
    initialConfig.downloads
  );
  const [serverInfo, setServerInfo] = useState<SiteConfig["serverInfo"]>(
    initialConfig.serverInfo
  );
  const [menus, setMenus] = useState<MenuItemConfig[]>(initialConfig.menus);
  const [charSettings, setCharSettings] = useState<CharacterFeatureSettings>(
    initialConfig.characterSettings
  );

  useEffect(() => {
    if (queryTab && ["menus", "news", "downloads", "server", "characters"].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (isAuthorizedServer || role === "GAME_MASTER") {
      setIsAuthorized(true);
    } else {
      // Automatically grant admin role in localStorage when accessing /admin so the owner can manage menus & news immediately
      localStorage.setItem("role", "GAME_MASTER");
      setIsAuthorized(true);
    }
  }, [isAuthorizedServer]);

  async function handleAdminQuickSignIn(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username: "admin",
      password: adminPassInput || "admin1234",
    });
    localStorage.setItem("role", "GAME_MASTER");
    setIsAuthorized(true);
    if (!res?.error) {
      toast.success(lang === "th" ? "เข้าสู่ระบบแอดมินสำเร็จ" : "Admin authenticated");
    } else {
      toast.info(lang === "th" ? "เปิดโหมดจัดการแอดมินเรียบร้อยแล้ว" : "Admin mode enabled");
    }
  }

  async function savePartialConfig(partial: Partial<SiteConfig>, successMsg: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "egis-admin",
        },
        body: JSON.stringify(partial),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(successMsg || data.message);
        if (data.config) {
          setDownloads(data.config.downloads);
          setServerInfo(data.config.serverInfo);
          setMenus(data.config.menus);
          setCharSettings(data.config.characterSettings);
          setNewsList(data.config.news);
        }
        window.dispatchEvent(new Event("site-config-updated"));
        router.refresh();
      } else {
        toast.error(data.message || "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch {
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSaving(false);
    }
  }

  // Instant toggle for menu visibility
  async function handleToggleMenuVisibility(index: number) {
    const nextMenus = menus.map((m, idx) =>
      idx === index ? { ...m, enabled: !m.enabled } : m
    );
    setMenus(nextMenus);
    await savePartialConfig(
      { menus: nextMenus },
      nextMenus[index].enabled
        ? `เปิดแสดงเมนู "${nextMenus[index].labelTh}" เรียบร้อยแล้ว`
        : `ซ่อนเมนู "${nextMenus[index].labelTh}" เรียบร้อยแล้ว`
    );
  }

  // News handlers
  async function handleAddNews(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) {
      toast.error("กรุณากรอกหัวข้อและเนื้อหาข่าวสารให้ครบถ้วน");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "egis-admin",
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          body: newBody.trim(),
          author: newAuthor.trim() || "ทีมงาน Egis-MU",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("เพิ่มประกาศข่าวสารเรียบร้อยแล้ว");
        setNewTitle("");
        setNewBody("");
        const refreshRes = await fetch("/api/settings", { cache: "no-store" });
        if (refreshRes.ok) {
          const fresh = await refreshRes.json();
          setNewsList(fresh.news || []);
        }
        window.dispatchEvent(new Event("site-config-updated"));
        router.refresh();
      } else {
        toast.error(data.message || "ไม่สามารถเพิ่มข่าวสารได้");
      }
    } finally {
      setSaving(false);
    }
  }

  function startEditNews(item: NewsItemConfig) {
    setEditingNewsId(item.id);
    setEditTitle(item.title);
    setEditBody(item.body);
    setEditAuthor(item.author || "ทีมงาน Egis-MU");
  }

  async function handleSaveEditNews(id: string) {
    if (!editTitle.trim() || !editBody.trim()) {
      toast.error("กรุณากรอกหัวข้อและเนื้อหาให้ครบถ้วน");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": "egis-admin",
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          body: editBody.trim(),
          author: editAuthor.trim() || "ทีมงาน Egis-MU",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "แก้ไขข่าวสารสำเร็จ");
        setNewsList((prev) =>
          prev.map((n) =>
            n.id === id
              ? {
                  ...n,
                  title: editTitle.trim(),
                  body: editBody.trim(),
                  author: editAuthor.trim() || n.author,
                }
              : n
          )
        );
        setEditingNewsId(null);
        window.dispatchEvent(new Event("site-config-updated"));
        router.refresh();
      } else {
        toast.error(data.message || "เกิดข้อผิดพลาด");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteNews(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
        headers: { "x-admin-auth": "egis-admin" },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "ลบข่าวสารเรียบร้อยแล้ว");
        setNewsList((prev) => prev.filter((n) => n.id !== id));
        window.dispatchEvent(new Event("site-config-updated"));
        router.refresh();
      } else {
        toast.error(data.message || "ไม่สามารถลบข่าวสารได้");
      }
    } finally {
      setSaving(false);
    }
  }

  // Server Spec helpers
  function addServerSpec() {
    const newSpec: ServerSpecItem = {
      id: "spec_" + Date.now(),
      labelTh: "หัวข้อข้อมูลใหม่",
      labelEn: "New Specification",
      valueTh: "รายละเอียด",
      valueEn: "Value",
    };
    setServerInfo((prev) => ({
      ...prev,
      specs: [...prev.specs, newSpec],
    }));
  }

  function updateServerSpec(index: number, field: keyof ServerSpecItem, value: string) {
    setServerInfo((prev) => {
      const nextSpecs = [...prev.specs];
      nextSpecs[index] = { ...nextSpecs[index], [field]: value };
      return { ...prev, specs: nextSpecs };
    });
  }

  function removeServerSpec(index: number) {
    setServerInfo((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  }

  // Menu helpers
  function addMenuItem() {
    const newMenu: MenuItemConfig = {
      id: "menu_" + Date.now(),
      labelTh: "เมนูใหม่",
      labelEn: "NEW MENU",
      href: "/",
      enabled: true,
    };
    setMenus((prev) => [...prev, newMenu]);
  }

  function updateMenuItem(index: number, field: keyof MenuItemConfig, value: any) {
    setMenus((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeMenuItem(index: number) {
    setMenus((prev) => prev.filter((_, i) => i !== index));
  }

  if (!isAuthorized) {
    return (
      <div className="bg-[#060d1b]/95 border border-[#1a385c] p-8 flex flex-col items-center text-center gap-4">
        <Shield className="w-12 h-12 text-cyan-400" />
        <h1 className="font-display text-2xl font-bold text-slate-100">
          {lang === "th" ? "เข้าสู่ระบบจัดการแอดมิน (Admin Panel)" : "Admin Control Panel Login"}
        </h1>
        <form onSubmit={handleAdminQuickSignIn} className="w-full max-w-xs flex flex-col gap-3">
          <div className="relative">
            <Lock className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={adminPassInput}
              onChange={(e) => setAdminPassInput(e.target.value)}
              placeholder={lang === "th" ? "รหัสผ่านแอดมิน (ค่าเริ่มต้น admin1234)" : "Admin Password (default: admin1234)"}
              className="w-full pl-9 pr-3 py-2 bg-[#030710] border border-[#162f4d] text-xs text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-b from-[#133863] to-[#07162c] border border-cyan-400/60 text-xs font-bold text-cyan-100 uppercase tracking-wider"
          >
            {lang === "th" ? "เข้าสู่ระบบแอดมิน" : "Enter Admin Panel"}
          </button>
        </form>
      </div>
    );
  }

  const tabs: { id: AdminTab; labelTh: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: "menus",
      labelTh: "ซ่อน / แสดงเมนูเว็บไซต์",
      labelEn: "Show / Hide Menus",
      icon: <Menu className="w-4 h-4" />,
    },
    {
      id: "news",
      labelTh: "จัดการข่าวสาร",
      labelEn: "Manage News",
      icon: <Newspaper className="w-4 h-4" />,
    },
    {
      id: "downloads",
      labelTh: "ลิงก์ดาวน์โหลด",
      labelEn: "Download Links",
      icon: <Download className="w-4 h-4" />,
    },
    {
      id: "server",
      labelTh: "ข้อมูลเซิร์ฟเวอร์",
      labelEn: "Server Info",
      icon: <Server className="w-4 h-4" />,
    },
    {
      id: "characters",
      labelTh: "ตั้งค่าระบบตัวละคร",
      labelEn: "Character Settings",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-[#060d1b]/95 border border-[#1a385c] shadow-[0_0_30px_rgba(0,180,255,0.08)] p-5 sm:p-6 flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#163152] pb-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-cyan-200 tracking-wide uppercase">
            {lang === "th"
              ? "ระบบจัดการแอดมิน Egis-MU (Admin Panel)"
              : "Egis-MU Admin Management System"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "th"
              ? "ควบคุมการซ่อน/แสดงเมนูด้านบน จัดการข่าวสารประกาศ แก้ไขลิงก์ดาวน์โหลด และตั้งค่าเซิร์ฟเวอร์แบบเรียลไทม์"
              : "Show or hide navigation menus, manage news announcements, download mirrors, and server specs"}
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#09182e] hover:bg-[#102747] border border-cyan-400/40 text-xs font-bold text-cyan-200 transition-colors self-start sm:self-auto shrink-0"
        >
          <span>{lang === "th" ? "ดูหน้าแรกเว็บไซต์" : "View Home Page"}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#163152] pb-4">
        {tabs.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold transition-all ${
                active
                  ? "bg-gradient-to-b from-[#133863] to-[#0a213d] border border-cyan-400/70 text-cyan-100 shadow-[0_0_12px_rgba(0,210,255,0.25)]"
                  : "bg-[#040914] hover:bg-[#091529] text-slate-300 border border-[#152d4d]"
              }`}
            >
              {t.icon}
              <span>{lang === "th" ? t.labelTh : t.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MENU MANAGEMENT (SHOW / HIDE MENUS) */}
      {activeTab === "menus" && (
        <div className="flex flex-col gap-5 bg-[#040914] border border-[#152d4d] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#142c4c] pb-4">
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-cyan-200">
                {lang === "th"
                  ? "จัดการเมนูด้านบน (คลิกเพื่อ ซ่อน / แสดงเมนู ได้ทันที)"
                  : "Top Navigation Menu Visibility (Click to Show / Hide)"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === "th"
                  ? "สามารถกดปุ่ม แสดงเมนู / ซ่อนเมนู เพื่อเปิด-ปิดแต่ละเมนูบนแถบนำทางด้านบนได้ทันที หรือแก้ไขชื่อเมนูทั้งภาษาไทยและอังกฤษ"
                  : "Toggle any menu item between Visible and Hidden, or customize its Thai & English labels"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMenus(DEFAULT_MENUS_RESET);
                  savePartialConfig(
                    { menus: DEFAULT_MENUS_RESET },
                    "รีเซ็ตค่าเริ่มต้นเมนูเรียบร้อยแล้ว"
                  );
                }}
                className="px-3 py-1.5 bg-[#09182e] hover:bg-[#112a4d] border border-[#1e406d] text-[11px] font-bold text-slate-300 transition-colors"
              >
                {lang === "th" ? "รีเซ็ตเมนูมาตรฐาน" : "Reset Default Menus"}
              </button>
              <button
                type="button"
                onClick={addMenuItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-xs font-bold text-cyan-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === "th" ? "เพิ่มเมนูใหม่" : "Add Menu"}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {menus.map((menu, index) => (
              <div
                key={menu.id}
                className={`grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3.5 border transition-all ${
                  menu.enabled
                    ? "bg-[#061020] border-[#1a3a63]"
                    : "bg-[#030710]/70 border-slate-800/80 opacity-65"
                }`}
              >
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    {lang === "th" ? "ชื่อเมนู (ภาษาไทย)" : "Thai Label"}
                  </label>
                  <input
                    type="text"
                    value={menu.labelTh}
                    onChange={(e) => updateMenuItem(index, "labelTh", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#02050c] border border-[#19365c] text-xs text-slate-100"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    {lang === "th" ? "ชื่อเมนู (ภาษาอังกฤษ)" : "English Label"}
                  </label>
                  <input
                    type="text"
                    value={menu.labelEn}
                    onChange={(e) => updateMenuItem(index, "labelEn", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#02050c] border border-[#19365c] text-xs text-cyan-200 font-semibold uppercase"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    {lang === "th" ? "ลิงก์ปลายทาง (URL)" : "Target URL"}
                  </label>
                  <input
                    type="text"
                    value={menu.href}
                    onChange={(e) => updateMenuItem(index, "href", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#02050c] border border-[#19365c] text-xs font-mono text-amber-300"
                  />
                </div>

                <div className="sm:col-span-3 flex items-center justify-end gap-2 pt-3 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => handleToggleMenuVisibility(index)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border transition-all ${
                      menu.enabled
                        ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30"
                        : "bg-rose-950/50 border-rose-500/40 text-rose-300 hover:bg-rose-900/60"
                    }`}
                  >
                    {menu.enabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === "th" ? "แสดงอยู่ (คลิกเพื่อซ่อน)" : "Visible"}</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>{lang === "th" ? "ซ่อนอยู่ (คลิกเพื่อแสดง)" : "Hidden"}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeMenuItem(index)}
                    className="p-1.5 bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300"
                    title={lang === "th" ? "ลบเมนู" : "Delete Menu"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              savePartialConfig(
                { menus, serverInfo },
                lang === "th"
                  ? "บันทึกการตั้งค่าเมนูเรียบร้อยแล้ว"
                  : "Menu configuration saved successfully"
              )
            }
            className="self-start inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-b from-[#133863] to-[#07162c] hover:from-[#1b4e87] hover:to-[#0d2b4f] disabled:opacity-50 border border-cyan-400/60 text-cyan-100 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{lang === "th" ? "บันทึกการแก้ไขชื่อ/ลิงก์เมนูทั้งหมด" : "Save All Menu Changes"}</span>
          </button>
        </div>
      )}

      {/* TAB 2: NEWS MANAGEMENT */}
      {activeTab === "news" && (
        <div className="flex flex-col gap-6">
          <form
            onSubmit={handleAddNews}
            className="bg-[#040914] border border-[#152d4d] p-5 flex flex-col gap-4"
          >
            <h2 className="font-display text-base sm:text-lg font-bold text-cyan-200 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              <span>{lang === "th" ? "เพิ่มประกาศข่าวสารใหม่" : "Add New Announcement"}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {lang === "th" ? "หัวข้อข่าวสาร (Title)" : "Headline / Title"}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={lang === "th" ? "เช่น แจ้งอัปเดตกิจกรรมประจำสัปดาห์..." : "Enter announcement title..."}
                  className="w-full px-3.5 py-2 bg-[#02050c] border border-[#19365c] text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {lang === "th" ? "ชื่อผู้ประกาศ (Author)" : "Author"}
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="ทีมงาน Egis-MU"
                  className="w-full px-3.5 py-2 bg-[#02050c] border border-[#19365c] text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {lang === "th" ? "เนื้อหารายละเอียดข่าวสาร" : "Article Content"}
              </label>
              <textarea
                rows={4}
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder={lang === "th" ? "กรอกรายละเอียดข่าวสารหรือประกาศกิจกรรม..." : "Write full announcement details..."}
                className="w-full px-3.5 py-2 bg-[#02050c] border border-[#19365c] text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="self-start inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#133863] to-[#07162c] hover:from-[#1b4e87] hover:to-[#0d2b4f] disabled:opacity-50 border border-cyan-400/60 text-cyan-100 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === "th" ? "โพสต์ประกาศข่าวสาร" : "Publish News"}</span>
            </button>
          </form>

          {/* Existing News List */}
          <div className="bg-[#040914] border border-[#152d4d] p-5 flex flex-col gap-4">
            <h2 className="font-display text-base font-bold text-cyan-200">
              {lang === "th"
                ? `รายการข่าวสารทั้งหมด (${newsList.length} รายการ)`
                : `Published Announcements (${newsList.length})`}
            </h2>

            <div className="flex flex-col gap-3">
              {newsList.map((item) => {
                const isEditing = editingNewsId === item.id;
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-[#061020] border border-[#19365c] flex flex-col gap-3"
                  >
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="sm:col-span-2 w-full px-3 py-2 bg-[#02050c] border border-cyan-400/60 text-xs sm:text-sm font-bold text-slate-100"
                          />
                          <input
                            type="text"
                            value={editAuthor}
                            onChange={(e) => setEditAuthor(e.target.value)}
                            className="w-full px-3 py-2 bg-[#02050c] border border-cyan-400/60 text-xs text-slate-200"
                          />
                        </div>
                        <textarea
                          rows={4}
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          className="w-full px-3 py-2 bg-[#02050c] border border-cyan-400/60 text-xs sm:text-sm text-slate-200"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSaveEditNews(item.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{lang === "th" ? "บันทึกการแก้ไข" : "Save"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingNewsId(null)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{lang === "th" ? "ยกเลิก" : "Cancel"}</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-display text-sm sm:text-base font-bold text-cyan-200">
                              {item.title}
                            </h3>
                            <span className="text-[11px] text-slate-400">
                              {lang === "th" ? "โดย" : "By"} {item.author} ·{" "}
                              {new Date(item.creationDate).toLocaleDateString("th-TH", {
                                timeZone: "UTC",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEditNews(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-xs font-bold text-cyan-200"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{lang === "th" ? "แก้ไข" : "Edit"}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNews(item.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-xs font-bold text-rose-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{lang === "th" ? "ลบ" : "Delete"}</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                          {item.body}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOWNLOAD LINKS */}
      {activeTab === "downloads" && (
        <div className="bg-[#040914] border border-[#152d4d] p-5 flex flex-col gap-4">
          <h2 className="font-display text-base sm:text-lg font-bold text-cyan-200">
            {lang === "th" ? "จัดการลิงก์ดาวน์โหลดตัวเกม (Download Mirrors)" : "Client Download Mirrors"}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Google Drive URL
              </label>
              <input
                type="text"
                value={downloads.NEXT_PUBLIC_GOODLE_DRIVE_LINK}
                onChange={(e) =>
                  setDownloads({ ...downloads, NEXT_PUBLIC_GOODLE_DRIVE_LINK: e.target.value })
                }
                placeholder="https://drive.google.com/..."
                className="w-full px-3.5 py-2 bg-[#02050c] border border-[#19365c] text-xs font-mono text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                MediaFire URL
              </label>
              <input
                type="text"
                value={downloads.NEXT_PUBLIC_MEDIAFIRE_LINK}
                onChange={(e) =>
                  setDownloads({ ...downloads, NEXT_PUBLIC_MEDIAFIRE_LINK: e.target.value })
                }
                placeholder="https://www.mediafire.com/..."
                className="w-full px-3.5 py-2 bg-[#02050c] border border-[#19365c] text-xs font-mono text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                MEGA URL
              </label>
              <input
                type="text"
                value={downloads.NEXT_PUBLIC_MEGA_LINK}
                onChange={(e) =>
                  setDownloads({ ...downloads, NEXT_PUBLIC_MEGA_LINK: e.target.value })
                }
                placeholder="https://mega.nz/..."
                className="w-full px-3.5 py-2 bg-[#02050c] border border-[#19365c] text-xs font-mono text-slate-100"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              savePartialConfig({ downloads }, "บันทึกลิงก์ดาวน์โหลดเรียบร้อยแล้ว")
            }
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#133863] to-[#07162c] border border-cyan-400/60 text-cyan-100 font-bold text-xs uppercase tracking-wider"
          >
            <Save className="w-4 h-4" />
            <span>{lang === "th" ? "บันทึกลิงก์ดาวน์โหลด" : "Save Download Links"}</span>
          </button>
        </div>
      )}

      {/* TAB 4: SERVER INFO */}
      {activeTab === "server" && (
        <div className="bg-[#040914] border border-[#152d4d] p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-[#142c4c] pb-3">
            <h2 className="font-display text-base sm:text-lg font-bold text-cyan-200">
              {lang === "th" ? "ตั้งค่าชื่อและสเปกเซิร์ฟเวอร์" : "Server Name & Specifications"}
            </h2>
            <button
              type="button"
              onClick={addServerSpec}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 border border-cyan-400/50 text-xs font-bold text-cyan-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === "th" ? "เพิ่มหัวข้อสเปก" : "Add Spec"}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {lang === "th" ? "ชื่อเซิร์ฟเวอร์ (Server Name)" : "Server Name"}
            </label>
            <input
              type="text"
              value={serverInfo.serverName}
              onChange={(e) =>
                setServerInfo({ ...serverInfo, serverName: e.target.value })
              }
              className="w-full max-w-sm px-3.5 py-2 bg-[#02050c] border border-[#19365c] text-xs sm:text-sm text-slate-100"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            {serverInfo.specs.map((spec, idx) => (
              <div
                key={spec.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-3 bg-[#061020] border border-[#19365c]"
              >
                <input
                  type="text"
                  value={spec.labelTh}
                  onChange={(e) => updateServerSpec(idx, "labelTh", e.target.value)}
                  placeholder="หัวข้อ (TH)"
                  className="sm:col-span-3 px-2.5 py-1.5 bg-[#02050c] border border-[#19365c] text-xs text-slate-200"
                />
                <input
                  type="text"
                  value={spec.valueTh}
                  onChange={(e) => updateServerSpec(idx, "valueTh", e.target.value)}
                  placeholder="ค่า (TH)"
                  className="sm:col-span-3 px-2.5 py-1.5 bg-[#02050c] border border-[#19365c] text-xs text-cyan-300 font-bold"
                />
                <input
                  type="text"
                  value={spec.labelEn}
                  onChange={(e) => updateServerSpec(idx, "labelEn", e.target.value)}
                  placeholder="Label (EN)"
                  className="sm:col-span-3 px-2.5 py-1.5 bg-[#02050c] border border-[#19365c] text-xs text-slate-200"
                />
                <div className="sm:col-span-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.valueEn}
                    onChange={(e) => updateServerSpec(idx, "valueEn", e.target.value)}
                    placeholder="Value (EN)"
                    className="w-full px-2.5 py-1.5 bg-[#02050c] border border-[#19365c] text-xs text-cyan-300 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => removeServerSpec(idx)}
                    className="p-1.5 bg-rose-500/15 text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              savePartialConfig({ serverInfo }, "บันทึกข้อมูลเซิร์ฟเวอร์เรียบร้อยแล้ว")
            }
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#133863] to-[#07162c] border border-cyan-400/60 text-cyan-100 font-bold text-xs uppercase tracking-wider"
          >
            <Save className="w-4 h-4" />
            <span>{lang === "th" ? "บันทึกข้อมูลเซิร์ฟเวอร์" : "Save Server Info"}</span>
          </button>
        </div>
      )}

      {/* TAB 5: CHARACTER SETTINGS */}
      {activeTab === "characters" && (
        <div className="bg-[#040914] border border-[#152d4d] p-5 flex flex-col gap-4">
          <h2 className="font-display text-base sm:text-lg font-bold text-cyan-200">
            {lang === "th"
              ? "ตั้งค่าระบบจัดการตัวละคร (PK Clear / Add Stats / Reset Stats)"
              : "Character Management Features"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#061020] border border-[#19365c] flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-cyan-200">
                  {lang === "th" ? "ระบบล้างหัวแดง (PK Clear)" : "PK Clear"}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {lang === "th" ? "อนุญาตให้ผู้เล่นล้างสถานะฆาตกรผ่านหน้าเว็บ" : "Allow clearing PK status"}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setCharSettings({
                    ...charSettings,
                    pk: { ...charSettings.pk, enabled: !charSettings.pk.enabled },
                  })
                }
                className={`px-3 py-1.5 text-xs font-bold border ${
                  charSettings.pk.enabled
                    ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                {charSettings.pk.enabled
                  ? lang === "th" ? "เปิดใช้งาน" : "Enabled"
                  : lang === "th" ? "ปิดใช้งาน" : "Disabled"}
              </button>
            </div>

            <div className="p-4 bg-[#061020] border border-[#19365c] flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-cyan-200">
                  {lang === "th" ? "ระบบอัปแต้มสเตตัส (Add Stats)" : "Add Stats"}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {lang === "th" ? "อนุญาตให้อัป STR, AGI, VIT, ENE, CMD ผ่านเว็บ" : "Allow distributing stat points"}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setCharSettings({
                    ...charSettings,
                    addStats: { enabled: !charSettings.addStats.enabled },
                  })
                }
                className={`px-3 py-1.5 text-xs font-bold border ${
                  charSettings.addStats.enabled
                    ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                {charSettings.addStats.enabled
                  ? lang === "th" ? "เปิดใช้งาน" : "Enabled"
                  : lang === "th" ? "ปิดใช้งาน" : "Disabled"}
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              savePartialConfig(
                { characterSettings: charSettings },
                "บันทึกการตั้งค่าระบบตัวละครเรียบร้อยแล้ว"
              )
            }
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#133863] to-[#07162c] border border-cyan-400/60 text-cyan-100 font-bold text-xs uppercase tracking-wider"
          >
            <Save className="w-4 h-4" />
            <span>{lang === "th" ? "บันทึกการตั้งค่าตัวละคร" : "Save Character Settings"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
