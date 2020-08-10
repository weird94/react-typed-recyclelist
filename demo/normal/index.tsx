import React, { memo, useState, useEffect, useCallback } from 'react';
import List, { CellProps, CellDatas, HeaderFooterProps } from '../../src/index';
import ReactDOM from 'react-dom';

const Header = memo(({ onHeightChange, style }: HeaderFooterProps) => {
  const [height, setHeight] = useState(160);
  return (
    <div
      style={{ height: height - 10, textAlign: 'center', backgroundColor: 'green', ...style }}
      onClick={() => {
        const height1 = 160 + ~~(Math.random() * 20);
        setHeight(height1);
        onHeightChange(height1);
      }}
    >
      header
    </div>
  );
});

// @ts-ignore
Header.initHeight = 160;

const Cell = memo((props: CellProps<{ name: string }>) => {
  const { style, index } = props;
  return (
    <div
      style={{
        ...style,
        backgroundColor: 'yellow',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: +props.style.height - 10,
        marginBottom: 10,
        borderRadius: 8,
      }}
    >
      <span>{props.data.name + props.index}</span>
    </div>
  );
});

const cellData: CellDatas<{ name: string }> = Array(1000)
  .fill(1)
  .map((_, i) => {
    return {
      height: ~~(100 + Math.random() * 30),
      data: { name: `name` },
      Component: Cell,
    };
  });

const Cell2 = memo((props: CellProps<{ title: string; subTitle: string }>) => {
  useEffect(() => {
    return () => {
      console.log('componentWillUnmount');
    };
  }, []);

  return (
    <section
      style={{
        ...props.style,
        backgroundColor: 'red',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: +props.style.height - 10,
        marginBottom: 10,
        borderRadius: 8,
      }}
    >
      <h4>{props.data.title + props.index}</h4>
      <span>{props.data.subTitle + props.index}</span>
    </section>
  );
});

const cellData2: CellDatas<{ title: string; subTitle: string }> = Array(1000)
  .fill(1)
  .map((_, i) => {
    return {
      height: ~~(200 + Math.random() * 30),
      data: { title: `title`, subTitle: `subtile` },
      Component: Cell2,
    };
  });

const renderData = [...cellData, ...cellData2].sort(() => Math.random() - 0.5);

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
  const key = useResize();

  return (
    <List
      key={key}
      Header={Header}
      height={window.innerHeight}
      width={window.innerWidth}
      cellData={renderData}
      leftGap={10}
      rightGap={10}
      columnGap={10}
      columns={2}
      onCellHide={(i) => {
        // console.log('onCellHide', i);
      }}
      onCellShow={(i) => {
        // console.log('onCellShow', i);
      }}
    />
  );
};

ReactDOM.render(<Demo />, document.getElementById('root'));
