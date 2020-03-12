export function isUndef(type: string) {
  return type === 'undefined';
}

export function getLogObject(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
