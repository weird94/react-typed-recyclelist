import React, { memo } from 'react';
import List, { CellProps, CellData } from '../src/index';
import ReactDOM from 'react-dom';

const Cell = memo((props: CellProps<{ name: string }>) => {
  const { width, height, top, index } = props;
  return (
    <div
      style={{
        width,
        height,
        top,
        position: 'absolute',
        backgroundColor: index % 2 === 0 ? 'white' : 'yellow'
      }}
    >
      {props.data.name}
    </div>
  );
});

const cellData: CellData<{ name: string }>[] = Array(1000)
  .fill(1)
  .map((_, i) => {
    return {
      height: ~~(100 + Math.random() * 30),
      data: { name: `name-${i}` },
      Component: Cell
    };
  });

const Demo = () => {
  return (
    <List height={screen.height} width={screen.width} cellData={cellData} />
  );
};

ReactDOM.render(<Demo />, document.getElementById('root'));
