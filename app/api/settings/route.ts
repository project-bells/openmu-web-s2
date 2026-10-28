import { NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getSiteConfig();
  return NextResponse.json(config);
}
