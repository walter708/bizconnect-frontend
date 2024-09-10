"use client";
import { FlexColStart } from "@components/Flex";
import { cn } from "@/lib/utils";
import { fadeIn, navVariants } from "@/utils/motion";
import { motion } from "framer-motion";

interface BusinessCardProps {
  className?: string;
  header: string;
  subTitle: string;
  icon: JSX.Element;
}

const BusinessCard = ({
  className,
  icon,
  header,
  subTitle,
}: BusinessCardProps) => {
  return (
    <div>
      <FlexColStart
        className={cn(
          "w-full text-left mt-[15px] px-[25px] py-[30px] rounded-[14px] border-[2px] border-gray-103/5 opacity-[0.04px] shadow-sm",
          className
        )}
      >
        {icon}
        <FlexColStart className="w-full gap-[10px]">
          <motion.h2
            variants={navVariants}
            initial="hidden"
            whileInView="show"
            className="font-archivo font-semibold md:font-bold text-[20px] leading-[24.42px] text-left text-blue-200 mt-[6px] "
          >
            {header}
          </motion.h2>
          <motion.p
            variants={fadeIn("right", "spring", 0.5, 1)}
            initial="hidden"
            whileInView="show"
            className="font-archivo font-normal text-[15px] text-gray-100 text-left leading-[25px] "
          >
            {subTitle}
          </motion.p>
        </FlexColStart>
      </FlexColStart>
    </div>
  );
};

export default BusinessCard;
