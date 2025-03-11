import classNames from "classnames";
import { ReactNode } from "react";

const BaseComponent = ({
  className,
  children,
  onClick,
  ...props
}: {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  [key: string]: unknown;
}) => {
  return (
    <div className={classNames(className)} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default BaseComponent;
