import { supabase } from '../services/supabase';

const USER_ID = '1';

export async function addFavorite(teamId) {
  const { data: existing } = await supabase
    .from('favoritos')
    .select('id')
    .eq('idUser', USER_ID)
    .eq('idClube', teamId)
    .single();

  if (existing) return;

  const { error } = await supabase.from('favoritos').insert({
    idUser: USER_ID,
    idClube: teamId,
  });

  if (error) {
    console.error('Erro ao adicionar favorito:', error);
  }
}

export async function removeFavorite(teamId) {
  const { error } = await supabase
    .from('favoritos')
    .delete()
    .eq('idUser', USER_ID)
    .eq('idClube', teamId);

  if (error) {
    console.error('Erro ao remover favorito:', error);
  }
}

export async function isFavorite(teamId) {
  const { data } = await supabase
    .from('favoritos')
    .select('id')
    .eq('idUser', USER_ID)
    .eq('idClube', teamId)
    .maybeSingle();

  return !!data;
}

export async function getFavoriteTeams() {
  const { data, error } = await supabase
    .from('favoritos')
    .select('idClube')
    .eq('idUser', USER_ID);

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
