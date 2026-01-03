import AppDispatcher from '../dispatcher/AppDispatcher';

const DetalhesJogosActions = {
  fetchGameSummary: async (gameId, leagueCode) => {
    try {
      const res = await fetch(
        `https://cdn.espn.com/core/${leagueCode}/playbyplay?xhr=1&gameId=${gameId}`
      );
      const json = await res.json();

      const events =
        json?.page?.content?.[0]?.competitions?.[0]?.plays || [];

      AppDispatcher.dispatch({
        type: 'RECEIVE_GAME_SUMMARY',
        payload: events,
      });
    } catch (error) {
      console.error('Erro ao buscar resumo do jogo', error);
    }
  },
};

export default DetalhesJogosActions;
