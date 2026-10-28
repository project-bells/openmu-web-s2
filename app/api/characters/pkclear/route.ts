import { authOptions } from "@/lib/auth";
import { getMockAccountCharacters, prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/siteConfig";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const config = getSiteConfig();
    if (!config.characterSettings.pk.enabled) {
      return NextResponse.json(
        { message: "ระบบล้างหัวแดง (PK Clear) ถูกปิดใช้งานอยู่ในขณะนี้" },
        { status: 403 }
      );
    }

    const { name } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" }, { status: 401 });
    }

    const mockChars = getMockAccountCharacters();
    const mockChar = mockChars.find((c) => c.name === name);
    if (mockChar) {
      return NextResponse.json(
        { message: `ล้างสถานะหัวแดง (PK) ของตัวละคร ${name} สำเร็จเรียบร้อยแล้ว!` },
        { status: 200 }
      );
    }

    const verifica = await prisma.character.findMany({
      where: { AccountId: session.user.id },
    });
    if (verifica && verifica.length > 0 && !verifica.map((c) => c.Name).includes(name)) {
      return NextResponse.json({ message: "ไม่พบตัวละครในบัญชีของคุณ" }, { status: 400 });
    }

    const zen =
      config.characterSettings.pk.zenCost ||
      Number(process.env.NEXT_PUBLIC_ZEN_TO_PKCLEAR || 0);

    const enoughMoney = await prisma.itemStorage.findFirst({
      where: {
        Character: { Name: name },
        Money: { gte: zen },
      },
    });

    if (!enoughMoney) {
      return NextResponse.json(
        { message: "Zen ไม่เพียงพอสำหรับการล้าง PK: " + zen.toLocaleString() },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.itemStorage.updateMany({
        where: { Character: { Name: name } },
        data: { Money: { decrement: zen } },
      }),
      prisma.character.update({
        where: { Name: name },
        data: {
          State: 0,
          StateRemainingSeconds: 0,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "ล้างสถานะหัวแดง (PK Clear) สำเร็จเรียบร้อยแล้ว!" },
      { status: 200 }
    );
  } catch (e) {
    console.log("error", e);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 400 }
    );
  }
}