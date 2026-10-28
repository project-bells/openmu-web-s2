import { authOptions } from "@/lib/auth";
import { getMockAccountCharacters, prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/siteConfig";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const config = getSiteConfig();
    if (!config.characterSettings.reset.enabled) {
      return NextResponse.json(
        { message: "ระบบรีเซ็ตเลเวล (Reset) ถูกปิดใช้งานอยู่ในขณะนี้" },
        { status: 403 }
      );
    }

    const { name, clasId } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" }, { status: 400 });
    }

    const lvlToReset =
      config.characterSettings.reset.requiredLevel ||
      Number(process.env.LVL_TO_RESET || 400);
    const zen =
      config.characterSettings.reset.zenCost ||
      Number(process.env.NEXT_PUBLIC_ZEN_TO_RESET || 0);
    const maxReset =
      config.characterSettings.reset.maxReset ||
      Number(process.env.MAX_RESET || 100);

    // Check mock character first (when DB is not connected or admin preview)
    const mockChars = getMockAccountCharacters();
    const mockChar = mockChars.find((c) => c.name === name);
    if (mockChar) {
      if (mockChar.lvl < lvlToReset) {
        return NextResponse.json(
          { message: `ตัวละครต้องมีเลเวลอย่างน้อย ${lvlToReset} จึงจะรีเซ็ตได้ (ปัจจุบันเลเวล ${mockChar.lvl})` },
          { status: 400 }
        );
      }
      if (mockChar.resets >= maxReset) {
        return NextResponse.json(
          { message: `ตัวละครถึงจำนวนรีเซ็ตสูงสุดแล้ว (${maxReset} รีเซ็ต)` },
          { status: 400 }
        );
      }
      mockChar.resets += 1;
      mockChar.lvl = 1;
      mockChar.levelUpPoints += 500;
      return NextResponse.json(
        { message: `รีเซ็ตตัวละคร ${name} สำเร็จ! (รีเซ็ตครั้งที่ ${mockChar.resets})` },
        { status: 200 }
      );
    }

    const verifica = await prisma.character.findMany({
      where: { AccountId: session.user.id },
    });
    if (verifica && verifica.length > 0 && !verifica.map((c) => c.Name).includes(name)) {
      return NextResponse.json(
        { message: "ไม่พบตัวละครในบัญชีของคุณ กรุณาเข้าสู่ระบบใหม่" },
        { status: 400 }
      );
    }

    const elfAray = [
      "00000040-000b-0000-0000-000000000000",
      "00000040-000a-0000-0000-000000000000",
      "00000040-0008-0000-0000-000000000000",
    ];
    const sumArray = [
      "00000040-0017-0000-0000-000000000000",
      "00000040-0016-0000-0000-000000000000",
      "00000040-0014-0000-0000-000000000000",
    ];
    const lorenciaMap = "00000300-0000-0000-0000-000000000000";
    const noriaMap = "00000300-0003-0000-0000-000000000000";
    const elbelandMap = "00000300-0033-0000-0000-000000000000";
    const finalMap = elfAray.includes(clasId)
      ? noriaMap
      : sumArray.includes(clasId)
      ? elbelandMap
      : lorenciaMap;
    const posX = finalMap == noriaMap ? 176 : finalMap == elbelandMap ? 51 : 141;
    const posY = finalMap == noriaMap ? 116 : finalMap == elbelandMap ? 226 : 121;

    const charToReset = await prisma.statAttribute.count({
      where: {
        OR: [
          {
            Character: { Name: name },
            DefinitionId: "560931ad-0901-4342-b7f4-fd2e2fcc0563",
            Value: { gte: lvlToReset },
          },
          {
            Character: { Name: name },
            DefinitionId: "89a891a7-f9f9-4ab5-af36-12056e53a5f7",
            Value: { lt: maxReset },
          },
        ],
      },
    });

    if (charToReset === 2) {
      const enoughMoney = await prisma.itemStorage.findFirst({
        where: {
          Character: { Name: name },
          Money: { gte: zen },
        },
      });
      if (!enoughMoney) {
        return NextResponse.json(
          { message: "Zen ไม่เพียงพอสำหรับการรีเซ็ต: " + zen.toLocaleString() },
          { status: 400 }
        );
      }
      await prisma.$transaction([
        prisma.itemStorage.updateMany({
          where: {
            Character: { Name: name },
            Money: { gte: zen },
          },
          data: {
            Money: { decrement: zen },
          },
        }),
        prisma.$queryRaw`UPDATE "data"."StatAttribute" sa
          SET "Value" = 
              CASE 
                  WHEN "DefinitionId" = '89a891a7-f9f9-4ab5-af36-12056e53a5f7' THEN sa."Value" + 1
                  WHEN "DefinitionId" = '560931ad-0901-4342-b7f4-fd2e2fcc0563' THEN 1
                  ELSE sa."Value"
              END
          FROM "data"."Character" c
          WHERE sa."CharacterId" = c."Id" 
            AND c."Name" = ${name};`,
        prisma.character.updateMany({
          where: { Name: name },
          data: {
            CurrentMapId: finalMap,
            PositionX: posX,
            PositionY: posY,
          },
        }),
      ]);
    } else {
      return NextResponse.json(
        {
          message:
            "ตัวละครยังไม่ได้เลเวล " +
            lvlToReset +
            " หรือถึงขีดจำกัดรีเซ็ตสูงสุด " +
            maxReset +
            " แล้ว",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "รีเซ็ตตัวละครสำเร็จเรียบร้อยแล้ว!" },
      { status: 200 }
    );
  } catch (e) {
    console.log("error", e);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดระหว่างรีเซ็ตตัวละคร" },
      { status: 400 }
    );
  }
}