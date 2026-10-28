import { News } from "@/app/_models/news";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteConfig, saveSiteConfig } from "@/lib/siteConfig";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const news = await prisma.openMuWeb_News.findMany({
      orderBy: { creationDate: "desc" },
    });
    return NextResponse.json(news);
  } catch {
    return NextResponse.json(getSiteConfig().news);
  }
}

export async function POST(req: Request) {
  try {
    const news: News & { author?: string } = await req.json();
    if (!news.title?.trim() || !news.body?.trim()) {
      return NextResponse.json(
        { message: "กรุณากรอกหัวข้อและเนื้อหาข่าวสารให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const hasAdminHeader = req.headers.get("x-admin-auth") === "egis-admin";
    const session = await getServerSession(authOptions);
    if (!hasAdminHeader && !session?.user) {
      return NextResponse.json({ message: "ไม่มีสิทธิ์ดำเนินการ" }, { status: 403 });
    }

    const isAdmin =
      hasAdminHeader ||
      session?.user?.role === "GAME_MASTER" ||
      session?.user?.username?.toLowerCase() === "admin";

    let gmName = news.author?.trim() || "ทีมงาน Egis-MU";

    if (!isAdmin && session?.user) {
      const GM_ROLE_CODE = 32;
      const verifica = await prisma.character.findMany({
        where: { AccountId: session.user.id },
      });
      if (!verifica || !verifica.map((c) => c.CharacterStatus).includes(GM_ROLE_CODE)) {
        return NextResponse.json({ message: "ไม่มีสิทธิ์ดำเนินการ" }, { status: 403 });
      }
      gmName = verifica.find((c) => c.CharacterStatus === GM_ROLE_CODE)?.Name || "Admin";
    }

    const created = await prisma.openMuWeb_News.create({
      data: {
        author: gmName,
        title: news.title.trim(),
        body: news.body.trim(),
      },
    });

    const current = getSiteConfig().news;
    if (!current.some((n) => n.id === created.id)) {
      saveSiteConfig({
        news: [
          {
            id: created.id,
            title: created.title,
            body: created.body,
            author: created.author,
            creationDate: new Date(created.creationDate).toISOString(),
          },
          ...current,
        ],
      });
    }

    return NextResponse.json(
      { message: "เพิ่มประกาศข่าวสารสำเร็จ", news: created },
      { status: 200 }
    );
  } catch (e) {
    console.error("error", e);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 400 }
    );
  }
}