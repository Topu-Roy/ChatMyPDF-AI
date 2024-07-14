import { cn } from "@/lib/utils";
import React, { type FC } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const MaxWidthWrapper: FC<Props> = ({
  children,
  className,
}): React.ReactElement => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
