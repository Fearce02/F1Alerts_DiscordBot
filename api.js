const axios = require('axios');
const moment = require('moment-timezone');

async function fetchRaceResults(year, round) {
    try {
        const response = await axios.get(`https://ergast.com/api/f1/${year}/${round}/results.json`);
        const raceData = response.data.MRData.RaceTable.Races[0];
        const raceName = raceData.raceName;
        const raceResults = raceData.Results.map((result, index) => `${index + 1}. ${result.Driver.givenName} ${result.Driver.familyName}`).join('\n');
        const raceResultsMessage = `Race Results for ${raceName}:\n${raceResults}`;
      return raceResultsMessage;
    } catch (error) {
        console.error('Error fetching race results:', error);
        return 'Error fetching race results';
    }
}

async function fetchQualiResults(year, round) {
    try {
        const response = await axios.get(`https://ergast.com/api/f1/${year}/${round}/qualifying.json`);
        const qualifyingData = response.data.MRData.RaceTable.Races[0];
        const raceName = qualifyingData.raceName;
        const qualifyingResults = qualifyingData.QualifyingResults.map(result => {
            const driverName = `${result.Driver.givenName} ${result.Driver.familyName}`;
            const q1Time = result.Q1 ? `Q1 - ${result.Q1}` : '';
            const q2Time = result.Q2 ? `\nQ2 - ${result.Q2}` : '';
            const q3Time = result.Q3 ? `\nQ3 - ${result.Q3}` : '';
            return `${driverName}\n${q1Time}${q2Time}${q3Time}`;
        }).join('\n\n');
        const qualifyingResultsMessage = `Qualifying Results for ${raceName}:\n${qualifyingResults}`;

        return qualifyingResultsMessage;
    } catch (error) {
        console.error('Error fetching qualifying results:', error);
        return 'Error fetching qualifying results';
    }
}

async function fetchDriverStandings(year) {
    try {
        const response = await axios.get(`https://ergast.com/api/f1/${year}/driverStandings.json`);

        const standingsData = response.data.MRData.StandingsTable.StandingsLists[0];
        const standings = standingsData.DriverStandings.map((driver, index) => {
            const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
            const team = driver.Constructors[0].name;
            const points = driver.points;
            return `${index + 1}. ${driverName} - ${team} (${points} points)`;
        }).join('\n');

        const standingsMessage = `Driver Standings for ${year}:\n${standings}`;

        return standingsMessage;
    } catch (error) {
        console.error('Error fetching driver standings:', error);
        return 'Error fetching driver standings';
    }
}

async function fetchConstructorStandings(year) {
    try {
        const response = await axios.get(`https://ergast.com/api/f1/${year}/constructorStandings.json`);

        const constructorStandingsData = response.data.MRData.StandingsTable.StandingsLists[0];
        const constructorstandings = constructorStandingsData.ConstructorStandings.map((constructor, index) => {
            const constructorName = constructor.Constructor.name;
            const points = constructor.points;
            return `${index + 1}. ${constructorName} - ${points} points`;
        }).join('\n');

        const standingsMessage = `Constructor Standings for ${year}:\n${constructorstandings}`;

        return standingsMessage;
    } catch (error) {
        console.error('Error fetching constructor standings:', error);
        return 'Error fetching constructor standings';
    }
}

async function fetchRaceSchedule(year) {
    try {
        const response = await axios.get(`https://ergast.com/api/f1/${year}.json`);

        const races = response.data.MRData.RaceTable.Races;

        let scheduleMessage = `Race Schedule for ${year} (IST):\n`;
        races.forEach((race, index) => {
            const raceDateTimeUTC = moment.tz(`${race.date}T${race.time}`, 'UTC');
            const raceDateTimeIST = raceDateTimeUTC.clone().tz('Asia/Kolkata');

            const formattedDate = raceDateTimeIST.format('MMMM D, YYYY');
            const formattedTime = raceDateTimeIST.format('h:mm A');

            scheduleMessage += `${index + 1}. ${race.raceName} - ${formattedDate}, ${formattedTime} IST\n`;
        });

        return scheduleMessage;
    } catch (error) {
        console.error('Error fetching race schedule:', error);
        return 'Error fetching race schedule';
    }
}

module.exports = {
    fetchRaceResults,
    fetchConstructorStandings,
    fetchDriverStandings,
    fetchQualiResults,
    fetchRaceSchedule
}