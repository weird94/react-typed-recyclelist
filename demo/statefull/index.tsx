import React, { memo } from 'react';
import List, { CellProps, CellDatas } from '../../src/index';
import useStoreState from '../../src/useStoreState';
import ReactDOM from 'react-dom';

const cellStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column'
};

const Cell = memo((props: CellProps<{ name: string }>) => {
  const [active, setActive] = useStoreState(false, 'active', props);
  const { style, index } = props;

  const bgColor = index % 2 === 0 ? 'white' : 'yellow';

  // console.log('p', props);

  return (
    <div
      style={{ ...cellStyle, ...style, backgroundColor: bgColor }}
      onClick={() => setActive(!active)}
    >
      <div
        style={{
          color: active ? 'red' : 'black',
          fontWeight: active ? 'bolder' : 'normal'
        }}
      >
        [{index}] active: <span>{active + ''}</span>
      </div>
    </div>
  );
});

const cellData: CellDatas<{ name: string }> = Array(1000)
  .fill(1)
  .map((_, i) => {
    return {
      height: 100,
      data: { name: `name` },
      Component: Cell
    };
  });

const Demo = () => {
  return <List height={screen.height} width={screen.width} cellData={cellData} />;
};

ReactDOM.render(<Demo />, document.getElementById('root'));
