import { authOptions } from "@/lib/auth";
import { getMockAccountCharacters, prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/siteConfig";
import { getServerSession } from "next-auth";
import CharactersPage from "./CharactersPage";
import { CharacterEdit } from "../_models/characterEdit";

export const dynamic = "force-dynamic";

export default async function CharactersMenu() {
  const session = await getServerSession(authOptions);
  const config = getSiteConfig();
  let final: CharacterEdit[] = [];

  if (session?.user?.username) {
    try {
      final = await getStatistics(session.user.username);
    } catch {
      final = [];
    }
    if (!final || final.length === 0) {
      final = getMockAccountCharacters();
    }
  }

  return (
    <>
      <CharactersPage
        result={final}
        initialSettings={config.characterSettings}
      />
    </>
  );
}

async function getStatistics(characterId: string): Promise<CharacterEdit[]> {
  const result: CharacterEdit[] = await prisma.$queryRaw`SELECT
        c."Name" as "name",
        c."CharacterClassId" as "characterClassId",
        c."LevelUpPoints" as "levelUpPoints",
        c."MasterLevelUpPoints" as "masterLevelUpPoints",
        MAX(CASE WHEN sa."DefinitionId" = '89a891a7-f9f9-4ab5-af36-12056e53a5f7' THEN sa."Value" END) AS "resets",
        MAX(CASE WHEN sa."DefinitionId" = '560931ad-0901-4342-b7f4-fd2e2fcc0563' THEN sa."Value" END) AS "lvl",
        MAX(CASE WHEN sa."DefinitionId" = '70cd8c10-391a-4c51-9aa4-a854600e3a9f' THEN sa."Value" END) AS "masterlvl",
        MAX(CASE WHEN sa."DefinitionId" = '123282fe-fead-448e-ad2c-baece939b4b1' THEN sa."Value" END) AS "strength",
        MAX(CASE WHEN sa."DefinitionId" = '1ae9c014-e3cd-4703-bd05-1b65f5f94ceb' THEN sa."Value" END) AS "agility",
        MAX(CASE WHEN sa."DefinitionId" = '6ca5c3a6-b109-45a5-87a7-fdcb107b4982' THEN sa."Value" END) AS "vitality",
        MAX(CASE WHEN sa."DefinitionId" = '01b0ef28-f7a0-46b5-97ba-2b624a54cd75' THEN sa."Value" END) AS "energy",
        MAX(CASE WHEN sa."DefinitionId" = '6af2c9df-3ae4-4721-8462-9a8ec7f56fe4' THEN sa."Value" END) AS "leadership"
    FROM "data"."StatAttribute" sa
    JOIN "data"."Character" c ON sa."CharacterId" = c."Id"
    JOIN "data"."Account" a ON c."AccountId" = a."Id"
    WHERE a."LoginName" = ${characterId}
        AND sa."DefinitionId" IN (
        '89a891a7-f9f9-4ab5-af36-12056e53a5f7',
        '560931ad-0901-4342-b7f4-fd2e2fcc0563',
        '70cd8c10-391a-4c51-9aa4-a854600e3a9f',
        '123282fe-fead-448e-ad2c-baece939b4b1',
        '1ae9c014-e3cd-4703-bd05-1b65f5f94ceb',
        '6ca5c3a6-b109-45a5-87a7-fdcb107b4982',
        '01b0ef28-f7a0-46b5-97ba-2b624a54cd75',
        '6af2c9df-3ae4-4721-8462-9a8ec7f56fe4'
        )
    GROUP BY c."Name", c."CharacterClassId", c."LevelUpPoints", c."MasterLevelUpPoints";`;
  return result;
}
