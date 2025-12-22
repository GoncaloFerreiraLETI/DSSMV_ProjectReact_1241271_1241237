import AppDispatcher from '../dispatcher/AppDispatcher';

let leagues = [];
let listeners = [];

const JogosStore = {
  getLeagues() {
    return leagues;
  },

  emitChange() {
    listeners.forEach((listener) => listener());
  },

  addChangeListener(listener) {
    listeners.push(listener);
  },

  removeChangeListener(listener) {
    listeners = listeners.filter(l => l !== listener);
  },
};

AppDispatcher.register((action) => {
  switch (action.type) {
    case 'JOGOS_LOADED':
      leagues = action.payload;
      JogosStore.emitChange();
      break;

    default:
      break;
  }
});

export default JogosStore;
