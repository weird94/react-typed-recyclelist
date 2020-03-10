import { RenderInfo } from '.';

type Info = RenderInfo & { type: React.ComponentType };

/**
 * [NAMap]: NumberArrayMap
 * 其中 key 为 React.ComponentType
 *     value 为有序的 number 数组
 */
export default class NAMap {
  private instance: Map<React.ComponentType, number[]>;
  private domMap: Map<number, number>;

  constructor() {
    this.instance = new Map();
    this.domMap = new Map();
  }

  /**
   * 默认使用者
   * @param key
   * @param value
   */
  private setSingle(key: React.ComponentType, value: number, dom: number) {
    const current = this.instance.get(key);
    if (current) {
      if (current[0] && current[0] > value) {
        current.unshift(value);
      } else {
        current.push(value);
      }
    } else {
      this.instance.set(key, [value]);
    }

    this.domMap.set(value, dom);
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
      const index = current.indexOf(i);
      if (index > -1) {
        current.splice(index, 1);
      }
    }

    this.domMap.delete(i);
  }

  getFirst(key: React.ComponentType) {
    const current = this.instance.get(key);
    return current ? current[0] : undefined;
  }

  getLast(key: React.ComponentType) {
    const current = this.instance.get(key);
    if (current && current.length > 0) {
      return current[current.length - 1];
    } else {
      return undefined;
    }
  }

  getDom(key: number) {
    return this.domMap.get(key);
  }
}
