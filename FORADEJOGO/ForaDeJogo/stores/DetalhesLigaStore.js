import EventEmitter from 'eventemitter3';
import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';
let _table = [];

const DetalhesLigaStore = new EventEmitter();

DetalhesLigaStore.getTable = () => _table;

DetalhesLigaStore.addChangeListener = (cb) => DetalhesLigaStore.on(CHANGE_EVENT, cb);
DetalhesLigaStore.removeChangeListener = (cb) => DetalhesLigaStore.off(CHANGE_EVENT, cb);

AppDispatcher.register((action) => {
  if (action.type === 'RECEIVE_TABLE') {
    _table = action.table;
    DetalhesLigaStore.emit(CHANGE_EVENT);
  }
});

export default DetalhesLigaStore;
