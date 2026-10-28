import fs from "fs";
import path from "path";

export interface MenuItemConfig {
  id: string;
  labelTh: string;
  labelEn: string;
  href: string;
  enabled: boolean;
}

export interface BannerSlideConfig {
  id: string;
  imageUrl: string;
  badgeTh: string;
  badgeEn: string;
  titleTh: string;
  titleEn: string;
  subtitleTh: string;
  subtitleEn: string;
}

export interface ServerSpecItem {
  id: string;
  labelTh: string;
  labelEn: string;
  valueTh: string;
  valueEn: string;
}

export interface CharacterFeatureSettings {
  pk: {
    enabled: boolean;
    zenCost: number;
  };
  reset: {
    enabled: boolean;
    zenCost: number;
    requiredLevel: number;
    maxReset: number;
  };
  relevel: {
    enabled: boolean;
    zenCost: number;
    targetLevel: number;
  };
  addStats: {
    enabled: boolean;
  };
  resetStats: {
    enabled: boolean;
    zenCost: number;
  };
}

export interface NewsItemConfig {
  id: string;
  title: string;
  author: string;
  body: string;
  creationDate: string;
  updatedAt?: string;
}

export type StoredNewsItem = NewsItemConfig;

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin1234";
}

export interface SiteConfig {
  downloads: {
    NEXT_PUBLIC_DISCORD_LINK: string;
    NEXT_PUBLIC_GOODLE_DRIVE_LINK: string;
    NEXT_PUBLIC_MEDIAFIRE_LINK: string;
    NEXT_PUBLIC_MEGA_LINK: string;
  };
  menus: MenuItemConfig[];
  banners: BannerSlideConfig[];
  serverInfo: {
    serverName: string;
    taglineTh: string;
    taglineEn: string;
    heroDescriptionTh: string;
    heroDescriptionEn: string;
    facebookUrl: string;
    telegramUrl: string;
    playOnlineEnabled: boolean;
    specs: ServerSpecItem[];
    play2WinTitleTh: string;
    play2WinTitleEn: string;
    play2WinBodyTh: string;
    play2WinBodyEn: string;
    introTitleTh: string;
    introTitleEn: string;
    introBodyTh: string;
    introBodyEn: string;
  };
  characterSettings: CharacterFeatureSettings;
  news: NewsItemConfig[];
}

const defaultMenus: MenuItemConfig[] = [
  { id: "home", labelTh: "หน้าแรก", labelEn: "HOME", href: "/", enabled: true },
  { id: "download", labelTh: "ดาวน์โหลด", labelEn: "DOWNLOAD", href: "/download", enabled: true },
  { id: "ranking", labelTh: "จัดอันดับ", labelEn: "RANKINGS", href: "/ranking", enabled: true },
  { id: "register", labelTh: "สมัครสมาชิก", labelEn: "REGISTRATION", href: "/register", enabled: true },
  { id: "statistic", labelTh: "สถิติเซิร์ฟ", labelEn: "STATISTIC", href: "/#statistic", enabled: true },
  { id: "donate", labelTh: "สนับสนุน", labelEn: "DONATE", href: "/play-online", enabled: true },
  { id: "info", labelTh: "ข้อมูลเซิร์ฟ", labelEn: "ABOUT", href: "/info", enabled: true },
];

const defaultBanners: BannerSlideConfig[] = [
  {
    id: "slide-1",
    imageUrl: "/img/slider-img-1.jpg",
    badgeTh: "EGIS-MU SEASON 2 · NO-RESET",
    badgeEn: "EGIS-MU SEASON 2 · NO-RESET",
    titleTh: "เปิดตำนาน Egis-MU Season 2 ไร้ระบบรีเซ็ต",
    titleEn: "Egis-MU Season 2 Classic No-Reset",
    subtitleTh: "เลเวลตัน 400 · EXP x50 · ดรอปสมดุล · สงคราม Castle Siege เต็มรูปแบบ",
    subtitleEn: "Max Level 400 · EXP x50 · Balanced Drop · Authentic Castle Siege",
  },
  {
    id: "slide-2",
    imageUrl: "/img/castle_siege_banner_bg.jpg",
    badgeTh: "CASTLE SIEGE WARFARE",
    badgeEn: "CASTLE SIEGE WARFARE",
    titleTh: "ศึกชิงปราสาท Valley of Loren ทุกวันอาทิตย์",
    titleEn: "Battle for Valley of Loren Every Sunday",
    subtitleTh: "รวมพลังพันธมิตรกิลด์ ชิงบัลลังก์ราชาแห่ง Egis-MU และสิทธิ์ครอบครอง Land of Trials",
    subtitleEn: "Unite your guild alliance and claim the throne of Egis-MU",
  },
  {
    id: "slide-3",
    imageUrl: "/img/slider-img-2.jpg",
    badgeTh: "CLASSIC 5 CLASSES BALANCE",
    badgeEn: "CLASSIC 5 CLASSES BALANCE",
    titleTh: "สมดุล 5 อาชีพคลาสสิก ไม่มีไอเทมโกงสเตตัส",
    titleEn: "Pure Season 2 Balance · Play-to-Win",
    subtitleTh: "DK, DW, ELF, MG และ DL ปรับสมดุลทั้งสายเก็บเลเวล ล่าบอส Kundun และ PvP",
    subtitleEn: "Balanced DK, DW, ELF, MG & DL progression with authentic boss hunting",
  },
];

const defaultSpecs: ServerSpecItem[] = [
  {
    id: "version",
    labelTh: "เวอร์ชันเซิร์ฟเวอร์",
    labelEn: "Server Version",
    valueTh: "Season 2 (Classic 1.02)",
    valueEn: "Season 2 (Classic 1.02)",
  },
  {
    id: "server_type",
    labelTh: "รูปแบบการเล่น",
    labelEn: "Server Mode",
    valueTh: "No-Reset (เลเวลตัน 400 ไร้รีเซ็ต)",
    valueEn: "No-Reset (Max Level 400)",
  },
  {
    id: "exp",
    labelTh: "อัตราคูณค่าประสบการณ์ (EXP)",
    labelEn: "Experience Rate",
    valueTh: "x50 สมดุลระยะยาว",
    valueEn: "x50 Balanced Dynamic",
  },
  {
    id: "drop_exc",
    labelTh: "อัตราดรอปไอเทมยอดเยี่ยม (Excellent)",
    labelEn: "Drop Rate Excellent",
    valueTh: "35%",
    valueEn: "35%",
  },
  {
    id: "drop_zen",
    labelTh: "อัตราดรอปเงิน (Zen)",
    labelEn: "Drop Rate Zen",
    valueTh: "50%",
    valueEn: "50%",
  },
  {
    id: "party_exp",
    labelTh: "โบนัส EXP ปาร์ตี้",
    labelEn: "Party Bonus Exp",
    valueTh: "20% · 30% · 45%",
    valueEn: "20% · 30% · 45%",
  },
  {
    id: "elf_buff",
    labelTh: "บัฟทหารเอลฟ์ (Elf Soldier)",
    labelEn: "Elf Soldier Buff",
    valueTh: "ถึงเลเวล 220",
    valueEn: "Up to Level 220",
  },
  {
    id: "conn_limit",
    labelTh: "จำกัดการเชื่อมต่อ",
    labelEn: "Connection Limit",
    valueTh: "สูงสุด 3 จอ ต่อ IP/HWID",
    valueEn: "Max 3 Accounts per IP/HWID",
  },
  {
    id: "classes",
    labelTh: "สายอาชีพที่เปิดให้เล่น",
    labelEn: "Available Classes",
    valueTh: "DK · DW · ELF · MG · DL (5 คลาส)",
    valueEn: "DK · DW · ELF · MG · DL (5 Classes)",
  },
  {
    id: "events",
    labelTh: "กิจกรรมหลักภายในเกม",
    labelEn: "In-Game Events",
    valueTh: "Blood Castle · Devil Square · Chaos Castle · Castle Siege",
    valueEn: "Blood Castle · Devil Square · Chaos Castle · Castle Siege",
  },
];

const defaultNews: StoredNewsItem[] = [
  {
    id: "default-1",
    title: "ประกาศข่าวดีวันนี้ · เปิดตำนาน EGIS-MU SEASON 2 (ไร้ระบบรีเซ็ต)",
    author: "ทีมงาน Egis-MU",
    body: "สงครามแห่งอาณาจักรได้ปะทุขึ้นอีกครั้ง เหล่าอสูรแห่งความมืดและกองทัพของ Kundun กำลังรุกรานทวีป MU! ขอต้อนรับเหล่านักรบเข้าสู่ Egis-MU Season 2 คลาสสิกแท้ในรูปแบบ No-Reset (เลเวลตัน 400) ที่ทุกเลเวล เพชร Bless, Soul และไอเทมยอดเยี่ยมทุกชิ้นมีคุณค่าระยะยาวอย่างแท้จริง ร่วมจัดตั้งปาร์ตี้และออกผจญภัยได้แล้ววันนี้!",
    creationDate: "2026-10-25T12:00:00.000Z",
    updatedAt: "2026-10-25T12:00:00.000Z",
  },
  {
    id: "default-2",
    title: "ตารางศึกชิงปราสาท VALLEY OF LOREN & เวลาเกิดบอส KALIMA KUNDUN",
    author: "ทีมงาน Egis-MU",
    body: "เตรียมความพร้อมให้กับพันธมิตรกิลด์ของคุณสำหรับมหาสงครามชิงปราสาท Castle Siege ทุกวันอาทิตย์ เวลา 20:00 - 22:00 น. กิลด์ที่ครอบครองปราสาทจะได้รับสิทธิ์เข้าสู่แผนที่ Land of Trials, ระบบผสมไอเทม Lord Mix และภาษีประจำเมือง นอกจากนี้บอส Illusion of Kundun ใน Kalima ชั้น 6 จะเกิดทุกๆ 12 ชั่วโมง พร้อมดรอปเซ็ตไอเทมโบราณ (Ancient) และอาวุธเลเวล 380 แท้ตามแบบฉบับ Season 2",
    creationDate: "2026-10-24T12:00:00.000Z",
    updatedAt: "2026-10-24T12:00:00.000Z",
  },
  {
    id: "default-3",
    title: "สมดุล 5 อาชีพคลาสสิก & การันตีสังคมเกม PLAY-TO-WIN 100%",
    author: "ทีมงาน Egis-MU",
    body: "เซิร์ฟเวอร์ Egis-MU Season 2 ออกแบบระบบเศรษฐกิจและการต่อสู้ภายใต้แนวคิด No-Reset (เลเวลตัน 400) อย่างแท้จริง ไม่มีระบบ Web-Shop ขายไอเทมโกงสเตตัส ทุกสายอาชีพทั้ง 5 คลาส (Dark Knight, Dark Wizard, Fairy Elf, Magic Gladiator และ Dark Lord) ได้รับการปรับสมดุลอย่างพิถีพิถัน ทั้งสำหรับการเก็บเลเวลเป็นปาร์ตี้ ลงดันเจี้ยน Blood Castle, Devil Square, Chaos Castle และการประลอง PvP",
    creationDate: "2026-10-23T12:00:00.000Z",
    updatedAt: "2026-10-23T12:00:00.000Z",
  },
];

const defaultConfig: SiteConfig = {
  downloads: {
    NEXT_PUBLIC_DISCORD_LINK: process.env.NEXT_PUBLIC_DISCORD_LINK || "",
    NEXT_PUBLIC_GOODLE_DRIVE_LINK: process.env.NEXT_PUBLIC_GOODLE_DRIVE_LINK || "",
    NEXT_PUBLIC_MEDIAFIRE_LINK:
      process.env.NEXT_PUBLIC_MEDIAFIRE_LINK ||
      "https://www.mediafire.com/file/y0cu54tjwrp1ppl/EgisMu-S2-Client.rar/file",
    NEXT_PUBLIC_MEGA_LINK:
      process.env.NEXT_PUBLIC_MEGA_LINK ||
      "https://mega.nz/file/zlBEhYLB#MgmpfUPV02ylIy_S_oIbMaXa77uwa6dwke4SFaQAB2Q",
  },
  menus: defaultMenus,
  banners: defaultBanners,
  serverInfo: {
    serverName: "Egis-MU",
    taglineTh: "Season 2 คลาสสิกแท้ ไร้ระบบรีเซ็ต (No-Reset)",
    taglineEn: "Authentic Season 2 Classic No-Reset",
    heroDescriptionTh:
      "สัมผัสตำนานมิวออนไลน์ Season 2 แท้ เลเวลตัน 400 ไม่มีระบบรีเซ็ต สมดุลทุกสายอาชีพ พร้อมสงครามชิงปราสาท Castle Siege",
    heroDescriptionEn:
      "Experience classic Season 2 MU Online capped at level 400 with no resets, balanced classes, and weekly Castle Siege.",
    facebookUrl: "https://www.facebook.com/profile.php?id=61595685382415",
    telegramUrl: "https://t.me/muorigins6e3",
    playOnlineEnabled: true,
    specs: defaultSpecs,
    play2WinTitleTh: "แนวทางเซิร์ฟเวอร์ Egis-MU S2 ไร้ระบบรีเซ็ต (No-Reset)",
    play2WinTitleEn: "Egis-MU S2 No-Reset Philosophy",
    play2WinBodyTh:
      "เซิร์ฟเวอร์ Egis-MU Season 2 ยึดหลัก No-Reset คลาสสิกแท้ เลเวลตันที่ 400 ทุกสเตตัสและไอเทมมีคุณค่าสูงสุด ไม่มี Web-Shop ขายของเทพ ไม่มี Cash-Shop เอาเปรียบ ทุกชิ้นส่วนชุดเกราะและอาวุธหาได้จากการดรอป ตีบวก ล่าบอส และการค้าขายของผู้เล่นอย่างเท่าเทียม",
    play2WinBodyEn:
      "Egis-MU Season 2 is committed to authentic non-reset gameplay capped at level 400. No webshop, no pay-to-win items. Every weapon, wing, and armor piece is earned through gameplay, crafting, boss battles, and player-driven market trading.",
    introTitleTh: "ยินดีต้อนรับสู่ทวีป Egis-MU Season 2",
    introTitleEn: "Welcome to Egis-MU Season 2",
    introBodyTh:
      "Egis-MU S2 นำพาผู้เล่นย้อนสู่ยุคทองของ MU Online ในรูปแบบ Season 2 คลาสสิกแท้ สัมผัสความสนุกของการเก็บเลเวลแบบดั้งเดิม การรวมปาร์ตี้ลง Blood Castle, Devil Square และ Chaos Castle และสงครามชิงปราสาท Castle Siege ที่ทรงเกียรติที่สุดแห่ง Valley of Loren",
    introBodyEn:
      "Egis-MU S2 brings you back to the golden era of classic Season 2 MU Online. Experience the thrill of genuine progression, intense team events like Blood Castle, Devil Square, and the legendary Castle Siege war for control of Valley of Loren.",
  },
  characterSettings: {
    pk: {
      enabled: true,
      zenCost: Number(process.env.NEXT_PUBLIC_ZEN_TO_PKCLEAR || 1000000),
    },
    reset: {
      enabled: false,
      zenCost: 0,
      requiredLevel: 400,
      maxReset: 0,
    },
    relevel: {
      enabled: false,
      zenCost: 2000000,
      targetLevel: 400,
    },
    addStats: {
      enabled: true,
    },
    resetStats: {
      enabled: true,
      zenCost: Number(process.env.NEXT_PUBLIC_ZEN_TO_RESET_STATS || 3000000),
    },
  },
  news: defaultNews,
};

const CONFIG_PATH = path.join(process.cwd(), "data", "site-config.json");

function normalizeMenus(menus: MenuItemConfig[]): MenuItemConfig[] {
  return menus
    .filter((m) => m.id !== "forum" && m.labelEn?.toUpperCase() !== "FORUM")
    .map((m) => {
      if (m.id === "download" || m.labelEn?.toUpperCase() === "FILES") {
        return {
          ...m,
          labelTh: m.labelTh === "FILES" ? "ดาวน์โหลด" : m.labelTh || "ดาวน์โหลด",
          labelEn: "DOWNLOAD",
        };
      }
      return m;
    });
}

export function getSiteConfig(): SiteConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        downloads: { ...defaultConfig.downloads, ...(parsed.downloads || {}) },
        menus: Array.isArray(parsed.menus)
          ? normalizeMenus(parsed.menus)
          : defaultConfig.menus,
        banners: Array.isArray(parsed.banners) ? parsed.banners : defaultConfig.banners,
        serverInfo: {
          ...defaultConfig.serverInfo,
          ...(parsed.serverInfo || {}),
          specs: Array.isArray(parsed.serverInfo?.specs)
            ? parsed.serverInfo.specs
            : defaultConfig.serverInfo.specs,
        },
        characterSettings: {
          pk: {
            ...defaultConfig.characterSettings.pk,
            ...(parsed.characterSettings?.pk || {}),
          },
          reset: {
            ...defaultConfig.characterSettings.reset,
            ...(parsed.characterSettings?.reset || {}),
          },
          relevel: {
            ...defaultConfig.characterSettings.relevel,
            ...(parsed.characterSettings?.relevel || {}),
          },
          addStats: {
            ...defaultConfig.characterSettings.addStats,
            ...(parsed.characterSettings?.addStats || {}),
          },
          resetStats: {
            ...defaultConfig.characterSettings.resetStats,
            ...(parsed.characterSettings?.resetStats || {}),
          },
        },
        news: Array.isArray(parsed.news) ? parsed.news : defaultConfig.news,
      };
    }
  } catch (e) {
    console.error("Failed to read site-config.json:", e);
  }
  return defaultConfig;
}

export function saveSiteConfig(partial: Partial<SiteConfig>): SiteConfig {
  const current = getSiteConfig();
  const updated: SiteConfig = {
    downloads: partial.downloads
      ? { ...current.downloads, ...partial.downloads }
      : current.downloads,
    menus: partial.menus ? normalizeMenus(partial.menus) : current.menus,
    banners: partial.banners ?? current.banners,
    serverInfo: partial.serverInfo
      ? {
          ...current.serverInfo,
          ...partial.serverInfo,
          specs: partial.serverInfo.specs ?? current.serverInfo.specs,
        }
      : current.serverInfo,
    characterSettings: partial.characterSettings
      ? {
          pk: {
            ...current.characterSettings.pk,
            ...(partial.characterSettings.pk || {}),
          },
          reset: {
            ...current.characterSettings.reset,
            ...(partial.characterSettings.reset || {}),
          },
          relevel: {
            ...current.characterSettings.relevel,
            ...(partial.characterSettings.relevel || {}),
          },
          addStats: {
            ...current.characterSettings.addStats,
            ...(partial.characterSettings.addStats || {}),
          },
          resetStats: {
            ...current.characterSettings.resetStats,
            ...(partial.characterSettings.resetStats || {}),
          },
        }
      : current.characterSettings,
    news: partial.news ?? current.news,
  };

  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write site-config.json:", e);
  }

  return updated;
}
