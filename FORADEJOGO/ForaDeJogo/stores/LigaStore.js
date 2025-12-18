// /stores/LeagueStore.js
import EventEmitter from 'eventemitter3';
import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';
let _leagues = [];

const LigaStore = new EventEmitter();

LigaStore.getLeagues = () => _leagues;

LigaStore.emitChange = () => LigaStore.emit(CHANGE_EVENT);
LigaStore.addChangeListener = (callback) => LigaStore.on(CHANGE_EVENT, callback);
LigaStore.removeChangeListener = (callback) => LigaStore.off(CHANGE_EVENT, callback);

// Dispatcher
AppDispatcher.register((action) => {
    switch(action.type) {
        case 'RECEIVE_LEAGUES':
            _leagues = action.leagues;
            LigaStore.emitChange();
            break;
        default:
            break;
    }
});

export default LigaStore;
