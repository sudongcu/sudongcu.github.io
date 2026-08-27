import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

const CountUp = ({ to, duration = 1.6, suffix = '', className = '', ...rest }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className} {...rest}>
      {value}
      {suffix}
    </span>
  );
};

export default CountUp;
