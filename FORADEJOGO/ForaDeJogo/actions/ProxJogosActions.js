import AppDispatcher from '../dispatcher/AppDispatcher';

const ProxJogosActions = {
  async fetchNextGames(teamId) {
    try {
      const res = await fetch(
        `https://site.web.api.espn.com/apis/site/v2/sports/soccer/all/teams/${teamId}/schedule?fixture=true`
      );
      const json = await res.json();

      AppDispatcher.dispatch({
        type: 'NEXT_GAMES_LOADED',
        payload: json.events || [],
      });
    } catch (error) {
      console.error('Erro ao carregar próximos jogos', error);
    }
  },
};

export default ProxJogosActions;
