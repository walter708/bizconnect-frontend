"use client";
import { cn } from "@/lib/utils";
import { FlexColStart } from "@components/Flex";

interface IErrorComponent {
  value: string;
  _ref?: React.RefObject<HTMLDivElement>;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

const ErrorComponent = ({ value, _ref, className }: IErrorComponent) => {
  return (
    <FlexColStart className={cn("w-auto", className)}>
      <span ref={_ref} className="text-red-305 font-archivo text-[13px]">
        {value}
      </span>
    </FlexColStart>
  );
};

export default ErrorComponent;
