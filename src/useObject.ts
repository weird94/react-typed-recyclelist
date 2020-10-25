import React from 'react';

export default function useObject<T extends object>(params: T) {
  return React.useMemo(() => params, Object.values(params));
}
