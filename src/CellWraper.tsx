import React, { useMemo, useCallback, useState } from 'react';
import { CellWrapperProps } from './index';

const CellWrapper = (props: CellWrapperProps & { Component: React.ComponentType<any> }) => {
  const [, setKey] = useState(0);
  const { height, width, top, data, index, Component, uniqueKey } = props;

  const storeKey = uniqueKey == undefined ? index : uniqueKey;

  const style = useMemo(() => ({ height, width, top, position: 'absolute' }), [height, width, top]);
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
      store={props.stores[storeKey] || {}}
      setStore={setStore}
      _setStore={props.setStore}
    />
  );
};

export default CellWrapper;
