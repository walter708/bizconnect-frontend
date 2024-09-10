"use client";
import { X } from "@components/icons";
import { FlexRowStart, FlexRowStartCenter } from "./Flex";
import type React from "react";
import { cn } from "@/lib/utils";

type Props = {
  selectedValues: {
    uuid: string;
    value: string;
  }[];
  getSelectedHolder: (id: string) => void;
  labelClassName?: React.ComponentProps<"span">["className"];
};

export default function SelectedPlaceholder({
  selectedValues,
  getSelectedHolder,
  labelClassName,
}: Props) {
  if (selectedValues.length === 0) return null;

  return (
    <>
      {
        <FlexRowStart className="flex-wrap">
          {selectedValues.map((d) => (
            <FlexRowStartCenter
              key={d.uuid}
              className="w-auto px-[10px] py-[7px] bg-gray-201 rounded-full scale-[.95] -translate-x-2 md:scale-100 md:-translate-x-0 gap-0 md:gap-2"
            >
              <span
                className={cn(
                  "text-[11px] font-inter tracking-normal leading-[13px] font-semibold text-blue-200 ml-[5px]",
                  labelClassName
                )}
              >
                {d.value}
              </span>
              <button
                className="flex items-center justify-start border-none outline-none cursor-pointer transition-all p-0 m-0 enableBounceEffect"
                onClick={() => {
                  getSelectedHolder(d.uuid);
                }}
              >
                <X size={15} className="text-[5px] stroke-white-400/70" />
              </button>
            </FlexRowStartCenter>
          ))}
        </FlexRowStart>
      }
    </>
  );
}
