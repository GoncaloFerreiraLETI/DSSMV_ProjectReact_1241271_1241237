class Dispatcher {
    constructor() {
        this._callbacks = [];
    }

    register(callback) {
        this._callbacks.push(callback);
        return this._callbacks.length - 1;
    }

    dispatch(action) {
        for (const cb of this._callbacks) {
            cb(action);
        }
    }
}

const AppDispatcher = new Dispatcher();
export default AppDispatcher;
