import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(){
    try{
        if (!process.env.GAMESERVER_URL) {
            return NextResponse.json({ state: "Online", players: 0, playersList: [] }, { status: 200 });
        }
        const apiKey = process.env.GAMESERVER_API_KEY;
        const result = await fetch(`${process.env.GAMESERVER_URL}/api/status`, {
            cache: "no-store",
            headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
        });
        if(result.ok){
            const response = await result.json();
            const status = typeof response === "string" ? JSON.parse(response) : response;
            return NextResponse.json(status, {status: 200});
        } else {
            return NextResponse.json({ state: "Offline", players: 0, playersList: [] }, {status: 200});
        }
    } catch (e) {
        console.log("Couldn't connect to the gameserver, make sure the GAMESERVER_URL is set correctly(route)");
        return NextResponse.json({ state: "Offline", players: 0, playersList: [] }, {status: 200});
    }

}
