import { authOptions } from "@/lib/auth";
import { getMockAccountCharacters, prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/siteConfig";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const config = getSiteConfig();
    if (!config.characterSettings.relevel.enabled) {
      return NextResponse.json(
        { message: "ระบบรีเลเวล (Relevel) ถูกปิดใช้งานอยู่ในขณะนี้" },
        { status: 403 }
      );
    }

    const { name } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" }, { status: 401 });
    }

    const targetLevel = config.characterSettings.relevel.targetLevel || 400;
    const zenCost = config.characterSettings.relevel.zenCost || 0;

    // Update mock character if present
    const mockChars = getMockAccountCharacters();
    const mockChar = mockChars.find((c) => c.name === name);
    if (mockChar) {
      mockChar.lvl = targetLevel;
      mockChar.levelUpPoints = (mockChar.levelUpPoints || 0) + 500;
      return NextResponse.json(
        {
          message: `รีเลเวลตัวละคร ${name} เป็นเลเวล ${targetLevel} สำเร็จ!`,
        },
        { status: 200 }
      );
    }

    // Real DB execution if connected
    const verifica = await prisma.character.findMany({
      where: { AccountId: session.user.id },
    });
    if (verifica && verifica.length > 0 && !verifica.map((c) => c.Name).includes(name)) {
      return NextResponse.json({ message: "ไม่พบตัวละครในบัญชีของคุณ" }, { status: 400 });
    }

    if (zenCost > 0) {
      const enoughMoney = await prisma.itemStorage.findFirst({
        where: {
          Character: { Name: name },
          Money: { gte: zenCost },
        },
      });
      if (!enoughMoney) {
        return NextResponse.json(
          { message: `Zen ไม่เพียงพอ (ต้องการ ${zenCost.toLocaleString()} Zen)` },
          { status: 400 }
        );
      }
      await prisma.itemStorage.updateMany({
        where: { Character: { Name: name } },
        data: { Money: { decrement: zenCost } },
      });
    }

    await prisma.$queryRaw`UPDATE "data"."StatAttribute" sa
      SET "Value" = ${targetLevel}
      FROM "data"."Character" c
      WHERE sa."CharacterId" = c."Id"
        AND c."Name" = ${name}
        AND sa."DefinitionId" = '560931ad-0901-4342-b7f4-fd2e2fcc0563';`;

    return NextResponse.json(
      { message: `รีเลเวลตัวละคร ${name} เป็นเลเวล ${targetLevel} สำเร็จ!` },
      { status: 200 }
    );
  } catch (e) {
    console.error("relevel error:", e);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการรีเลเวลตัวละคร" },
      { status: 400 }
    );
  }
}
