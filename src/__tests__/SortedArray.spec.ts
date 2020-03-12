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
});
