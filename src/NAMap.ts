import { RenderInfo } from '.';
import SortedArray from './SortedArray';

type Info = RenderInfo & { type: React.ComponentType<any> };

/**
 * [NAMap]: NumberArrayMap
 * 其中 key 为 React.ComponentType
 *     value 为有序的 number 数组
 */
export default class NAMap {
  private instance: Map<React.ComponentType<any>, SortedArray<{ i: number; dom: number }>>;

  get totalList() {
    const arr: RenderInfo[] = [];
    this.instance.forEach(x => {
      arr.concat(x.getList());
    });

    return arr;
  }

  constructor() {
    this.instance = new Map();
  }

  /**
   * 默认使用者
   * @param key
   * @param value
   */
  private setSingle(key: React.ComponentType, value: number, dom: number) {
    const current = this.instance.get(key);
    if (current) {
      current.push({ i: value, dom });
    } else {
      this.instance.set(key, new SortedArray([{ i: value, dom }], i => i));
    }
  }

  push(items: (Info & { dom: number }) | (Info & { dom: number })[]) {
    if (!(items instanceof Array)) {
      this.setSingle(items.type, items.i, items.dom);
    } else {
      items.forEach(item => {
        this.setSingle(item.type, item.i, item.dom);
      });
    }
  }

  remove(type: React.ComponentType<any>, i: number) {
    const current = this.instance.get(type);
    if (current) {
      return current.remove(i);
    }
  }

  getFirst(key: React.ComponentType<any>) {
    const current = this.instance.get(key);
    return current ? current.getFirst().i : undefined;
  }

  getLast(key: React.ComponentType<any>) {
    const current = this.instance.get(key);
    if (current) {
      return current.getLast().i;
    } else {
      return undefined;
    }
  }

  getList() {
    return this.totalList;
  }
}
