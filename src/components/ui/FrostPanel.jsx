import { forwardRef, useState } from 'react';
import IceLayer from './ice/IceLayer';
import useBurst from './useBurst';

/**
 * Any positioned element that wears frost: a light crystal rim at rest, and on
 * hover/focus the frost grows in from the edges while ice falls across the pane.
 */
const FrostPanel = forwardRef(function FrostPanel(
  { as = 'div', className = '', children, shower = true, onMouseEnter, onMouseLeave, onFocus, onBlur, ...rest },
  ref,
) {
  const Tag = as;
  const [hovered, setHovered] = useState(false);
  const [burst, trigger] = useBurst();

  const enter = (e, handler) => {
    setHovered(true);
    if (shower) trigger();
    handler?.(e);
  };
  const leave = (e, handler) => {
    setHovered(false);
    handler?.(e);
  };

  return (
    <Tag
      ref={ref}
      className={`frost ${className}`}
      onMouseEnter={(e) => enter(e, onMouseEnter)}
      onMouseLeave={(e) => leave(e, onMouseLeave)}
      onFocus={(e) => enter(e, onFocus)}
      onBlur={(e) => leave(e, onBlur)}
      {...rest}
    >
      {children}
      <IceLayer active={hovered} burst={burst} />
    </Tag>
  );
});

export default FrostPanel;
