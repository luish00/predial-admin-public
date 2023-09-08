import React from 'react';

import './shimmer.css';

interface Props {
  borderRadius?: number;
  children?: React.ReactNode;
  className?: string;
  as?: 'span' | 'td' | 'div';
  height?: string;
  visible?: boolean;
  width?: string;
}

const Shimmer: React.FC<Props> = ({
  borderRadius = 8,
  children,
  className = '',
  as = 'div',
  height,
  visible = true,
  width,
}) => {
  function isVisible() {
    if (visible) {
      return `${className} Shimmer`;
    }

    return className || '';
  }

  function styles() {
    if (!visible) {
      return {};
    }

    let style: object = { borderRadius: borderRadius };

    if (height) {
      style = {
        ...style,
        height,
      };
    }

    if (width) {
      style = {
        ...style,
        width,
      };
    }

    return style;
  }

  switch (as) {
    case 'span': {
      return (
        <span className={isVisible()} style={styles()}>
          {children}
        </span>
      );
    }

    case 'td':
      return (
        <td className={isVisible()} style={styles()}>
          {children}
        </td>
      );

    default: return (
      <div className={isVisible()} style={styles()}>
        {children}
      </div>
    );
  }
};

export { Shimmer };
