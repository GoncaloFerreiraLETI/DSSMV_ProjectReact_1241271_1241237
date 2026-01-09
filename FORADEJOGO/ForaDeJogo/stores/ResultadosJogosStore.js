import AppDispatcher from '../dispatcher/AppDispatcher';

let games = [];
let listeners = [];

const ResultadosJogosStore = {
  getGames() {
    return games;
  },

  subscribe(fn) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(l => l !== fn);
    };
  },
};

AppDispatcher.register(action => {
  if (action.type === 'RESULTS_GAMES_LOADED') {
    games = action.payload;
    listeners.forEach(l => l());
  }
});

export default ResultadosJogosStore;
