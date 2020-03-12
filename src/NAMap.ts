import { RenderInfo } from '.';
import SortedArray from './SortedArray';

type Info = RenderInfo & { type: React.ComponentType };

/**
 * [NAMap]: NumberArrayMap
 * 其中 key 为 React.ComponentType
 *     value 为有序的 number 数组
 */
export default class NAMap {
  private instance: Map<React.ComponentType, SortedArray<number>>;
  private domMap: Map<number, number>;
  private totalList: SortedArray<Info>;

  constructor() {
    this.instance = new Map();
    this.domMap = new Map();
    this.totalList = new SortedArray<Info>([], item => item.i);
  }

  /**
   * 默认使用者
   * @param key
   * @param value
   */
  private setSingle(key: React.ComponentType, value: number, dom: number) {
    const current = this.instance.get(key);
    if (current) {
      current.push(value);
    } else {
      this.instance.set(key, new SortedArray([value], i => i));
    }

    this.domMap.set(value, dom);
    this.totalList.push({ i: value, dom, type: key });
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

  remove(type: React.ComponentType, i: number) {
    const current = this.instance.get(type);
    if (current) {
      current.remove(i);
    }

    this.domMap.delete(i);

    return this.totalList.remove(i);
  }

  getFirst(key: React.ComponentType) {
    const current = this.instance.get(key);
    return current ? current.getFirst() : undefined;
  }

  getLast(key: React.ComponentType) {
    const current = this.instance.get(key);
    if (current) {
      return current.getLast();
    } else {
      return undefined;
    }
  }

  getDom(key: number) {
    return this.domMap.get(key);
  }

  getList() {
    return this.totalList.getList();
  }
}
