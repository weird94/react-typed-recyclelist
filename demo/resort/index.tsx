import React, { memo, useState, useCallback, useEffect } from 'react';
import List, { CellProps, CellDatas } from '../../src/index';
import useStoreState from '../../src/useStoreState';
import ReactDOM from 'react-dom';

const cellStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
};

const Cell = memo((props: CellProps<{ name: string; index: number }>) => {
  const [active, setActive] = useStoreState(false, 'active', props);
  const { style, index, data } = props;

  const bgColor = index % 2 === 0 ? 'white' : 'yellow';

  return (
    <div
      style={{ ...cellStyle, ...style, backgroundColor: bgColor }}
      onClick={() => setActive(!active)}
    >
      <div
        style={{
          color: active ? 'red' : 'black',
          fontWeight: active ? 'bolder' : 'normal',
        }}
      >
        [{data.index}] active: <span>{active + ''}</span>
      </div>
    </div>
  );
});

const cellData: CellDatas<{ name: string; index: number }> = Array(1000)
  .fill(1)
  .map((_, i) => {
    return {
      height: 100,
      data: { name: `name`, index: i },
      Component: Cell,
      uniqueKey: i + '',
    };
  });

const useResize = () => {
  const [key, setKey] = useState(0);
  const resizeHandler = useCallback(() => {
    setKey(Math.random());
  }, []);
  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return key;
};

const Demo = () => {
  const [data, setData] = useState(cellData);
  const [sortKey, setSortKey] = useState('0');
  const key = useResize();

  const reverse = () => {
    data.reverse();
    setData([...data]);
    setSortKey(Date.now() + '');
  };

  return (
    <>
      <div
        style={{
          width: 80,
          height: 50,
          backgroundColor: 'yellow',
          textAlign: 'center',
          lineHeight: '50px',
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 100,
        }}
        onClick={reverse}
      >
        reverse
      </div>
      <List
        key={key}
        height={window.innerHeight}
        width={window.innerWidth}
        cellData={data}
        sortKey={sortKey}
      />
    </>
  );
};

ReactDOM.render(<Demo />, document.getElementById('root'));
