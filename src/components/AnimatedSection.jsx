import React from 'react';
import { useInView } from '../hooks/useInView';

/**
 * Wraps content and adds .in-view when the section enters the viewport,
 * enabling CSS scroll-triggered animations (international school style).
 */
const AnimatedSection = ({ children, className = '', as: Tag = 'div', ...props }) => {
  const [ref, isInView] = useInView({ threshold: 0.04, rootMargin: '0px 0px -48px 0px' });
  return (
    <Tag
      ref={ref}
      className={`section-reveal ${isInView ? 'in-view' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default AnimatedSection;
