import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface SectionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  customPadding?: string;
}

const SectionWrapper = ({
  children,
  className,
  customPadding,
  ...props
}: SectionWrapperProps) => {
  const defaultPadding =
    'px-4 sm:px-6 lg:px-14 my-4 sm:my-6 lg:my-8';

  const userSelectNone = 'select-none';

  return (
    <div
      className={cn(customPadding ?? defaultPadding, userSelectNone, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default SectionWrapper;
