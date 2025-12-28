import EventEmitter from 'eventemitter3';
import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';
let _game = null;

const DetalhesJogoStore = new EventEmitter();

DetalhesJogoStore.getGame = () => _game;

DetalhesJogoStore.emitChange = () => DetalhesJogoStore.emit(CHANGE_EVENT);
DetalhesJogoStore.addChangeListener = (cb) => DetalhesJogoStore.on(CHANGE_EVENT, cb);
DetalhesJogoStore.removeChangeListener = (cb) => DetalhesJogoStore.off(CHANGE_EVENT, cb);

AppDispatcher.register((action) => {
  switch(action.type) {
    case 'RECEIVE_GAME_DETAILS':
      _game = action.payload;
      DetalhesJogoStore.emitChange();
      break;
    default:
      break;
  }
});

export default DetalhesJogoStore;
