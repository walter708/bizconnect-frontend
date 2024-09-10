"use client";
import { FlexColStartCenter } from "@components/Flex";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { navVariants } from "@/utils/motion";

interface TitleCardProps {
  className?: string;
  title: string;
  header: string;
  subTitle: string;
}

const TitleCard = ({ className, title, header, subTitle }: TitleCardProps) => {
  return (
    <motion.div
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className={cn(
        "flex flex-col justify-start w-full h-auto text-start",
        className
      )}
    >
      <h5 className="font-archivo font-semibold text-[13px] md:text-base md:font-bold leading-[24px] tracking-normal text-teal-100">
        {title}
      </h5>
      <h1 className="font-archivo font-bold text-[30px] md:text-[36px] leading-[36.63px] md:leading-[auto] tracking-normal text-blue-200 mt-[6px]">
        {header}
      </h1>
      <p className="font-archivo font-normal text-[15px] leading-[25px] tracking-normal text-gray-103 mt-2">
        {subTitle}
      </p>
    </motion.div>
  );
};

export default TitleCard;
