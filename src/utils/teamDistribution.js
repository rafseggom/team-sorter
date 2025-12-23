export function distributeTeamsRandom(players, numTeams) {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const teams = Array.from({ length: numTeams }, () => []);
  
  shuffled.forEach((player, index) => {
    teams[index % numTeams].push(player);
  });
  
  return teams;
}

export function distributeTeamsBalanced(players, numTeams, ratings) {
  const sortedPlayers = [...players].sort((a, b) => {
    return ratings[b].rating - ratings[a].rating;
  });

  const captains = sortedPlayers.filter(player => ratings[player].isCaptain);
  const nonCaptains = sortedPlayers.filter(player => !ratings[player].isCaptain);

  const teams = Array.from({ length: numTeams }, () => []);
  const teamRatings = Array(numTeams).fill(0);

  captains.forEach((captain, index) => {
    if (index < numTeams) {
      teams[index].push(captain);
      teamRatings[index] += ratings[captain].rating;
    }
  });

  if (captains.length > numTeams) {
    nonCaptains.unshift(...captains.slice(numTeams));
  }

  nonCaptains.forEach(player => {
    const minRatingIndex = teamRatings.indexOf(Math.min(...teamRatings));
    teams[minRatingIndex].push(player);
    teamRatings[minRatingIndex] += ratings[player].rating;
  });

  return balanceTeamsGreedy(teams, ratings);
}

function balanceTeamsGreedy(teams, ratings, maxIterations = 100) {
  let improved = true;
  let iterations = 0;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];

        for (let p1 = 0; p1 < team1.length; p1++) {
          for (let p2 = 0; p2 < team2.length; p2++) {
            const player1 = team1[p1];
            const player2 = team2[p2];

            if (ratings[player1].isCaptain && ratings[player2].isCaptain) {
              continue;
            }

            const currentRating1 = calculateTeamRating(team1, ratings);
            const currentRating2 = calculateTeamRating(team2, ratings);
            const currentDiff = Math.abs(currentRating1 - currentRating2);

            const newTeam1 = [...team1];
            const newTeam2 = [...team2];
            newTeam1[p1] = player2;
            newTeam2[p2] = player1;

            const newRating1 = calculateTeamRating(newTeam1, ratings);
            const newRating2 = calculateTeamRating(newTeam2, ratings);
            const newDiff = Math.abs(newRating1 - newRating2);

            if (newDiff < currentDiff) {
              teams[i] = newTeam1;
              teams[j] = newTeam2;
              improved = true;
            }
          }
        }
      }
    }
  }

  return teams;
}

function calculateTeamRating(team, ratings) {
  return team.reduce((sum, player) => sum + ratings[player].rating, 0);
}
