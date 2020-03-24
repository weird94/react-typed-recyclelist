import SortedArray from '../SortedArray';

test('SortedArray.find', () => {
  const sorted = new SortedArray(
    [
      { i: 0, dom: 0, type: { compare: null } },
      { i: 1, dom: 1, type: { compare: null } }
    ],
    item => item.i
  );
  const index = sorted.find(0);

  expect(index).toBe(0);
  expect(sorted.find(1)).toBe(1);
});

test('SortedArray.find - NotFound', () => {
  const sorted2 = new SortedArray(
    [
      { i: 0, dom: 0, type: { compare: null } },
      { i: 5, dom: 5, type: { compare: null } },
      { i: 6, dom: 6, type: { compare: null } }
    ],
    item => item.i
  );

  expect(sorted2.find(4)).toBe(-1);
});

test('SortedArray.push', () => {
  const sorted = new SortedArray<number>([], i => i);
  sorted.push(0);

  expect(sorted.getList().length).toBe(1);

  sorted.push(3);

  expect(sorted.getList().length).toBe(2);
  expect(sorted.getList()).toEqual([0, 3]);

  try {
    sorted.push(0);
    expect('this should not be called').toBe(2);
  } catch (error) {
    expect(typeof error).toBe('string');
  }

  expect(sorted.getList().length).toBe(2);

  sorted.push(1);

  expect(sorted.getList().length).toBe(3);

  expect(sorted.getList()).toEqual([0, 1, 3]);
});

test('SortedArray.remove', () => {
  const sorted = new SortedArray([1, 2, 4, 3, 5], i => i);
  const res = sorted.remove(1);

  expect(res).toBe(1);
  expect(sorted.getList()).toEqual([2, 3, 4, 5]);

  const res2 = sorted.remove(6);
  expect(res2).toBe(undefined);

  expect(sorted.getList()).toEqual([2, 3, 4, 5]);
});
