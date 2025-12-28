import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vztmutuzpxmkfunxwaew.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_agkPrX8PtfwOtuF8CeT1JQ_zR3sEFIy';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        realtime: {
            enabled: false,
        },
    }
);
