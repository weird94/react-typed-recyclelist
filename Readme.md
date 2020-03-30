# React-Reclycle-List

## 描述

一个真正的实现了 DOM 节点回收和复用的高性能虚拟长列表组件

## 安装

```bash
emm... 还没最终release
```

## Try the Demo

```bash
git clone https://github.com/weird94/react-recycle-list.git
cd react-recycle-list
yarn
yarn dev-demo

```

## 属性

| 属性                  | 类型                                  | 默认 | 必填   | 描述                                                                                         |
| --------------------- | ------------------------------------- | ---- | ------ | -------------------------------------------------------------------------------------------- |
| Header                | `ComponentType<HeaderProps>`          | null |        | 列表 header 组件                                                                             |
| Footer                | `ComponentType<FooterProps>`          | null |        | 列表 footer 组件                                                                             |
| cellData              | `CellData<T>[]`                       |      | `true` | 列表渲染的数据(参考 demo)                                                                    |
| height                | `number`                              |      | `true` | 列表容器的高度                                                                               |
| width                 | `number`                              |      | `true` | 列表容器的宽度                                                                               |
| style                 | `React.CSSProperties`                 |      |        | 列表样式                                                                                     |
| className             | `string`                              |      |        | 列表 class                                                                                   |
| renderAccuary         | `number`                              | 5    |        | 列表真实渲染因子`真实渲染内容高度 = renderAccuary * 列表容器高度`                            |
| scrollComputeThrottle | `number`                              | 100  |        | 列表触发渲染重新计算的滚动距离 (这个参数可以结合 renderAccuary 以及 item 的高度进行性能调优) |
| defaultScrollTop      | `number`                              | 0    |        | 列表初始滚动的位置                                                                           |
| onScroll              | `(scrollTop: number, event) => void;` |      |        | 滚动时触发的事件，返回当前滚动的距离 （频发触发，业务侧最好做好节流）                        |
| onEndReached          | `() => void`                          |      |        | 滚动区域还剩 `onEndReachedThreshold` 的长度时触发                                            |
| onEndReachedThreshold | `number`                              |      |        | 设置加载更多的偏移                                                                           |
| onCellShow            | `(index: number) => void`             |      |        | cell 曝光事件，返回 cell 处于列表中的 index                                                  |
| onCellHide            | `(index: number) => void`             |      |        | cell 消失事件，返回 cell 处于列表中的 index                                                  |
| onHeaderShow          | `() => void`                          |      |        | header 曝光事件                                                                              |
| onHeaderHide          | `() => void`                          |      |        | header 消失事件                                                                              |
| onFooterShow          | `() => void`                          |      |        | footer 曝光事件                                                                              |
| onFooterHide          | `() => void`                          |      |        | footer 消失事件                                                                              |

## 方法

`scrollTo(scrollTop: number): void`: 指定列表滚动到特定位置

## 示例

- [示例代码](./demo/index.tsx)
- [live demo](https://weird94.github.io/list/normal/)

## Cell 组件自有状态

1. `useStoreState`

```tsx
import { useStoreState } from 'react-recyclelist';

const Cell = memo((props: CellProps<{ name: string }>) => {
  const [active, setActive] = useStoreState(false, 'active', props);
};

// useStoreState 是为了让 cell 组件能够实现自状态而设计
// 通过将状态寄存在 list 内部的 stateMap 上而实现
```

2. `StoreComponent`

```tsx
import { StoreComponent } from 'react-recyclelist';

class CellComponent extends StoreComponent {
  state = {
    a: 1,
    b: 2
  };

  render() {
    return <div>{this.state.a}</div>;
  }

  // 如果你需要使用这个生命周期，你必须调用 super.componentDidUpdate();
  componentDidUpdate() {
    super.componentDidUpdate();
    // ...
  }

  // 如果你需要使用这个生命周期，你必须调用 super.componentDidMount();
  componentDidMount() {
    super.componentDidMount();
    // ...
  }
}
```

## 注意 or 常见问题

### 当你实现列表的 CellComponent 时, 你必须正确的使用从 props 中传入的 style

```typescript
const Cell = memo((props: CellProps<{ name: string }>) => {
  const { style, index } = props;
  return (
    <div
      style={{
        ...style,
        backgroundColor: index % 2 === 0 ? 'white' : 'yellow',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <span>{props.data.name + props.index}</span>
    </div>
  );
});
```

并且, 我们会保证 props 中每个属性的前后一致性, 所以你可以放心的使用 `React.memo` 或者 `React.PureComponent`

#### 我自己在真实的使用过程中出现了滑动过快导致短暂白屏的情况，我应该怎么优化呢 ？

我们开放了一些参数用于你在实际使用中自己进行部分的调优

- renderAccuary: 列表真实渲染因子`真实渲染内容高度 = renderAccuary * 列表容器高度` 默认为 5
- scrollComputeThrottle: 列表触发重新计算真实渲染内容所需要滚动的距离，这个参数决定了列表在滚动过程中的计算量的大小。默认为 100

所以，如果你出现了上述情况，不妨试试将这两个参数调大一些。

### 如果我的 cell 本身是存在状态的，我该怎么处理呢？

我们为每个 cell 实现了状态寄存，可以参考

[示例代码](./demo/statefull/index.tsx)
[Live Demo](https://weird94.github.io/list/statefull/)

### 如果我的 cell 不仅存在状态，并且我的列表排列顺序会发生改变，又该怎么处理呢？

如果顺序会发生改变的情况下，

1. 我们提供了 sortKey props 来标示列表顺序的版本，以此驱动列表重新渲染并且清空回收池
2. 我们允许你为数据打上唯一的 uniqueKey，这样来保证 store 和数据的一一对应

[示例代码](./demo/resort/index.tsx)
[Live Demo](https://weird94.github.io/list/resort/)

## [实现原理](https://www.yuque.com/zhangw/kgsgvw/sqmr8t)
