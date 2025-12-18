import AppDispatcher from '../dispatcher/AppDispatcher';

const DetalhesLigaActions = {
  fetchTable: async (leagueCode) => {
    try {
      const res = await fetch(
        `https://site.web.api.espn.com/apis/v2/sports/soccer/${leagueCode}/standings`
      );
      const json = await res.json();

      const standings =
        json.children[0].standings.entries.map(entry => ({
          teamId: entry.team.id,
          teamName: entry.team.displayName,
          logo: entry.team.logos[0].href,
          games: entry.stats.find(s => s.name === 'gamesPlayed')?.value,
          goalDiff: entry.stats.find(s => s.name === 'pointDifferential')?.value,
          points: entry.stats.find(s => s.name === 'points')?.value,
        }));

      AppDispatcher.dispatch({
        type: 'RECEIVE_TABLE',
        table: standings
      });

    } catch (error) {
      console.error(error);
    }
  }
};

export default DetalhesLigaActions;
