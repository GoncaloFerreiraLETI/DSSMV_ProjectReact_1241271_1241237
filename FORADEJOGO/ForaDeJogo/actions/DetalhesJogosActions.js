import AppDispatcher from '../dispatcher/AppDispatcher';

const DetalhesJogosActions = {
  fetchGameDetails: async (gameId, leagueCode) => {
    console.log('FETCH GAME DETAILS', gameId, leagueCode);

    try {
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueCode}/events`
      );

      const json = await res.json();

      // Encontrar o evento com o id do jogo
      const event = json.events?.find(e => e.id === gameId);

      if (event) {
        AppDispatcher.dispatch({
          type: 'RECEIVE_GAME_DETAILS',
          payload: event,
        });
      } else {
        console.log('SEM EVENTS');
      }

    } catch (error) {
      console.error('Erro ao buscar detalhes do jogo', error);
    }
  },
};

export default DetalhesJogosActions;
