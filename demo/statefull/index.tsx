import React, { memo, useState, useEffect, useCallback } from 'react';
import List, { CellProps, CellDatas } from '../../src/index';
import ReactDOM from 'react-dom';

const cellStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
};

const Cell = memo((props: CellProps<{ name: string; active?: boolean }>) => {
  const {
    style,
    index,
    data: { active },
    cellExtraProps: setActive,
  } = props;

  const bgColor = index % 2 === 0 ? 'white' : 'yellow';

  return (
    <div
      style={{ ...cellStyle, ...style, backgroundColor: bgColor }}
      onClick={() => {
        setActive(index, !active);
      }}
    >
      <div
        style={{
          color: active ? 'red' : 'black',
          fontWeight: active ? 'bolder' : 'normal',
        }}
      >
        [{index}] active: <span>{active + ''}</span>
      </div>
    </div>
  );
});

const cellData: CellDatas<{ name: string; active?: boolean }> = Array(1000)
  .fill(1)
  .map((_, i) => {
    return {
      height: 100,
      data: { name: `name` },
      Component: Cell,
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
  const key = useResize();

  const setCellActive = useCallback(
    (index: number, active: boolean) => {
      data[index] = {
        ...data[index],
        data: {
          ...data[index].data,
          active,
        },
      };
      console.log('data', data);
      setData(data);
    },
    [data]
  );

  return (
    <List
      key={key}
      height={window.innerHeight}
      width={window.innerWidth}
      cellData={data}
      cellExtraProps={setCellActive}
    />
  );
};

ReactDOM.render(<Demo />, document.getElementById('root'));
