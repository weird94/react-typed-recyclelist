import React from 'react';
import NAMap from './NAMap';
import { isUndef, getLogObject } from './util';

type HeaderFooterProps = {
  onHeightChange: (height: number) => void;
  style: React.CSSProperties;
};

export type CellProps<T> = {
  height: number;
  width: number;
  top: number;
  data: T;
  index: number;
};

export type CellData<T> = {
  height: number;
  data: T;
  Component: React.ComponentType<CellProps<T>>;
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
  renderCurrent: number[];
  contentHeight: number;
};

const scrollStyle: React.CSSProperties = {
  WebkitOverflowScrolling: 'touch',
  overflowX: 'hidden',
  overflowY: 'scroll'
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

  static getDerivedStateFromProps<T>(props: RecyclerListProps<T>, state: State<T>) {
    if (props.cellData === state.cellData && props.cellData.length === state.cellData.length) {
      return null;
    } else {
      return {
        ...RecyclerList.computedRenderCellLayouts(props),
        cellData: props.cellData
      };
    }
  }

  current: RenderInfo[] = [];
  topRemoveMap: NAMap = new NAMap();
  bottomRemoveMap: NAMap = new NAMap();

  state: State<T> = {
    // @ts-ignore
    headerHeight: this.props.Header?.initHeight || 0,
    // @ts-ignore
    footerHeight: this.props.Footer?.initHeight || 0,
    cellData: [],
    layouts: [],
    renderCurrent: [],
    contentHeight: 0
  };

  componentDidMount() {
    this.handleScroll(10000);
  }

  lastScrollTop: number = NaN;

  container = React.createRef<HTMLDivElement>();

  handleHeaderHeightChange = (height: number) => {
    this.setState({ headerHeight: height });
  };

  handleFooterHeightChange = (height: number) => {
    this.setState({ footerHeight: height });
  };

  private getRenderListFromEmpty(start: number, end: number) {
    const { layouts } = this.state;
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
    }

    this.current = newCurrent;

    return {
      renderCurrent: newRenderCurrent,
      shouldSetState: true
    };
  }

  private getRenderList(scrollTop: number) {
    const { headerHeight, layouts } = this.state;
    const { current } = this;
    const { height, renderAccuary = 3 } = this.props;
    const lastScrollTop = this.lastScrollTop;
    this.lastScrollTop = scrollTop;

    if (lastScrollTop === scrollTop) return null;

    const isScrollDown = lastScrollTop <= scrollTop;
    const len = layouts.length;

    // 需要render真实item的区域
    const bottomOffset = ((renderAccuary - 1) / 2 + 1) * height;
    const topOffset = (height * (renderAccuary - 1)) / 2;

    const start = Math.max(0, scrollTop - topOffset - headerHeight);
    const end = scrollTop + bottomOffset - headerHeight;

    let shouldSetState = false;

    if (current.length === 0) {
      return this.getRenderListFromEmpty(start, end);
    } else if (isScrollDown) {
      let isBreak = false;
      for (let i = 0, len = current.length; i < len; i++) {
        const thisCurrent = current[i];
        const thisLayout = layouts[thisCurrent.i];
        if (thisLayout.top + thisLayout.height < start) {
          this.topRemoveMap.push({
            i: thisCurrent.i,
            dom: thisCurrent.dom,
            type: thisLayout.type
          });
        } else {
          current.splice(0, i);
          isBreak = true;
          break;
        }
      }

      if (!isBreak) {
        current.splice(0, current.length);
      }

      while (true) {
        const last = current[current.length - 1];

        if (last.i === len - 1) break;
        const lastLayout = layouts[last.i];
        const shouldAddNewItem = lastLayout.top + lastLayout.height < end;
        const ii = last.i + 1;
        const nextItem = layouts[ii];

        if (shouldAddNewItem) {
          shouldSetState = true;
          let oldItem: number | undefined;
          let shouldReuseOldItem = false;
          let oldRenderInfo: RenderInfo | undefined = undefined;
          const bottomOldItem = this.bottomRemoveMap.getFirst(nextItem.type);
          if (bottomOldItem !== undefined) {
            oldItem = bottomOldItem;
            shouldReuseOldItem = true;
            oldRenderInfo = this.bottomRemoveMap.remove(nextItem.type, bottomOldItem);
          } else {
            const topOldItem = this.topRemoveMap.getFirst(nextItem.type);
            if (topOldItem !== undefined) {
              oldItem = topOldItem;
              const oldItemLayout = layouts[topOldItem];
              shouldReuseOldItem = oldItemLayout.top + oldItemLayout.height < start;
              if (shouldReuseOldItem) {
                oldRenderInfo = this.topRemoveMap.remove(nextItem.type, topOldItem);
              }
            }
          }

          if (shouldReuseOldItem) {
            current.push({ i: ii, dom: oldRenderInfo.dom });
            continue;
          }
          // 没有旧的模块可以复用，直接插入新的模块
          current.push({ i: ii, dom: current.length });
        } else {
          // 不需要向末尾增加模块了, 跳出循环
          break;
        }
      }
    } else if (!isScrollDown) {
      let isBreak = false;
      for (let i = current.length - 1; i > -1; i--) {
        const thisCurrent = current[i];

        const thisLayout = layouts[thisCurrent.i];
        if (thisLayout.top > end) {
          this.bottomRemoveMap.push({
            i: thisCurrent.i,
            dom: thisCurrent.dom,
            type: thisLayout.type
          });
        } else {
          current.splice(i + 1, current.length - i - 1);
          isBreak = true;
          break;
        }
      }

      if (!isBreak) {
        // 全部删除
        current.splice(0, current.length);
      }

      while (true) {
        const first = current[0];
        if (first.i === 0) break;
        const firstLayout = layouts[first.i];
        const shouldAddNewItem = firstLayout.top + firstLayout.height > start;
        const ii = first.i - 1;
        const nextItem = layouts[ii];

        if (shouldAddNewItem) {
          shouldSetState = true;
          let shouldReuseOldItem = false;
          let oldRenderInfo: RenderInfo | undefined = undefined;
          const topOldItem = this.topRemoveMap.getLast(nextItem.type);

          if (topOldItem !== undefined) {
            shouldReuseOldItem = true;
            oldRenderInfo = this.topRemoveMap.remove(nextItem.type, topOldItem);
          } else {
            const bottomOldItem = this.bottomRemoveMap.getLast(nextItem.type);
            if (bottomOldItem !== undefined) {
              const oldItemLayout = layouts[bottomOldItem];
              shouldReuseOldItem = oldItemLayout.top > end;
              if (shouldReuseOldItem) {
                oldRenderInfo = this.bottomRemoveMap.remove(nextItem.type, bottomOldItem);
              }
            }
          }

          if (shouldReuseOldItem) {
            current.unshift({ i: ii, dom: oldRenderInfo.dom });
            continue;
          }

          // 没有旧的模块可以复用，直接插入新的模块
          current.unshift({ i: ii, dom: current.length });
        } else {
          break;
        }
      }
    }

    const newRenderCurrent = [
      ...this.topRemoveMap.getList(),
      ...current,
      ...this.bottomRemoveMap.getList()
    ]
      .sort((a, b) => a.dom - b.dom)
      .map(i => i.i);

    return {
      renderCurrent: newRenderCurrent,
      shouldSetState
    };
  }

  handleScrollPure = (scrollTop: number) => {
    const info = this.getRenderList(scrollTop);
    if (info === null) return null;
    const { shouldSetState, ...oterState } = info;
    if (shouldSetState) return oterState;
    else return null;
  };

  handleScroll = (event: React.UIEvent<HTMLDivElement> | number) => {
    const container = this.container.current;
    if (container) {
      let scrollTop;
      if (typeof event === 'number') {
        container.scrollTop = event;
        scrollTop = event;
      } else {
        scrollTop = container.scrollTop;
      }

      const newState = this.handleScrollPure(scrollTop);
      if (newState) {
        this.setState(newState);
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
          style={{
            width,
            height: headerHeight + footerHeight + contentHeight,
            position: 'relative'
          }}
        >
          {Header ? (
            <Header onHeightChange={this.handleHeaderHeightChange} style={headerStyle} />
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
            <Footer onHeightChange={this.handleFooterHeightChange} style={footerStyle} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default RecyclerList;
