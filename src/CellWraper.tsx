import React, { useMemo } from 'react';
import { CellWrapperProps } from './index';

const CellWrapper = (props: CellWrapperProps & { Component: React.ComponentType<any> }) => {
  const { height, width, top, data, index, Component } = props;
  const style = useMemo(() => ({ height, width, top, position: 'absolute' }), [height, width, top]);

  return <Component style={style} data={data} index={index} />;
};

export default CellWrapper;
