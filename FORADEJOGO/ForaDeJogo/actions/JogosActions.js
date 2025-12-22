import AppDispatcher from '../dispatcher/AppDispatcher';
import dayjs from 'dayjs';

const LEAGUES = [
  'uefa.champions',
  'uefa.europa',
  'uefa.europa.conf',
  'uefa.nations',
  'fifa.world',
  'eng.1',
  'eng.2',
  'esp.1',
  'ger.1',
  'ita.1',
  'fra.1',
  'por.1',
  'por.taca.portugal',
  'bra.1'
];

export default {
  async fetchGamesByDate(date) {
    try {
      const formattedDate = dayjs(date).format('YYYYMMDD');
      const results = [];

      for (const leagueCode of LEAGUES) {
        const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueCode}/scoreboard?dates=${formattedDate}`;

        const response = await fetch(url);
        const json = await response.json();

        if (json?.events?.length > 0) {
          results.push({
            league: {
              code: leagueCode,
              name: json.leagues?.[0]?.name ?? leagueCode,
              logo: json.leagues?.[0]?.logos?.[0]?.href ?? null,
            },
            games: json.events,
          });
        }
      }

      AppDispatcher.dispatch({
        type: 'JOGOS_LOADED',
        payload: results,
      });
    } catch (error) {
      console.error('Erro ao carregar jogos', error);
    }
  },
};
