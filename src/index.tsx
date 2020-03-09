import React from 'react';
import NAMap from './NAMap';
import { isUndef } from './util';

type HeaderFooterProps = {
  onHeightChange: (height: number) => void;
};

export type CellData<T> = {
  height: number;
  data: T;
  Component: React.ComponentType<{
    height: number;
    width: number;
    top: number;
    data: T;
    index: number;
  }>;
};

export type RecyclerListProps<T> = {
  Header?: React.ComponentType<HeaderFooterProps>;
  Footer?: React.ComponentType<HeaderFooterProps>;
  cellData: CellData<T>[];
  height: number;
  width: number;
  style?: React.CSSProperties;
  className?: string;
  onCellClick?: (cellData: CellData<T>, index: number) => void;
  renderAccuary?: number;
};

type Layout = { height: number; top: number; type: React.ComponentType };

export type RenderInfo = { i: number; dom: number };

type State<T> = {
  headerHeight: number;
  footerHeight: number;
  cellData: CellData<T>[];
  layouts: Layout[];
  current: RenderInfo[];
  renderCurrent: number[];
  renderCurrentMap: NAMap;
};

const scrollStyle: React.CSSProperties = {
  WebkitOverflowScrolling: 'touch'
};

class RecyclerList<T> extends React.Component<RecyclerListProps<T>, State<T>> {
  static computedRenderCellLayouts<T>(props: RecyclerListProps<T>) {
    const layouts: Layout[] = [];
    let totalHeight = 0;

    for (let i = 0, len = props.cellData.length; i < len; i++) {
      const { height, Component } = props.cellData[i];
      layouts.push({ height, top: totalHeight, type: Component });
      totalHeight += height;
    }

    return layouts;
  }

  static getDerivedStateFromProps<T>(
    props: RecyclerListProps<T>,
    state: State<T>
  ) {
    if (
      props.cellData === state.cellData &&
      props.cellData.length === state.cellData.length
    ) {
      return null;
    } else {
      return {
        layouts: RecyclerList.computedRenderCellLayouts(props),
        cellData: props.cellData
      };
    }
  }

  state: State<T> = {
    // @ts-ignore
    headerHeight: this.props.Header?.initHeight || 0,
    // @ts-ignore
    footerHeight: this.props.Footer?.initHeight || 0,
    cellData: [],
    layouts: [],
    current: [],
    renderCurrent: [],
    renderCurrentMap: new NAMap()
  };

  lastScrollTop: number = 0;

  container = React.createRef<HTMLDivElement>();

  handleHeaderHeightChange = (height: number) => {
    this.setState({ headerHeight: height });
  };

  handleFooterHeightChange = (height: number) => {
    this.setState({ footerHeight: height });
  };

  private getRenderListFromEmpty(start: number, end: number) {
    const { layouts, renderCurrentMap } = this.state;
    const len = layouts.length;

    let startIndex: number, endIndex: number;
    for (let i = 0; i < len; i++) {
      const cell = layouts[i];

      if (startIndex === undefined) {
        if (cell.top + cell.height >= start) {
          startIndex = i;
        }
      } else {
        if (cell.top >= end) {
          endIndex = i - 1;
          break;
        }
      }
    }
    if (endIndex === undefined) {
      endIndex = len - 1;
    }

    const newCurrent: RenderInfo[] = [];
    const newRenderCurrent: number[] = [];

    for (let i = startIndex; i <= endIndex; i++) {
      newCurrent.push({ i, dom: i - startIndex });
      newRenderCurrent.push(i);
      renderCurrentMap.push({
        i,
        dom: i - startIndex,
        type: layouts[i].type
      });
    }

    return {
      current: newCurrent,
      renderCurrent: newRenderCurrent,
      renderCurrentMap
    };
  }

  private getRenderList(scrollTop: number) {
    const {
      current,
      renderCurrent,
      headerHeight,
      layouts,
      renderCurrentMap
    } = this.state;
    const { height, renderAccuary = 3 } = this.props;
    const itemCount = layouts.length;
    const lastScrollTop = this.lastScrollTop;
    this.lastScrollTop = scrollTop;

    if (lastScrollTop === scrollTop) return null;

    const isScrollDown = lastScrollTop < scrollTop;
    const len = layouts.length;

    // 需要render真实item的区域
    const bottomOffset = ((renderAccuary - 1) / 2 + 1) * height;
    const topOffset = (height * (renderAccuary - 1)) / 2;
    const start = Math.max(0, scrollTop - topOffset);
    const end = scrollTop + bottomOffset;

    if (current.length === 0) {
      return this.getRenderListFromEmpty(start, end);
    } else if (isScrollDown) {
      while (true) {
        const last = current[current.length - 1];
        const lastLayout = layouts[last.i];
        const shouldAddNewItem = lastLayout.top + lastLayout.height >= end;
        if (shouldAddNewItem) {
          const nextItem = layouts[last.i + 1];
          const oldItem = renderCurrentMap.getFirst(nextItem.type);
          if (oldItem) {
            const oldItemLayout = layouts[oldItem];
            const shouldReuseOldItem =
              oldItemLayout.top + oldItemLayout.height < start;
            if (shouldReuseOldItem) {
              renderCurrentMap.remove(oldItemLayout.type, oldItem);
            }
          }
        } else {
          break;
        }
      }
    } else {
    }
  }

  handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = this.container.current;
    if (container) {
      const { scrollTop } = container;
    }
  };

  render() {
    const { height, width, style, className, Header, Footer } = this.props;
    return (
      <div
        style={{ ...scrollStyle, ...style, width, height }}
        className={className}
        onScroll={this.handleScroll}
        ref={this.container}
      >
        {Header ? (
          <Header onHeightChange={this.handleHeaderHeightChange} />
        ) : null}
        {Footer ? (
          <Footer onHeightChange={this.handleFooterHeightChange} />
        ) : null}
      </div>
    );
  }
}

export default RecyclerList;
