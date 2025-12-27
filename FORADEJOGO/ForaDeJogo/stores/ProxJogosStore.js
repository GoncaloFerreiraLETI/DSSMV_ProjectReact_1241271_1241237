import AppDispatcher from '../dispatcher/AppDispatcher';

let games = [];
let listeners = [];

const ProxJogosStore = {
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
  if (action.type === 'NEXT_GAMES_LOADED') {
    games = action.payload;
    listeners.forEach(l => l());
  }
});

export default ProxJogosStore;
