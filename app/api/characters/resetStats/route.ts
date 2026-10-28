import { authOptions } from "@/lib/auth";
import { getMockAccountCharacters, prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/siteConfig";
import { StatAttribute } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const config = getSiteConfig();
    if (!config.characterSettings.resetStats.enabled) {
      return NextResponse.json(
        { message: "ระบบรีเซ็ตสเตตัส (Reset Stats) ถูกปิดใช้งานอยู่ในขณะนี้" },
        { status: 403 }
      );
    }

    const { name } = (await req.json()) as { name: string; clasId: string };
    const zenToReset =
      config.characterSettings.resetStats.zenCost ||
      Number(process.env.NEXT_PUBLIC_ZEN_TO_RESET_STATS || 0);

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" }, { status: 401 });
    }

    const mockChars = getMockAccountCharacters();
    const mockChar = mockChars.find((c) => c.name === name);
    if (mockChar) {
      const refunded =
        Math.max(0, mockChar.strength - 20) +
        Math.max(0, mockChar.agility - 20) +
        Math.max(0, mockChar.vitality - 20) +
        Math.max(0, mockChar.energy - 20) +
        Math.max(0, (mockChar.leadership || 0) - 20);
      mockChar.strength = 20;
      mockChar.agility = 20;
      mockChar.vitality = 20;
      mockChar.energy = 20;
      if (mockChar.leadership > 0) mockChar.leadership = 20;
      mockChar.levelUpPoints += refunded;
      return NextResponse.json(
        { message: `รีเซ็ตสเตตัสของ ${name} สำเร็จ! คืนแต้มทั้งหมด ${refunded.toLocaleString()} แต้ม` },
        { status: 200 }
      );
    }

    const verifica = await prisma.character.findMany({
      where: { AccountId: session.user.id },
    });
    if (verifica && verifica.length > 0 && !verifica.map((c) => c.Name).includes(name)) {
      return NextResponse.json({ message: "ไม่พบตัวละครในบัญชีของคุณ" }, { status: 400 });
    }

    const attributeStatsId = [
      "123282fe-fead-448e-ad2c-baece939b4b1",
      "1ae9c014-e3cd-4703-bd05-1b65f5f94ceb",
      "6ca5c3a6-b109-45a5-87a7-fdcb107b4982",
      "01b0ef28-f7a0-46b5-97ba-2b624a54cd75",
      "6af2c9df-3ae4-4721-8462-9a8ec7f56fe4",
    ];
    const statsAttributes: StatAttribute[] = await prisma.statAttribute.findMany({
      where: {
        AND: [
          { DefinitionId: { in: attributeStatsId } },
          { Character: { Name: name } },
        ],
      },
    });

    const totalResetedPoints = statsAttributes.reduce(
      (acc, cur) => acc + (cur.Value - 20),
      0
    );

    const enoughMoney = await prisma.itemStorage.findFirst({
      where: {
        Character: { Name: name },
        Money: { gte: zenToReset },
      },
    });
    if (!enoughMoney) {
      return NextResponse.json(
        { message: "Zen ไม่เพียงพอ: " + zenToReset.toLocaleString() },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.statAttribute.updateMany({
        where: {
          Character: { Name: name },
          AND: [{ DefinitionId: { in: attributeStatsId } }],
        },
        data: { Value: 20 },
      }),
      prisma.character.update({
        where: { Name: name },
        data: { LevelUpPoints: { increment: totalResetedPoints } },
      }),
      prisma.itemStorage.updateMany({
        where: { Character: { Name: name } },
        data: { Money: { decrement: zenToReset } },
      }),
    ]);
    return NextResponse.json(
      { message: "รีเซ็ตแต้มสเตตัสเรียบร้อยแล้ว!" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการรีเซ็ตสเตตัส" },
      { status: 400 }
    );
  }
}