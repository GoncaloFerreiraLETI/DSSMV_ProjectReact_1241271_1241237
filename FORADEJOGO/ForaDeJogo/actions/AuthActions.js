import AuthStore from '../stores/AuthStore';
import { supabase } from '../services/supabase';

export default {
  async login(email, password) {
    AuthStore.setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        AuthStore.setError('Email ou password inválidos');
      } else {
        AuthStore.setUser(data);
        AuthStore.setError(null);
      }
    } catch (err) {
      AuthStore.setError('Erro ao entrar');
    } finally {
      AuthStore.setLoading(false);
    }
  },

  async register(username, email, password) {
    AuthStore.setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, email, password }])
        .select()
        .single();

      if (error) {
        AuthStore.setError('Erro ao criar conta');
      } else {
        AuthStore.setUser(data);
        AuthStore.setError(null);
      }
    } catch (err) {
      AuthStore.setError('Erro ao criar conta');
    } finally {
      AuthStore.setLoading(false);
    }
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    AuthStore.setUser(data);
  },

  logout() {
    AuthStore.logout();
  },
};
