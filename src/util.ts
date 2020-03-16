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
