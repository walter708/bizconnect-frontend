"use client";
import { cn } from "@/lib/utils";
import { FlexRowStart } from "@components/Flex";
import React from "react";

type ReadMoreProps = {
  text?: string;
  textClassName?: React.ComponentProps<"span">["className"];
};

export default function ReadMoreText({ text, textClassName }: ReadMoreProps) {
  const [isReadmore, setIsReadmore] = React.useState(false);
  const TEXT_CONSTRAINT = 120;
  const formattedText =
    text && text?.length > TEXT_CONSTRAINT
      ? text.slice(0, TEXT_CONSTRAINT) + "..."
      : text;
  const showReadmore = text && text?.length > TEXT_CONSTRAINT;

  return (
    <FlexRowStart className="w-auto flex-wrap">
      <span
        className={cn(
          "text-sm md:text-[15px] font-normal font-archivo text-blue-200 leading-[18px]",
          textClassName
        )}
      >
        {isReadmore ? text : formattedText}
        {showReadmore && (
          <span
            className="text-[12px] text-teal-100 font-inter font-semibold cursor-pointer readmore-trigger ml-[5px] border-none outline-none bg-none"
            onClick={() => setIsReadmore(!isReadmore)}
          >
            {isReadmore ? "Read less" : "Read more"}
          </span>
        )}
      </span>
    </FlexRowStart>
  );
}
