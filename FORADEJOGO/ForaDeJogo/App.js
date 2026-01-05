import React, { useEffect, useState } from 'react';
import AppNavigator from './navigation/AppNavigator';
import AuthStore from './stores/AuthStore';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthStore.loadUserFromStorage().then(() => setLoading(false));
  }, []);

  if (loading) return null;

  return <AppNavigator />;
}
