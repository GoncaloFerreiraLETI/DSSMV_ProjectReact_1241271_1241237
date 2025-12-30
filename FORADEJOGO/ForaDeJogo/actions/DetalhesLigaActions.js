import AppDispatcher from '../dispatcher/AppDispatcher';

const DetalhesLigaActions = {
  fetchTable: async (leagueCode) => {
    try {
      //tabela geral
      const resTable = await fetch(
        `https://site.web.api.espn.com/apis/v2/sports/soccer/${leagueCode}/standings`
      );
      const jsonTable = await resTable.json();

      const standings =
        jsonTable.children?.[0]?.standings?.entries?.map(entry => ({
          teamId: entry.team.id,
          teamName: entry.team.displayName,
          logo: entry.team.logos?.[0]?.href,
          games: entry.stats.find(s => s.name === 'gamesPlayed')?.value,
          goalDiff: entry.stats.find(s => s.name === 'pointDifferential')?.value,
          points: entry.stats.find(s => s.name === 'points')?.value,
        })) || [];

      AppDispatcher.dispatch({
        type: 'RECEIVE_TABLE',
        table: standings
      });

      //casa e fora
      const resScoreboard = await fetch(
        `https://site.web.api.espn.com/apis/v2/sports/soccer/${leagueCode}/scoreboard`
      );
      const jsonScoreboard = await resScoreboard.json();

      //pontos casa e fora
      const homePointsMap = {};
      const awayPointsMap = {};

      standings.forEach(team => {
        homePointsMap[team.teamId] = { ...team, points: 0 };
        awayPointsMap[team.teamId] = { ...team, points: 0 };
      });

      const events = jsonScoreboard.events || [];
      events.forEach(event => {
        const comp = event.competitions?.[0];
        if (!comp) return;

        comp.competitors?.forEach(c => {
          const teamId = c.team?.id;
          const points = parseInt(c.score) || 0;
          if (!teamId) return;

          if (c.homeAway === 'home' && homePointsMap[teamId]) {
            homePointsMap[teamId].points += points;
          } else if (c.homeAway === 'away' && awayPointsMap[teamId]) {
            awayPointsMap[teamId].points += points;
          }
        });
      });

      AppDispatcher.dispatch({
        type: 'RECEIVE_HOME_POINTS',
        table: Object.values(homePointsMap).sort((a, b) => b.points - a.points)
      });

      AppDispatcher.dispatch({
        type: 'RECEIVE_AWAY_POINTS',
        table: Object.values(awayPointsMap).sort((a, b) => b.points - a.points)
      });

    } catch (error) {
      console.error(error);
    }
  }
};

export default DetalhesLigaActions;
