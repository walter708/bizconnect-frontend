"use client";
import { cn } from "@/lib/utils";
import { FlexColCenter, FlexRowStart } from "@components/Flex";
import { EmptyCart, ChevronRight } from "@components/icons";

interface NotfoundProps {
  message?: string;
  className?: React.ComponentProps<"div">["className"];
}

const BusinessesNotfound = ({ message, className }: NotfoundProps) => {
  return (
    <FlexColCenter className={cn("w-full gap-4 min-h-[250px]", className)}>
      <EmptyCart
        size={30}
        strokeWidth={1}
        className="fill-gray-100 stroke-none"
      />
      <p className="text-[12px] font-normal font-archivo text-gray-103">
        {message ?? "No similar businesses found."}
      </p>
      <button
        className="flex flex-row items-start justify-start gap-4 cursor-pointer border-none outline-none bg-none"
        onClick={() => {
          window.history.back();
        }}
      >
        <FlexRowStart className="w-full">
          <p className="text-[13px] font-normal font-archivo underline text-teal-100">
            Explore other business categories
          </p>
          <ChevronRight
            strokeWidth={1.5}
            size={20}
            className="relative stroke-teal-100"
          />
        </FlexRowStart>
      </button>
    </FlexColCenter>
  );
};

export default BusinessesNotfound;
