import { defineDb, defineTable, column } from 'astro:db';

// https://astro.build/db/config

const Team = defineTable({
  columns: {
    slug: column.text({primaryKey: true, unique: true}),
    name: column.text(),
    logo: column.text(),
    isActive: column.boolean(),
  }
})

const Competition = defineTable({
  columns: {
    id: column.text({primaryKey: true, unique: true,}),
    name: column.text(),
    year: column.text(),
    date: column.date(),
    location: column.text(),
    image: column.text(),
    boat_type: column.text(),
    lines: column.number({default: 4}),
    line_distance: column.number({default: 350}),
    isCancelled: column.boolean(),
    isActive: column.boolean(),
  }
})

const Competition_Result = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    competition_id: column.text({ references: () => Competition.columns.id }),
    team_id: column.text({ references: () => Team.columns.slug }),
    category: column.text(),
    isFinal: column.boolean(),
    group: column.number(),
    time: column.text( {default: "DNS"} ),
    distance: column.number(),
    isLeague: column.boolean(),
    isChampionship: column.boolean(),
    isActive: column.boolean(),
  }
})

export default defineDb({
  tables: {
    Team,
    Competition,
    Competition_Result,
  }
});
