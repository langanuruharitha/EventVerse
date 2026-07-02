import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';
