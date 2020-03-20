import { useEffect, useCallback } from 'react';

type StoreModel = {
  store: any;
  setStore: (store: any) => void;
};

function useStoreState<T>(defaultValue: T, key: string, model: StoreModel) {
  useEffect(() => {
    model.setStore({ ...model.store, [key]: defaultValue });
  }, []);

  const setState = useCallback(
    (value: T) => {
      model.setStore({ ...model.store, [key]: value });
    },
    [key]
  );

  return [model.store[key], setState];
}

export default useStoreState;
