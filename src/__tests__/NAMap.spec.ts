import NAMap from '../NAMap';

function A() {
  return null;
}

function B() {
  return null;
}

test('new NAMAp', () => {
  const a = new NAMap();

  expect(a.getFirst(A)).toBe(undefined);
  expect(a.getLast(A)).toBe(undefined);
  expect(a.getFirst(B)).toBe(undefined);
  expect(a.getLast(B)).toBe(undefined);
  expect(a.getList().length).toBe(0);

  a.push({ type: A, dom: 0, i: 0 });

  expect(a.getFirst(A)).toEqual({ dom: 0, i: 0 });
  expect(a.getLast(A)).toEqual({ dom: 0, i: 0 });
  expect(a.getFirst(B)).toBe(undefined);
  expect(a.getLast(B)).toBe(undefined);
  expect(a.getList().length).toBe(1);

  a.push({ type: B, dom: 1, i: 1 });
  expect(a.getFirst(A)).toEqual({ dom: 0, i: 0 });
  expect(a.getLast(A)).toEqual({ dom: 0, i: 0 });
  expect(a.getFirst(B)).toEqual({ dom: 1, i: 1 });
  expect(a.getLast(B)).toEqual({ dom: 1, i: 1 });
  expect(a.getList().length).toBe(2);

  const remove1 = a.remove(A, 0);
  expect(remove1).toEqual({ dom: 0, i: 0 });
  expect(a.getFirst(A)).toBe(undefined);
  expect(a.getLast(A)).toBe(undefined);
  expect(a.getFirst(B)).toEqual({ dom: 1, i: 1 });
  expect(a.getLast(B)).toEqual({ dom: 1, i: 1 });
  expect(a.getList().length).toBe(1);

  const remove2 = a.remove(A, 0);
  expect(remove2).toBe(undefined);
});
