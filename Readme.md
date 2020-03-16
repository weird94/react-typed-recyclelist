# React-Reclycle-List

### 描述

一个真正的实现了节点回收的高性能虚拟长列表组件

### 安装

```bash
npm install react-recycle-list --save
```

### 属性

| 属性                  | 类型                                  | 默认值 | 必填   | 描述                                                                                         |
| --------------------- | ------------------------------------- | ------ | ------ | -------------------------------------------------------------------------------------------- |
| Header                | `React.ComponentType<HeaderProps>`    | null   |        | 列表 header 组件                                                                             |
| Footer                | `React.ComponentType<FooterProps>`    | null   |        | 列表 footer 组件                                                                             |
| cellData              | `CellData<T>[]`                       |        | `true` | 列表渲染的数据(参考 demo)                                                                    |
| height                | `number`                              |        | `true` | 列表容器的高度                                                                               |
| width                 | `number`                              |        | `true` | 列表容器的宽度                                                                               |
| style                 | `React.CSSProperties`                 |        |        | 列表样式                                                                                     |
| className             | `string`                              |        |        | 列表 class                                                                                   |
| renderAccuary         | `number`                              | 5      |        | 列表真实渲染因子`真实渲染内容高度 = renderAccuary \* 列表容器高度`                           |
| scrollComputeThrottle | `number`                              | 100    |        | 列表触发渲染重新计算的滚动距离 (这个参数可以结合 renderAccuary 以及 item 的高度进行性能调优) |
| defaultScrollTop      | `number`                              | 0      |        | 列表初始滚动的位置                                                                           |
| onScroll              | `(scrollTop: number, event) => void;` |        |        | 滚动时触发的事件，返回当前滚动的距离 （频发触发，业务侧最好做好节流）                        |
| onEndReached          | `() => void`                          |        |        | 滚动区域还剩 `onEndReachedThreshold` 的长度时触发                                            |
| onEndReachedThreshold | `number`                              |        |        | 设置加载更多的偏移                                                                           |
| onCellShow            | `(index: number) => void`             |        |        | cell 曝光事件，返回 cell 处于列表中的 index                                                  |
| onCellHide            | `(index: number) => void`             |        |        | cell 消失事件，返回 cell 处于列表中的 index                                                  |
| onHeaderShow          | `() => void`                          |        |        | header 曝光事件                                                                              |
| onHeaderHide          | `() => void`                          |        |        | header 消失事件                                                                              |
| onFooterShow          | `() => void`                          |        |        | footer 曝光事件                                                                              |
| onFooterHide          | `() => void`                          |        |        | footer 消失事件                                                                              |

### 方法

`scrollTo(scrollTop: number): void`: 指定列表滚动到特定位置

### 示例

[示例](./demo/index.tsx)
