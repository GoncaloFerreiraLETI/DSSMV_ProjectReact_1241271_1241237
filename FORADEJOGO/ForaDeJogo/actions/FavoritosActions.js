import { supabase } from '../services/supabase';

export async function addFavorite(userId, teamId) {
  if (!userId) return;

  const { data: existing } = await supabase
    .from('favoritos')
    .select('id')
    .eq('idUser', userId)
    .eq('idClube', teamId)
    .single();

  if (existing) return;

  const { error } = await supabase.from('favoritos').insert({
    idUser: userId,
    idClube: teamId,
  });

  if (error) console.error('Erro ao adicionar favorito:', error);
}

export async function removeFavorite(userId, teamId) {
  if (!userId) return;

  const { error } = await supabase
    .from('favoritos')
    .delete()
    .eq('idUser', userId)
    .eq('idClube', teamId);

  if (error) console.error('Erro ao remover favorito:', error);
}

export async function isFavorite(userId, teamId) {
  if (!userId) return false;

  const { data } = await supabase
    .from('favoritos')
    .select('id')
    .eq('idUser', userId)
    .eq('idClube', teamId)
    .maybeSingle();

  return !!data;
}

export async function getFavoriteTeams(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('favoritos')
    .select('idClube')
    .eq('idUser', userId);

  if (error || !data) return [];

  const teams = await Promise.all(
    data.map(async ({ idClube }) => {
      try {
        const response = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/${idClube}`
        );
        const json = await response.json();
        return json.team;
      } catch {
        return null;
      }
    })
  );

  return teams.filter(Boolean);
}
