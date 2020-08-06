export function isUndef(type: string) {
  return type === 'undefined';
}

export function getLogObject(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export function delayCall(func: () => void) {
  Promise.resolve().then(func);
}

export function runAtIdle(func: () => void) {
  // @ts-ignore
  if (typeof requestIdleCallback === 'function') {
    // @ts-ignore
    requestIdleCallback(func);
  } else {
    requestAnimationFrame(func);
  }
}

export function getMinIndex(nums: number[]) {
  let min = nums[0];
  let minIndex = 0;

  for (let i = 1, len = nums.length; i < len; i++) {
    const current = nums[i];
    if (current < min) {
      min = current;
      minIndex = i;
    }
  }

  return minIndex;
}

export function getMax(nums: number[]) {
  let max = nums[0];

  for (let i = 1, len = nums.length; i < len; i++) {
    const current = nums[i];
    if (current > max) {
      max = current;
    }
  }

  return max;
}
