import { useEffect, useCallback } from 'react';

type StoreModel = {
  store: any;
  setStore: (store: any) => void;
};

function useStoreState<T>(defaultValue: T, key: string, model: StoreModel) {
  const { store } = model;
  useEffect(() => {
    if (store === undefined) {
      model.setStore({ ...store, [key]: defaultValue });
    }
  }, [store]);

  const setState = useCallback(
    (value: T) => {
      model.setStore({ ...store, [key]: value });
    },
    [key, model.setStore]
  );

  return [store && store[key], setState];
}

export default useStoreState;
