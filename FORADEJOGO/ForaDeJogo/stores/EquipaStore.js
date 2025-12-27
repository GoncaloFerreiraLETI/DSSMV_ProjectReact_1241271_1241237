import AppDispatcher from '../dispatcher/AppDispatcher';

let squadByPosition = {};
let listeners = [];

const POSITION_ORDER = [
  'Goalkeeper',
  'Defender',
  'Midfielder',
  'Forward',
];

function groupByPosition(players = []) {
  const grouped = {};

  players.forEach((player) => {
    const position = player.position?.displayName || 'Other';

    if (!grouped[position]) {
      grouped[position] = [];
    }

    grouped[position].push(player);
  });

  return grouped;
}

const TeamStore = {
  getSquad() {
    return squadByPosition;
  },

  subscribe(fn) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};

AppDispatcher.register((action) => {
  if (action.type === 'TEAM_CLEAR') {
    squadByPosition = {};
    listeners.forEach((l) => l());
  }

  if (action.type === 'TEAM_LOADED') {
    const players = action.payload?.athletes || [];

    const grouped = groupByPosition(players);

    const ordered = {};

    POSITION_ORDER.forEach((pos) => {
      if (grouped[pos]) {
        ordered[pos] = grouped[pos].sort((a, b) => (a.jersey || 0) - (b.jersey || 0));
      }
    });

    Object.keys(grouped).forEach((pos) => {
      if (!ordered[pos]) {
        ordered[pos] = grouped[pos].sort((a, b) => (a.jersey || 0) - (b.jersey || 0));
      }
    });

    squadByPosition = ordered;
    listeners.forEach((l) => l());
  }
});

export default TeamStore;
