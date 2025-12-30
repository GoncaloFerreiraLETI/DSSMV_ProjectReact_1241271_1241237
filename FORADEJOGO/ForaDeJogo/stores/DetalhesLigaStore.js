import EventEmitter from 'eventemitter3';
import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

let _table = [];
let _homeTable = [];
let _awayTable = [];
let _topScorers = [];

const DetalhesLigaStore = new EventEmitter();

DetalhesLigaStore.getTable = () => _table;
DetalhesLigaStore.getHomeTable = () => _homeTable;
DetalhesLigaStore.getAwayTable = () => _awayTable;
DetalhesLigaStore.getTopScorers = () => _topScorers;

DetalhesLigaStore.addChangeListener = (cb) => DetalhesLigaStore.on(CHANGE_EVENT, cb);
DetalhesLigaStore.removeChangeListener = (cb) => DetalhesLigaStore.off(CHANGE_EVENT, cb);

AppDispatcher.register((action) => {
  switch (action.type) {
    case 'RECEIVE_TABLE':
      _table = action.table;
      DetalhesLigaStore.emit(CHANGE_EVENT);
      break;
    case 'RECEIVE_HOME_POINTS':
      _homeTable = action.table;
      DetalhesLigaStore.emit(CHANGE_EVENT);
      break;
    case 'RECEIVE_AWAY_POINTS':
      _awayTable = action.table;
      DetalhesLigaStore.emit(CHANGE_EVENT);
      break;
    case 'RECEIVE_TOP_SCORERS':
      _topScorers = action.players;
      DetalhesLigaStore.emit(CHANGE_EVENT);
      break;
    default:
      break;
  }
});

export default DetalhesLigaStore;
