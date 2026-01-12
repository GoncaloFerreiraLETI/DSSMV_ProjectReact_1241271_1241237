import AppDispatcher from '../dispatcher/AppDispatcher';
import { SquadActionTypes } from '../actions/SquadActions';

class SquadStore {
  squads = [];
  squadPlayers = [];
  loading = false;
  listeners = [];

  emit() {
    this.listeners.forEach(l => l());
  }

  addChangeListener(cb) {
    this.listeners.push(cb);
  }

  removeChangeListener(cb) {
    this.listeners = this.listeners.filter(l => l !== cb);
  }

  getSquads() {
    return this.squads;
  }

  getSquadPlayers() {
    return this.squadPlayers;
  }

  isLoading() {
    return this.loading;
  }
}

const store = new SquadStore();

AppDispatcher.register(action => {
  switch (action.type) {
    case SquadActionTypes.LOADING:
      store.loading = true;
      store.emit();
      break;

    case SquadActionTypes.SET_SQUADS:
      store.squads = action.squads;
      store.loading = false;
      store.emit();
      break;

    case SquadActionTypes.ADD_SQUAD:
      store.squads = [...store.squads, action.squad];
      store.emit();
      break;

    case SquadActionTypes.REMOVE_SQUAD:
      store.squads = store.squads.filter(s => s.id !== action.squadId);
      store.emit();
      break;

    case SquadActionTypes.SET_SQUAD_PLAYERS:
      store.squadPlayers = action.players;
      store.loading = false;
      store.emit();
      break;
  }
});

export default store;
