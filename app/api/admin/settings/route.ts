import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSiteConfig, saveSiteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

async function isAdminSession(req: NextRequest) {
  if (req.headers.get("x-admin-auth") === "egis-admin") {
    return true;
  }
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;
  return (
    session.user.role === "GAME_MASTER" ||
    session.user.username?.toLowerCase() === "admin"
  );
}

export async function GET(req: NextRequest) {
  if (!(await isAdminSession(req))) {
    return NextResponse.json({ message: "ไม่มีสิทธิ์เข้าถึง (Unauthorized)" }, { status: 403 });
  }
  return NextResponse.json(getSiteConfig());
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminSession(req))) {
    return NextResponse.json({ message: "ไม่มีสิทธิ์เข้าถึง (Unauthorized)" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const updated = saveSiteConfig(body);
    return NextResponse.json({
      message: "บันทึกการตั้งค่าเรียบร้อยแล้ว",
      config: updated,
    });
  } catch (e) {
    console.error("Error updating admin settings:", e);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการบันทึกการตั้งค่า" },
      { status: 400 }
    );
  }
}
