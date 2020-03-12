export default class SortedArray<T> {
  private array: T[];
  private getter: (element: T) => number;

  constructor(array: T[], getter: (element: T) => number) {
    this.array = array;
    this.array.sort((item1, item2) => getter(item1) - getter(item2));
    this.getter = getter;
  }

  push(ele: T) {
    const array = this.array;
    const getter = this.getter;
    if (array.length === 0) {
      array.push(ele);
      return;
    }

    let index1 = 0,
      index2 = this.array.length - 1,
      mid = ~~((index1 + index2) / 2);

    const eleValue = getter(ele);

    if (getter(array[index1]) > eleValue) {
      array.unshift(ele);
    } else if (getter(array[index2]) < eleValue) {
      array.push(ele);
    } else {
      while (index2 - index1 > 1) {
        const midValue = getter(array[mid]);
        if (midValue === eleValue) {
          throw '[SortedArray]: try to insert a exist element to an sorted array';
        } else if (midValue > eleValue) {
          index2 = mid;
        } else {
          index1 = mid;
        }
        mid = ~~((index1 + index2) / 2);
      }

      if (getter(array[index1]) === eleValue || getter(array[index2]) === eleValue) {
        throw '[SortedArray]: try to insert a exist element to an sorted array';
      } else {
        // 插入
        this.array.splice(index2, 0, ele);
      }
    }
  }

  /**
   * 折半查找
   * @param indexed
   */
  find(indexed: number) {
    const array = this.array;
    const getter = this.getter;
    const len = array.length;
    if (len === 0) return -1;

    let index1 = 0,
      index2 = len - 1,
      mid = ~~((index1 + index2) / 2);

    while (true) {
      const midValue = getter(array[mid]);
      const leftValue = getter(array[index1]);
      const rightValue = getter(array[index2]);
      if (leftValue > indexed) {
        return -1;
      } else if (leftValue === indexed) {
        return index1;
      } else if (rightValue === indexed) {
        return index2;
      } else if (rightValue < indexed) {
        return -1;
      }

      if (index2 > index1 + 1) {
        if (midValue === indexed) {
          return mid;
        } else if (midValue > indexed) {
          index2 = mid;
        } else {
          index1 = mid;
        }

        mid = ~~((index1 + index2) / 2);
      } else {
        return -1;
      }
    }
  }

  remove(indexed: number) {
    const i = this.find(indexed);
    if (i > -1) {
      return this.array.splice(i, 1)[0];
    }
  }

  getFirst() {
    return this.array[0];
  }

  getLast() {
    return this.array[this.array.length - 1];
  }

  getList() {
    return this.array;
  }
}
