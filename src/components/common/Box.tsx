import classNames from "classnames";
import { ReactNode } from "react";

const Box = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div className={classNames("shadow bg-white rounded-lg p-4", className)}>
      {children}
    </div>
  );
};

export default Box;
