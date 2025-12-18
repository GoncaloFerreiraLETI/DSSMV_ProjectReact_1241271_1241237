const BASE_SITE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

export async function getJogosPorDia(data) {
    const res = await fetch(`${BASE_SITE}/all/scoreboard?dates=${data}`);
    return res.json();
}
