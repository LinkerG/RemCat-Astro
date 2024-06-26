import { Competition, Competition_Result, db, eq } from "astro:db";
import type { TCompetitionResults } from "../types/TCompetitionResults";
import type { TCompetition } from "../types/TCompetition";
import { League } from "./league";
import { getTimeInMilliseconds } from "./getTimeInMilliseconds";

export async function getCurrentLeagueResults(year) {
    const league = new League(year);
    const competitions: TCompetition[] = await db.select().from(Competition).where(eq(Competition.year, year));
    const results: TCompetitionResults[] = await db.select().from(Competition_Result);

    for (const competition of competitions) {

        const competitionResults = results.filter(result => {
            return result.competition_id === competition.id && result.isLeague && result.isFinal;
        });
        
        // Agrupar los resultados por categoría y ordenarlos por tiempo
        const groupedResults = competitionResults.reduce((acc, result) => {
            const { category } = result;
            
            if (!acc[category]) acc[category] = [];
            
            acc[category].push(result);
            // Ordenar los resultados por tiempo
            acc[category].sort((a, b) => {
                const timeA = getTimeInMilliseconds(a.time);
                const timeB = getTimeInMilliseconds(b.time);
                return timeA - timeB;
            });
            
            return acc;
        }, {});
        
        // Asignar puntos a los equipos en función de su posición en cada categoría
        for (const category in groupedResults) {
            if (groupedResults.hasOwnProperty(category)) {
                let points = 20;
                const categoryArray = category.split("");
                const items = groupedResults[category];
                items.forEach(item => {
                    league.addCategoryResult(competition.boat_type, categoryArray, item.team_id, points);
                    points -= 1;
                });
            }
        }
    }

    return league;
}
