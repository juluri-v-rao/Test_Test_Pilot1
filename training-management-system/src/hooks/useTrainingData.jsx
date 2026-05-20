import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getTrainingData, subscribeTrainingData } from '../services/api.js';

const TrainingDataContext = createContext(null);

export function TrainingDataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    try {
      const next = await getTrainingData();
      setData(next);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load training data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    return subscribeTrainingData(refresh);
  }, []);

  const value = useMemo(() => ({ data, loading, error, refresh }), [data, loading, error]);
  return <TrainingDataContext.Provider value={value}>{children}</TrainingDataContext.Provider>;
}

export function useTrainingData() {
  const value = useContext(TrainingDataContext);
  if (!value) throw new Error('useTrainingData must be used inside TrainingDataProvider');
  return value;
}
