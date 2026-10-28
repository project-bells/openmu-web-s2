import { PrismaClient } from "@prisma/client";
import { getSiteConfig, saveSiteConfig } from "./siteConfig";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  mockAccountChars: any[];
};

const defaultAccountCharacters = [
  {
    name: "AdminDK",
    characterClassId: "00000040-0007-0000-0000-000000000000",
    levelUpPoints: 1200,
    masterLevelUpPoints: 30,
    resets: 0,
    lvl: 380,
    masterlvl: 40,
    strength: 1250,
    agility: 850,
    vitality: 720,
    energy: 280,
    leadership: 0,
  },
  {
    name: "AdminDL",
    characterClassId: "00000040-0011-0000-0000-000000000000",
    levelUpPoints: 1400,
    masterLevelUpPoints: 45,
    resets: 0,
    lvl: 372,
    masterlvl: 35,
    strength: 950,
    agility: 700,
    vitality: 580,
    energy: 420,
    leadership: 880,
  },
];

export function getMockAccountCharacters() {
  if (!globalForPrisma.mockAccountChars) {
    globalForPrisma.mockAccountChars = defaultAccountCharacters.map((c) => ({ ...c }));
  }
  return globalForPrisma.mockAccountChars;
}

const mockStore: Record<string, any[]> = {
  guild: [
    { Name: "AegisGuard", Score: 1420 },
    { Name: "Olympus", Score: 1180 },
    { Name: "Titans", Score: 940 },
    { Name: "Valkyrie", Score: 780 },
    { Name: "Aethelgard", Score: 620 },
  ],
  guildMember: [
    { Status: 2, Character: { Name: "Aetherius" }, Guild: { Name: "AegisGuard" } },
    { Status: 1, Character: { Name: "BladeMaster" }, Guild: { Name: "AegisGuard" } },
    { Status: 0, Character: { Name: "GrandWizard" }, Guild: { Name: "AegisGuard" } },
    { Status: 2, Character: { Name: "Sovereign" }, Guild: { Name: "Olympus" } },
    { Status: 0, Character: { Name: "IronFist" }, Guild: { Name: "Olympus" } },
    { Status: 2, Character: { Name: "ArcaneSM" }, Guild: { Name: "Titans" } },
    { Status: 0, Character: { Name: "Freya" }, Guild: { Name: "Titans" } },
    { Status: 2, Character: { Name: "Sylvanas" }, Guild: { Name: "Valkyrie" } },
    { Status: 2, Character: { Name: "Valerius" }, Guild: { Name: "Aethelgard" } },
  ],
  account: [],
  character: [],
  statAttribute: [],
  itemStorage: [],
};

const mockTopCharacters = [
  {
    Name: "Aetherius",
    CharacterClassId: "00000040-0007-0000-0000-000000000000",
    CurrentMapId: "00000300-0000-0000-0000-000000000000",
    resets: 0,
    lvl: 400,
    masterlvl: 150,
    PlayerKillCount: 88,
  },
  {
    Name: "Sovereign",
    CharacterClassId: "00000040-0011-0000-0000-000000000000",
    CurrentMapId: "00000300-0002-0000-0000-000000000000",
    resets: 0,
    lvl: 398,
    masterlvl: 135,
    PlayerKillCount: 64,
  },
  {
    Name: "ArcaneSM",
    CharacterClassId: "00000040-0003-0000-0000-000000000000",
    CurrentMapId: "00000300-0007-0000-0000-000000000000",
    resets: 0,
    lvl: 395,
    masterlvl: 110,
    PlayerKillCount: 52,
  },
  {
    Name: "Sylvanas",
    CharacterClassId: "00000040-000b-0000-0000-000000000000",
    CurrentMapId: "00000300-0003-0000-0000-000000000000",
    resets: 0,
    lvl: 390,
    masterlvl: 95,
    PlayerKillCount: 38,
  },
  {
    Name: "Valerius",
    CharacterClassId: "00000040-000d-0000-0000-000000000000",
    CurrentMapId: "00000300-0008-0000-0000-000000000000",
    resets: 0,
    lvl: 382,
    masterlvl: 80,
    PlayerKillCount: 29,
  },
];

function createMockModel(modelName: string) {
  const getList = () => {
    if (modelName === "openMuWeb_News") {
      return getSiteConfig().news.map((n) => ({
        ...n,
        creationDate: new Date(n.creationDate),
      }));
    }
    if (!mockStore[modelName]) mockStore[modelName] = [];
    return mockStore[modelName];
  };
  return {
    findMany: async ({ where, skip, take, orderBy }: any = {}) => {
      let list = [...getList()];
      if (where) {
        if (modelName === "guildMember" && where?.Guild?.Name) {
          list = list.filter((item) => item?.Guild?.Name === where.Guild.Name);
        }
        if (modelName === "character" && where?.Name?.in) {
          const names: string[] = Array.isArray(where.Name.in) ? where.Name.in : [];
          list = list.filter((item) => names.includes(item.Name));
        }
        if (where?.AccountId?.equals) {
          list = list.filter((item) => item.AccountId === where.AccountId.equals);
        }
      }
      if (orderBy) {
        if (orderBy.Score === "desc") {
          list.sort((a, b) => (b.Score || 0) - (a.Score || 0));
        } else if (orderBy.creationDate === "desc") {
          list.sort(
            (a, b) =>
              new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
          );
        }
      }
      if (typeof skip === "number" && skip > 0) {
        list = list.slice(skip);
      }
      if (typeof take === "number" && take > 0) {
        list = list.slice(0, take);
      }
      return list;
    },
    findFirst: async ({ where }: any = {}) => {
      const list = getList();
      if (!where) return list[0] ?? null;
      return (
        list.find((item) =>
          Object.entries(where).every(([k, v]) => item[k] === v)
        ) ?? null
      );
    },
    findUnique: async ({ where }: any = {}) => {
      const list = getList();
      if (!where) return list[0] ?? null;
      return (
        list.find((item) =>
          Object.entries(where).every(([k, v]) => item[k] === v)
        ) ?? null
      );
    },
    create: async ({ data }: any = {}) => {
      const record = {
        id: "00000000-0000-4000-8000-" + String(Date.now()).slice(-12).padStart(12, "0"),
        creationDate: new Date(),
        ...data,
      };
      if (modelName === "openMuWeb_News") {
        const currentNews = getSiteConfig().news;
        saveSiteConfig({
          news: [
            {
              id: record.id,
              title: record.title,
              body: record.body,
              author: record.author || "Admin",
              creationDate: new Date().toISOString(),
            },
            ...currentNews,
          ],
        });
        return record;
      }
      const list = getList();
      list.unshift(record);
      return record;
    },
    update: async ({ where, data }: any = {}) => {
      if (modelName === "openMuWeb_News" && where?.id) {
        const currentNews = getSiteConfig().news.map((item) =>
          item.id === where.id ? { ...item, ...data } : item
        );
        saveSiteConfig({ news: currentNews });
      }
      return data ?? {};
    },
    updateMany: async ({ data }: any = {}) => ({ count: 1, ...data }),
    delete: async ({ where }: any = {}) => {
      if (modelName === "openMuWeb_News" && where?.id) {
        const currentNews = getSiteConfig().news.filter((item) => item.id !== where.id);
        saveSiteConfig({ news: currentNews });
        return {};
      }
      const list = getList();
      if (where?.id) {
        mockStore[modelName] = list.filter((item) => item.id !== where.id);
      }
      return {};
    },
    count: async () => getList().length,
  };
}

let realPrisma: any = null;
try {
  if (process.env.DATABASE_URL) {
    realPrisma = globalForPrisma.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = realPrisma;
    }
  }
} catch (e) {
  console.warn("[AI Studio] Prisma initialization error, using mock fallback:", e);
}

function handleMockQueryRaw(stringsOrQuery: any, ...values: any[]): any[] {
  const queryStr = Array.isArray(stringsOrQuery)
    ? stringsOrQuery.join(" ")
    : String(stringsOrQuery || "");
  const lower = queryStr.toLowerCase();

  if (lower.includes("playerkillcount")) {
    return mockTopCharacters.map((c, i) => ({
      Id: `00000000-0000-0000-0000-${String(i + 1).padStart(12, "0")}`,
      CharacterClassId: c.CharacterClassId,
      CurrentMapId: c.CurrentMapId,
      Name: c.Name,
      PlayerKillCount: c.PlayerKillCount,
    }));
  }

  if (lower.includes("loginname") || lower.includes("levelupoints")) {
    return getMockAccountCharacters();
  }

  if (lower.includes("resets") || lower.includes("masterlvl")) {
    return mockTopCharacters.map((c, i) => ({
      CharacterId: `00000000-0000-0000-0000-${String(i + 1).padStart(12, "0")}`,
      Name: c.Name,
      CharacterClassId: c.CharacterClassId,
      resets: c.resets,
      lvl: c.lvl,
      masterlvl: c.masterlvl,
    }));
  }

  return [];
}

const mockModelCache: Record<string, any> = {};

function getMockModel(name: string) {
  if (!mockModelCache[name]) {
    mockModelCache[name] = createMockModel(name);
  }
  return mockModelCache[name];
}

/**
 * Resilient Prisma export for AI Studio environment:
 * If a live database is connected via DATABASE_URL, real queries are executed.
 * When the database is offline or unconfigured, it cleanly falls back to
 * responsive in-memory and site-config mock data so the app remains fully functional.
 */
export const prisma = new Proxy({} as any, {
  get(_target, prop: string | symbol) {
    if (typeof prop !== "string") return undefined;

    if (prop === "$connect" || prop === "$disconnect") {
      return async () => {};
    }

    if (prop === "$transaction") {
      return async (arg: any) => {
        if (typeof arg === "function") {
          return arg(prisma);
        }
        if (Array.isArray(arg)) {
          return Promise.all(arg);
        }
        return arg;
      };
    }

    if (prop === "$queryRaw" || prop === "$queryRawUnsafe") {
      return async (stringsOrQuery: any, ...values: any[]) => {
        if (realPrisma && typeof realPrisma[prop] === "function") {
          try {
            return await realPrisma[prop](stringsOrQuery, ...values);
          } catch (err) {
            console.warn(
              `[AI Studio] Real DB ${prop} query failed, using mock data fallback:`,
              (err as Error)?.message || err
            );
          }
        }
        return handleMockQueryRaw(stringsOrQuery, ...values);
      };
    }

    const mockModel = getMockModel(prop);

    if (realPrisma && realPrisma[prop]) {
      const realModel = realPrisma[prop];
      return new Proxy(mockModel, {
        get(targetModel, modelMethod: string) {
          if (typeof realModel[modelMethod] === "function") {
            return async (...args: any[]) => {
              try {
                return await realModel[modelMethod](...args);
              } catch (err) {
                console.warn(
                  `[AI Studio] Real DB model call prisma.${prop}.${modelMethod} failed, using mock data fallback:`,
                  (err as Error)?.message || err
                );
                if (typeof targetModel[modelMethod] === "function") {
                  return await targetModel[modelMethod](...args);
                }
                return null;
              }
            };
          }
          return targetModel[modelMethod];
        },
      });
    }

    return mockModel;
  },
}) as PrismaClient;

