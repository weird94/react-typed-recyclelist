import React from 'react';
import { CellWrapperProps } from './index';
import useObject from './useObject';

const CellWrapper = (props: CellWrapperProps & { Component: React.ComponentType<any> }) => {
  const { height, width, top, data, index, left, Component, uniqueKey, cellExtraProps } = props;
  const storeKey = uniqueKey == undefined ? index : uniqueKey;
  const style = useObject({ height, width, top, left, position: 'absolute' });

  console.log('props', props);

  return (
    <Component
      style={style}
      data={data}
      index={index}
      uniqueKey={storeKey}
      cellExtraProps={cellExtraProps}
    />
  );
};

export default CellWrapper;
