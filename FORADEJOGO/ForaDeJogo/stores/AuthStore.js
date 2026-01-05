import AsyncStorage from '@react-native-async-storage/async-storage';

let user = null;
let loading = false;
let error = null;
let listeners = [];

const AuthStore = {
  getUser() {
    return user;
  },

  isLoading() {
    return loading;
  },

  getError() {
    return error;
  },

  setUser(u) {
    user = u;
    listeners.forEach((l) => l());
    AsyncStorage.setItem('user', JSON.stringify(u));
  },

  setLoading(l) {
    loading = l;
    listeners.forEach((l) => l());
  },

  setError(e) {
    error = e;
    listeners.forEach((l) => l());
  },

  async loadUserFromStorage() {
    const data = await AsyncStorage.getItem('user');
    if (data) {
      user = JSON.parse(data);
      listeners.forEach((l) => l());
    }
  },

  async logout() {
    user = null;
    listeners.forEach((l) => l());
    await AsyncStorage.removeItem('user');
  },

  addChangeListener(listener) {
    listeners.push(listener);
  },

  removeChangeListener(listener) {
    listeners = listeners.filter((l) => l !== listener);
  },
};

export default AuthStore;
