import React from 'react';
import NAMap from './NAMap';
import { isUndef } from './util';

type HeaderFooterProps = {
  onHeightChange: (height: number) => void;
  style: React.CSSProperties;
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

type Layout = {
  height: number;
  top: number;
  type: React.ComponentType<{
    height: number;
    width: number;
    top: number;
    data: any;
    index: number;
  }>;
};

export type RenderInfo = { i: number; dom: number };

type State<T> = {
  headerHeight: number;
  footerHeight: number;
  cellData: CellData<T>[];
  layouts: Layout[];
  current: RenderInfo[];
  renderCurrent: number[];
  renderCurrentMap: NAMap;
  contentHeight: number;
};

const scrollStyle: React.CSSProperties = {
  WebkitOverflowScrolling: 'touch'
};

const headerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0
};

const footerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0
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

    return { layouts, contentHeight: totalHeight };
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
        ...RecyclerList.computedRenderCellLayouts(props),
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
    renderCurrentMap: new NAMap(),
    contentHeight: 0
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
      renderCurrentMap,
      shouldSetState: true
    };
  }

  private getRenderList(scrollTop: number) {
    const { current, headerHeight, layouts, renderCurrentMap } = this.state;
    const { height, renderAccuary = 3 } = this.props;
    const lastScrollTop = this.lastScrollTop;
    this.lastScrollTop = scrollTop;

    if (lastScrollTop === scrollTop) return null;

    const isScrollDown = lastScrollTop < scrollTop;
    const len = layouts.length;

    // 需要render真实item的区域
    const bottomOffset = ((renderAccuary - 1) / 2 + 1) * height;
    const topOffset = (height * (renderAccuary - 1)) / 2;
    const start = Math.max(0, scrollTop - topOffset) - headerHeight;
    const end = scrollTop + bottomOffset - headerHeight;

    let shouldSetState = false;

    if (current.length === 0) {
      return this.getRenderListFromEmpty(start, end);
    } else if (isScrollDown) {
      while (true) {
        const last = current[current.length - 1];
        if (last.i === len - 1) break;
        const lastLayout = layouts[last.i];
        const shouldAddNewItem = lastLayout.top + lastLayout.height >= end;
        if (shouldAddNewItem) {
          shouldSetState = true;
          const ii = last.i + 1;
          const nextItem = layouts[ii];
          const oldItem = renderCurrentMap.getFirst(nextItem.type);
          if (isUndef(typeof oldItem)) {
            const oldItemLayout = layouts[oldItem];
            const shouldReuseOldItem =
              oldItemLayout.top + oldItemLayout.height < start;
            if (shouldReuseOldItem) {
              const dom = renderCurrentMap.getDom(oldItem);
              // 移除旧的item
              renderCurrentMap.remove(oldItemLayout.type, oldItem);
              const oldIndex = current.findIndex(item => item.i === oldItem);
              current.splice(oldIndex, 1);

              // 复用旧的 item 并且插入新的item
              current.push({ i: ii, dom });
            } else {
              // 没有旧的模块可以复用，直接插入新的模块
              current.push({ i: ii, dom: current.length });
            }
          } else {
            // 没有旧的模块可以复用，直接插入新的模块
            current.push({ i: ii, dom: current.length });
          }
        } else {
          // 不需要向末尾增加模块了, 跳出循环
          break;
        }
      }
    } else {
      while (true) {
        const first = current[0];
        if (first.i === 0) break;
        const firstLayout = layouts[first.i];
        const shouldAddNewItem = firstLayout.top > start;
        if (shouldAddNewItem) {
          shouldSetState = true;
          const ii = first.i - 1;
          const nextItem = layouts[ii];
          const oldItem = renderCurrentMap.getLast(nextItem.type);
          if (isUndef(typeof oldItem)) {
            const oldItemLayout = layouts[oldItem];
            const shouldReuseOldItem = oldItemLayout.top > end;
            if (shouldReuseOldItem) {
              const dom = renderCurrentMap.getDom(oldItem);
              // 移除旧的item
              renderCurrentMap.remove(oldItemLayout.type, oldItem);
              const oldIndex = current.findIndex(item => item.i === oldItem);
              current.splice(oldIndex, 1);
              // 复用旧的 item 并且插入新的item
              current.unshift({ i: ii, dom });
            } else {
              // 没有旧的模块可以复用，直接插入新的模块
              current.unshift({ i: ii, dom: current.length });
            }
          } else {
            // 没有旧的模块可以复用，直接插入新的模块
            current.unshift({ i: ii, dom: current.length });
          }
        } else {
          // 不需要向末尾增加模块了, 跳出循环
          break;
        }
      }
    }

    const newRenderCurrent = current.sort((a, b) => a.i - b.i).map(i => i.i);

    return {
      current,
      renderCurrent: newRenderCurrent,
      renderCurrentMap,
      shouldSetState
    };
  }

  handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = this.container.current;
    if (container) {
      const { scrollTop } = container;
      const { shouldSetState, ...oterState } = this.getRenderList(scrollTop);
      if (shouldSetState) {
        this.setState(oterState);
      }
    }
  };

  render() {
    const { height, width, style, className, Header, Footer } = this.props;
    const {
      renderCurrent,
      layouts,
      contentHeight,
      headerHeight,
      footerHeight,
      cellData
    } = this.state;
    return (
      <div
        style={{ ...scrollStyle, ...style, width, height }}
        className={className}
        onScroll={this.handleScroll}
        ref={this.container}
      >
        <div
          style={{ width, height: headerHeight + footerHeight + contentHeight }}
        >
          {Header ? (
            <Header
              onHeightChange={this.handleHeaderHeightChange}
              style={headerStyle}
            />
          ) : null}
          {renderCurrent.map((layoutIndex, index) => {
            const layout = layouts[layoutIndex];
            const { type: TypeComponent, height, top } = layout;

            return (
              <TypeComponent
                height={height}
                width={width}
                top={top + headerHeight}
                index={layoutIndex}
                data={cellData[layoutIndex].data}
                key={index}
              />
            );
          })}
          {Footer ? (
            <Footer
              onHeightChange={this.handleFooterHeightChange}
              style={footerStyle}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default RecyclerList;
