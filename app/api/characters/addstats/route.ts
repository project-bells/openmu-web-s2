import { authOptions } from "@/lib/auth";
import { getMockAccountCharacters, prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/siteConfig";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const config = getSiteConfig();
    if (!config.characterSettings.addStats.enabled) {
      return NextResponse.json(
        { message: "ระบบอัพสเตตัส (Add Stats) ถูกปิดใช้งานอยู่ในขณะนี้" },
        { status: 403 }
      );
    }

    const { name, str, agi, vit, ene, lead } = await req.json();
    const total = (str || 0) + (agi || 0) + (vit || 0) + (ene || 0) + (lead || 0);
    if (total <= 0) {
      return NextResponse.json(
        { message: "กรุณาระบุแต้มที่ต้องการอัพอย่างน้อย 1 แต้ม" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" }, { status: 401 });
    }

    const mockChars = getMockAccountCharacters();
    const mockChar = mockChars.find((c) => c.name === name);
    if (mockChar) {
      if (mockChar.levelUpPoints < total) {
        return NextResponse.json(
          { message: "แต้มสเตตัสคงเหลือไม่เพียงพอ!" },
          { status: 400 }
        );
      }
      mockChar.levelUpPoints -= total;
      mockChar.strength += str || 0;
      mockChar.agility += agi || 0;
      mockChar.vitality += vit || 0;
      mockChar.energy += ene || 0;
      mockChar.leadership += lead || 0;
      return NextResponse.json(
        { message: `อัพสเตตัสตัวละคร ${name} สำเร็จเรียบร้อยแล้ว!` },
        { status: 200 }
      );
    }

    const verifica = await prisma.character.findMany({
      where: { AccountId: session.user.id },
    });
    if (verifica && verifica.length > 0 && !verifica.map((c) => c.Name).includes(name)) {
      return NextResponse.json({ message: "ไม่พบตัวละครในบัญชีของคุณ" }, { status: 400 });
    }

    const character = await prisma.character.findUnique({
      where: { Name: name },
    });
    if ((character?.LevelUpPoints ?? 0) < total) {
      return NextResponse.json(
        { message: "แต้มสเตตัสคงเหลือไม่เพียงพอ!" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.statAttribute.updateMany({
        where: {
          Character: { Name: name },
          AND: [{ DefinitionId: "123282fe-fead-448e-ad2c-baece939b4b1" }],
        },
        data: { Value: { increment: str } },
      }),
      prisma.statAttribute.updateMany({
        where: {
          Character: { Name: name },
          AND: [{ DefinitionId: "1ae9c014-e3cd-4703-bd05-1b65f5f94ceb" }],
        },
        data: { Value: { increment: agi } },
      }),
      prisma.statAttribute.updateMany({
        where: {
          Character: { Name: name },
          AND: [{ DefinitionId: "6ca5c3a6-b109-45a5-87a7-fdcb107b4982" }],
        },
        data: { Value: { increment: vit } },
      }),
      prisma.statAttribute.updateMany({
        where: {
          Character: { Name: name },
          AND: [{ DefinitionId: "01b0ef28-f7a0-46b5-97ba-2b624a54cd75" }],
        },
        data: { Value: { increment: ene } },
      }),
      prisma.statAttribute.updateMany({
        where: {
          Character: { Name: name },
          AND: [{ DefinitionId: "6af2c9df-3ae4-4721-8462-9a8ec7f56fe4" }],
        },
        data: { Value: { increment: lead } },
      }),
      prisma.character.update({
        where: { Name: name },
        data: { LevelUpPoints: { decrement: total } },
      }),
    ]);
    return NextResponse.json(
      { message: "อัพแต้มสเตตัสสำเร็จเรียบร้อยแล้ว!" },
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