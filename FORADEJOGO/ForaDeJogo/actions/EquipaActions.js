import AppDispatcher from '../dispatcher/AppDispatcher';

export default {
  async fetchTeamRoster(teamId) {
    AppDispatcher.dispatch({
      type: 'TEAM_CLEAR',
    });

    try {
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/${teamId}?enable=roster`
      );

      const json = await response.json();

      AppDispatcher.dispatch({
        type: 'TEAM_LOADED',
        payload: json.team,
      });
    } catch (error) {
      console.error('Erro ao carregar plantel', error);

      AppDispatcher.dispatch({
        type: 'TEAM_LOADED',
        payload: { athletes: [] },
      });
    }
  },
};
