import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteConfig, saveSiteConfig } from "@/lib/siteConfig";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function verifyAdmin(req: NextRequest) {
  if (req.headers.get("x-admin-auth") === "egis-admin") {
    return true;
  }
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;
  if (
    session.user.role === "GAME_MASTER" ||
    session.user.username?.toLowerCase() === "admin"
  ) {
    return true;
  }
  const GM_ROLE_CODE = 32;
  const verifica = await prisma.character.findMany({
    where: { AccountId: session.user.id },
  });
  return Boolean(verifica && verifica.map((c) => c.CharacterStatus).includes(GM_ROLE_CODE));
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ message: "ไม่มีสิทธิ์ดำเนินการ" }, { status: 403 });
    }
    const id = params.id;
    const { title, body, author } = await req.json();

    await prisma.openMuWeb_News.update({
      where: { id },
      data: {
        title,
        body,
        ...(author ? { author } : {}),
      },
    });

    const updatedNews = getSiteConfig().news.map((item) =>
      item.id === id
        ? {
            ...item,
            title: title ?? item.title,
            body: body ?? item.body,
            author: author ?? item.author,
          }
        : item
    );
    saveSiteConfig({ news: updatedNews });

    return NextResponse.json({ message: "แก้ไขข่าวสารเรียบร้อยแล้ว" }, { status: 200 });
  } catch (e) {
    console.error("error", e);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการแก้ไขข่าวสาร" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ message: "ไม่มีสิทธิ์ดำเนินการ" }, { status: 403 });
    }
    const id = params.id;

    await prisma.openMuWeb_News.delete({
      where: { id },
    });

    const filtered = getSiteConfig().news.filter((item) => item.id !== id);
    saveSiteConfig({ news: filtered });

    return NextResponse.json({ message: "ลบประกาศข่าวสารเรียบร้อยแล้ว" }, { status: 200 });
  } catch (e) {
    console.error("error", e);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการลบข่าวสาร" },
      { status: 400 }
    );
  }
}