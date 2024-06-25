const {fetchRaceResults, fetchConstructorStandings, fetchDriverStandings, fetchQualiResults, fetchRaceSchedule} = require('./api');

const Races = {
    'Bahrain': 1,
    'Saudi Arabia': 2,
    'Australia': 3,
    'Japan': 4,
    'China': 5,
    'Miami': 6,
    'Imola': 7,
    'Monaco': 8,
    'Canada': 9,
    'Spain': 10,
    'Austria': 11,
    'Silverstone': 12,
    'Hungary': 13,
    'Belgium': 14,
    'Dutch': 15,
    'Italy': 16,
    'Azerbaijan': 17,
    'Singapore': 18,
    'USA': 19,
    'Mexico': 20,
    'Brazil': 21,
    'Las Vegas': 22,
    'Qatar': 23,
    'Abu Dhabi': 24,
};

const roundCodemap = {};
for (const [key, value] of Object.entries(Races)) {
    roundCodemap[value] = key;
}


async function CommandHandler(msg) {
    if (!msg.content.startsWith('!') || msg.author.bot) return;

    const args = msg.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    await msg.channel.sendTyping();

    if (command === 'raceresults') {
        let Race = args[0] ? args[0] : null;
        let mappedRaces = Races[Race];
        if (mappedRaces === undefined && !isNaN(parseInt(Race))) {
            mappedRaces = parseInt(Race);
        }
        if (mappedRaces !== undefined) {
            console.log(`Round code '${Race}' mapped to: ${mappedRaces}`);
            const raceResults = await fetchRaceResults(2024, mappedRaces);
            msg.reply(raceResults);
        } else {
            console.log(`Round code '${Race}' not found in the mapping.`);
            msg.reply("Invalid round code. Please provide a valid round code.");
        }
    } else if (command === 'qualiresults') {
        let Race = args[0] ? args[0] : null;
        let mappedRaces = Races[Race];
        if (mappedRaces === undefined && !isNaN(parseInt(Race))) {
            mappedRaces = parseInt(Race);
        }
        if (mappedRaces !== undefined) {
            const qualifyingResults = await fetchQualiResults(2024, mappedRaces);
            msg.reply(qualifyingResults);
        }
    } else if (command === 'standings') {
        const year = args[0];
        if (!year || isNaN(year)) {
            msg.reply('Please provide a valid year.');
            return;
        }
        const standings = await fetchDriverStandings(year);
        msg.reply(standings);

    } else if (command === 'constructors') {
        const year = args[0];
        if (!year || isNaN(year)) {
            msg.reply('Please provide a valid year.');
            return;
        }
        const constructorstandings = await fetchConstructorStandings(year);
        msg.reply(constructorstandings);

    } else if (command === 'raceschedule') {
        const currentYear = new Date().getFullYear();
        const schedule = await fetchRaceSchedule(currentYear);
        msg.reply(schedule);

    } else {
        msg.reply("Sorry, I don't recognize that command.");
    }
}

module.exports = {
    CommandHandler
}