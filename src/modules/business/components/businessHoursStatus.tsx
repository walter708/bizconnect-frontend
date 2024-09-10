import { FlexRowStartCenter } from "@/components/Flex";
import { cn } from "@/lib/utils";
import { removeAMPM } from "@/utils";
import React from "react";

interface BusinessHoursStatusProps {
  isOpen: boolean;
  closingTime: string | null;
  className?: React.ComponentProps<"div">["className"];
}

const BusinessHoursStatus: React.FC<BusinessHoursStatusProps> = ({
  isOpen,
  closingTime,
  className,
}) => {
  return (
    <FlexRowStartCenter className={cn("w-full gap-[5px] mt-5 mb-3", className)}>
      {isOpen ? (
        <>
          <span className="text-[11px] md:text-[15px] font-normal font-archivo leading-[13px] text-teal-100">
            Open
          </span>
          <span className="h-[3px] w-[3px] rounded-full text-[6px] bg-dark-105"></span>
          <span className="text-[11px] md:text-[15px] font-normal font-archivo leading-[16.32px] text-dark-105">
            Closes {removeAMPM(closingTime!)}PM
          </span>
        </>
      ) : (
        <span className="text-[11px] md:text-[15px] font-normal font-archivo leading-[16.32px] text-red-301">
          Closed
        </span>
      )}
    </FlexRowStartCenter>
  );
};

export default BusinessHoursStatus;
