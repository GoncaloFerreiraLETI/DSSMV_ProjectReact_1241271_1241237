import AppDispatcher from '../dispatcher/AppDispatcher';

const LEAGUES = [
    'uefa.champions', 'uefa.europa', 'uefa.europa.conf', 'uefa.nations',
    'fifa.world', 'eng.1', 'eng.2', 'esp.1', 'ger.1', 'ita.1',
    'fra.1', 'por.1', 'por.taca.portugal', 'bra.1'
];

const LigaActions = {
    fetchLeagues: async () => {
        try {
            const leaguesData = await Promise.all(
                LEAGUES.map(async (code) => {
                    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/soccer/leagues/${code}`);
                    const data = await res.json();
                    return {
                        code,
                        name: data.displayName || data.name,
                        logo: data.logos?.[0]?.href
                    };
                })
            );

            AppDispatcher.dispatch({
                type: 'RECEIVE_LEAGUES',
                leagues: leaguesData
            });
        } catch (error) {
            console.error('Erro ao buscar ligas:', error);
            AppDispatcher.dispatch({
                type: 'LEAGUES_ERROR',
                error
            });
        }
    }
};

export default LigaActions;
