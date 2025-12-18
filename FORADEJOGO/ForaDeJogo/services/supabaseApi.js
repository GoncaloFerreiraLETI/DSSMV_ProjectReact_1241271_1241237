const BASE_URL = 'https://vztmutuzpxmkfunxwaew.supabase.co/rest/v1';
const API_KEY = 'SUA_KEY';

export async function getSquads(userId) {
    const res = await fetch(`${BASE_URL}/squads?userId=eq.${userId}`, {
        headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
        },
    });
    return res.json();
}
