import AppDispatcher from '../dispatcher/AppDispatcher';

const ResultadosJogosActions = {
  async fetchResultsGames(teamId) {
    try {
      const res = await fetch(
        `https://site.web.api.espn.com/apis/site/v2/sports/soccer/all/teams/${teamId}/schedule?season=2025`
      );
      const json = await res.json();

      AppDispatcher.dispatch({
        type: 'RESULTS_GAMES_LOADED',
        payload: json.events || [],
      });
    } catch (error) {
      console.error('Erro ao carregar próximos jogos', error);
    }
  },
};

export default ResultadosJogosActions;
