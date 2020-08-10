import React, { useMemo, useCallback, useState } from 'react';
import { CellWrapperProps } from './index';

const CellWrapper = (props: CellWrapperProps & { Component: React.ComponentType<any> }) => {
  const [, setKey] = useState(0);
  const { height, width, top, data, index, left, Component, uniqueKey } = props;

  const storeKey = uniqueKey == undefined ? index : uniqueKey;

  const style = useMemo(() => ({ height, width, top, left, position: 'absolute' }), [
    height,
    width,
    top,
    left,
  ]);
  const setStore = useCallback(
    (store: any) => {
      props.setStore(store, storeKey);
      setKey(Date.now());
    },
    [storeKey]
  );

  return (
    <Component
      style={style}
      data={data}
      index={index}
      store={props.stores[storeKey]}
      uniqueKey={storeKey}
      setStore={setStore}
      _setStore={props.setStore}
    />
  );
};

export default CellWrapper;
