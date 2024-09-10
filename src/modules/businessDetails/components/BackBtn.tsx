"use client";
import { FlexRowStartCenter } from "@/components/Flex";
import { ChevronLeft } from "@/components/icons";
import { useDataCtx } from "@/context/DataCtx";
import React, { useEffect } from "react";

export default function BackBtn({ label }: { label?: string }) {
  const { setNavbarBgColor } = useDataCtx();

  useEffect(() => {
    setNavbarBgColor({
      parent: "#F6F8FA",
      child: "#fff",
    });
  }, []);

  return (
    <button
      onClick={(e) => {
        window.history.back();
      }}
      className="text-[12px] font-archivo font-normal leading-[14px] underline bg-none outline-none border-none cursor-pointer text-blue-200 mt-5"
    >
      <FlexRowStartCenter className="w-auto gap-[4px]">
        <ChevronLeft strokeWidth={1.5} size={25} className="stroke-[#130F26]" />
        {label ?? "Explore Businesses"}
      </FlexRowStartCenter>
    </button>
  );
}
