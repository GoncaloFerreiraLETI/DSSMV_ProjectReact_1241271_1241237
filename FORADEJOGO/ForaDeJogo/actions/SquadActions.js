import AppDispatcher from '../dispatcher/AppDispatcher';
import { supabase } from '../services/supabase';

export const SquadActionTypes = {
  LOADING: 'LOADING',

  SET_SQUADS: 'SET_SQUADS',
  ADD_SQUAD: 'ADD_SQUAD',
  REMOVE_SQUAD: 'REMOVE_SQUAD',

  SET_SQUAD_PLAYERS: 'SET_SQUAD_PLAYERS',
};

export async function loadSquads(userId) {
  AppDispatcher.dispatch({ type: SquadActionTypes.LOADING });

  const { data } = await supabase
    .from('squads')
    .select('*')
    .eq('userId', userId);

  AppDispatcher.dispatch({
    type: SquadActionTypes.SET_SQUADS,
    squads: data || [],
  });
}

export async function createSquad(payload) {
  const { data, error } = await supabase
    .from('squads')
    .insert(payload)
    .select()
    .single();

  if (!error) {
    AppDispatcher.dispatch({
      type: SquadActionTypes.ADD_SQUAD,
      squad: data,
    });
  }

  return data;
}

export async function deleteSquad(squadId) {
  await supabase.from('squad_players').delete().eq('squadId', squadId);
  await supabase.from('squads').delete().eq('id', squadId);

  AppDispatcher.dispatch({
    type: SquadActionTypes.REMOVE_SQUAD,
    squadId,
  });
}

export async function loadSquadPlayers(squadId) {
  AppDispatcher.dispatch({ type: SquadActionTypes.LOADING });

  const { data } = await supabase
    .from('squad_players')
    .select('*')
    .eq('squadId', squadId);

  AppDispatcher.dispatch({
    type: SquadActionTypes.SET_SQUAD_PLAYERS,
    players: data || [],
  });
}

export async function saveSquadPlayers(squadId, positions) {
  const { data: dbRows } = await supabase
    .from('squad_players')
    .select('*')
    .eq('squadId', squadId);

  const dbByPos = {};
  dbRows.forEach(r => (dbByPos[r.position] = r));

  for (const pos of positions) {
    const dbRow = dbByPos[pos.fullCode];

    if (!pos.player && dbRow) {
      await supabase.from('squad_players').delete().eq('id', dbRow.id);
    }

    if (pos.player && !dbRow) {
      await supabase.from('squad_players').insert({
        squadId,
        playerId: pos.player.id,
        position: pos.fullCode,
      });
    }

    if (pos.player && dbRow && String(dbRow.playerId) !== String(pos.player.id)) {
      await supabase
        .from('squad_players')
        .update({ playerId: pos.player.id })
        .eq('id', dbRow.id);
    }
  }
}
