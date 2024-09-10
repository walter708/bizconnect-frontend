"use client";
import {
  FlexColStart,
  FlexRowEnd,
  FlexRowStartBtw,
  FlexRowStartCenter,
} from "@/components/Flex";
import { Calendar, ChevronDown } from "@/components/icons";
import { SlotDays, type SlotDaysType } from "@/data/dateTimeSlot";
import { lowerCase, orderDaysOfOperation } from "@/utils";
import React, { Fragment } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { cn } from "@/lib/utils";

interface IOpeningHoursProps {
  openingHoursCalendar:
    | {
        day: SlotDaysType;
        openTime: string;
        closeTime: string;
      }[]
    | [];
  getCurrentDay: string;
  open?: boolean;
}

export default function OpeningHoursDrd({
  openingHoursCalendar,
  getCurrentDay,
  open,
}: IOpeningHoursProps) {
  const [calendarOpened, setCalendarOpened] = React.useState(
    open ? (openingHoursCalendar.length === 0 ? false : true) : false
  );

  const openingHours: {
    day: SlotDaysType;
    openTime: string;
    closeTime: string;
  }[] = [...openingHoursCalendar];

  const formattedOpeningHoursCalendar = orderDaysOfOperation(
    SlotDays.map((day) => {
      const existingDay = openingHours.find(
        (d) => lowerCase(d.day) === lowerCase(day)
      );
      return existingDay || { day, openTime: "", closeTime: "" };
    })
  );

  return (
    <FlexColStart
      className={cn(
        "w-full mt-[10px] bg-white-100 md:bg-blue-204 rounded-[5px] h-auto p-0 relative border-[.2px] border-white-400/15"
      )}
    >
      {" "}
      {/* Add relative positioning */}
      <button
        className={cn(
          "w-full h-[40px] mt-[0px] outline-none border-none rounded-[5px] flex items-center justify-between px-5 md:px-[20px] bg-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        onClick={() => {
          setCalendarOpened(!calendarOpened);
        }}
        disabled={openingHoursCalendar.length === 0}
      >
        <FlexRowStartCenter className="w-auto gap-1">
          <Calendar size={15} className="stroke-dark-100/60 mr-1" />
          <span className="text-[11px] md:text-[13px] font-medium font-pp leading-[10px] md:leading-[14.14px] mt-[1px] text-blue-200">
            View opening hours
          </span>
        </FlexRowStartCenter>
        <ChevronDown
          strokeWidth={1.5}
          className="stroke-gray-103"
          style={{
            transform: calendarOpened ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {calendarOpened && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: calendarOpened ? 1 : 0,
            height: calendarOpened ? "auto" : 0,
          }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.1 }}
          className="left-0 right-0 px-5 py-3 w-full h-auto grid grid-cols-4 gap-[10px] overflow-hidden bg-white-100 md:bg-blue-204 rounded-b-[5px]"
        >
          {formattedOpeningHoursCalendar.map((day) => {
            return (
              <Fragment key={day.day}>
                <div className="w-full col-span-2 md:pl-[0px] pr-0">
                  <FlexRowStartBtw className="w-full">
                    <span
                      className="text-[12px] font-normal font-pp md:leading-[14px] md:text-[13px] leading-[16.32px]"
                      style={{
                        color:
                          lowerCase(getCurrentDay) === lowerCase(day.day)
                            ? "#17BEBB"
                            : "#0E2D52",
                      }}
                    >
                      {day.day}
                    </span>
                    <span
                      className="h-[5px] w-[5px] mt-[6px] rounded-full text-[6px]"
                      style={{
                        background:
                          lowerCase(getCurrentDay) === lowerCase(day.day)
                            ? "#17BEBB"
                            : "#0E2D52",
                      }}
                    ></span>
                  </FlexRowStartBtw>
                </div>
                <div className="w-full col-span-2 px-[20px]">
                  <FlexRowEnd className="w-full">
                    <span
                      className="text-[12px] font-normal font-pp leading-[14px] mt-[3px] md:text-[13px] md:leading-[16.32px]"
                      style={{
                        color:
                          lowerCase(getCurrentDay) === lowerCase(day.day)
                            ? "#17BEBB"
                            : "#0E2D52",
                      }}
                    >
                      {day.openTime} - {day.closeTime}
                    </span>
                  </FlexRowEnd>
                </div>
              </Fragment>
            );
          })}
        </motion.div>
      )}
    </FlexColStart>
  );
}
