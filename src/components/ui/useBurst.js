import { useCallback, useState } from 'react';

/** Counter that increments on each activation; pass it to <FrostShower burst={...} />. */
const useBurst = () => {
  const [burst, setBurst] = useState(0);
  const trigger = useCallback(() => setBurst((b) => b + 1), []);
  return [burst, trigger];
};

export default useBurst;
