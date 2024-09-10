import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NSelect } from "./NewFilterComponent/NSelect";
import { FlexColStart, FlexRowStart, FlexRowStartBtw } from "./Flex";
import { cn } from "@/lib/utils";
import type {
  BusinessProfileFormikPropsValues,
  OperationDays,
} from "@/types/business";
import { Plus, X } from "./icons";
import { SlotDaysType, SlotDays, SlotHours } from "../data/dateTimeSlot";

interface DateTimeSlotsProps {
  operationDays?: OperationDays;
  getDaysOfOperation?: (newSlots: OperationDays) => void;
  label?: string;
  formikValues?: BusinessProfileFormikPropsValues;
}

export default function DateTimeSlots({
  operationDays,
  getDaysOfOperation,
  label,
  formikValues,
}: DateTimeSlotsProps) {
  const [slots, setSlots] = useState<OperationDays>(
    operationDays && operationDays?.length > 0
      ? operationDays
      : ([
          { day: "Monday", openTime: "9:00 AM", closeTime: "5:00 PM" },
        ] as OperationDays)
  );

  const deleteSlot = (index: number) => {
    const newSlots = [...slots];
    newSlots.splice(index, 1);
    setSlots(newSlots);
  };

  const addSlot = () => {
    if (slots.length === 7) return;

    const daysWithSlots = new Set(
      slots
        .filter((slot) => slot.day !== null)
        .map((slot) => slot.day as SlotDaysType)
    );
    const nextAvailableDay =
      SlotDays.find((day) => !daysWithSlots.has(day)) || null;

    const newSlot: OperationDays[0] = {
      day: nextAvailableDay as SlotDaysType,
      openTime: "9:00 AM",
      closeTime: "5:00 PM",
    };

    setSlots([...slots, newSlot]);
  };

  useEffect(() => {
    getDaysOfOperation && getDaysOfOperation(slots);
  }, [slots]);

  return (
    <FlexColStart className="w-full pb-2 gap-1">
      <span className="text-sm font-archivo font-semibold text-blue-200">
        {label || "Setup opening hours"} <span className="text-red-305">*</span>
      </span>
      <FlexColStart className="w-full gap-5">
        {slots.map((slot, index) => {
          return (
            <Slots
              key={index}
              day={slot.day as SlotDaysType}
              openTime={slot.openTime}
              closeTime={slot.closeTime}
              slots={slots}
              deleteSlot={deleteSlot}
              slotIndex={index}
              getUpdatedSlot={(slot, index) => {
                const prevSlots = [...slots];
                prevSlots[index] = {
                  day: slot.day,
                  openTime: slot.openTime,
                  closeTime: slot.closeTime,
                };
                setSlots(prevSlots);
              }}
              formikValues={formikValues}
            />
          );
        })}
      </FlexColStart>

      {slots.length !== 7 && (
        <FlexRowStart className="w-full mt-5">
          <button
            className="w-auto flex-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={addSlot}
            disabled={slots.length === 7}
          >
            <Plus
              size={18}
              className="p-1 rounded-full bg-blue-200 stroke-white-100"
            />
            <span className="text-[13px] font-archivo font-medium text-blue-200 underline">
              Add more
            </span>
          </button>
        </FlexRowStart>
      )}
    </FlexColStart>
  );
}

interface SlotsProps {
  day: SlotDaysType | null;
  openTime: string | null;
  closeTime: string | null;
  slots: OperationDays;
  deleteSlot: (index: number) => void;
  slotIndex: number;
  getUpdatedSlot: (newSlots: OperationDays[0], index: number) => void;
  formikValues?: BusinessProfileFormikPropsValues;
}

function Slots({
  day,
  openTime,
  closeTime,
  slots,
  deleteSlot,
  slotIndex,
  getUpdatedSlot,
  formikValues,
}: SlotsProps) {
  const fields = ["day", "openTime", "closeTime"];


  const getSlotValue = (slot: string) => {
    if (slot === "day")
      return SlotDays.includes(day as SlotDaysType) ? day : null;
    if (slot === "openTime") {
      if (openTime && openTime.startsWith("0")) {
        return SlotHours.includes(openTime) ? openTime : null;
      } else {
        const formattedOpenTime = openTime?.replace(/^(\d):/, "0$1:");
        return SlotHours.map((h) => h.replace(/^0/, "")).includes(
          openTime as string
        )
          ? formattedOpenTime
          : null;
      }
    }
    if (slot === "closeTime") {
      if (closeTime && closeTime.startsWith("0")) {
        return SlotHours.includes(closeTime) ? closeTime : null;
      } else {
        const formattedCloseTime = closeTime?.replace(/^(\d):/, "0$1:");
        return SlotHours.map((h) => h.replace(/^0/, "")).includes(
          closeTime as string
        )
          ? formattedCloseTime
          : null;
      }
    }
    return null;
  };

  const getLabel = (slot: string) => {
    if (slot === "day") return "Day";
    if (slot === "openTime") return "Opening Time";
    if (slot === "closeTime") return "Closing Time";
  };

  const handleItemSelect = (
    slot: string,
    slotValue: string,
    cb: () => void
  ) => {
    cb();
    const newSlots = { ...slots[slotIndex], [slot]: slotValue };
    getUpdatedSlot(newSlots, slotIndex);
  };

  const renderSlotData = useCallback(
    (slot: string, cb: () => void) => {
      const defaultClass =
        "w-full flex items-start justify-start p-[16px] text-dark-100 hover:bg-blue-103 text-[12px] font-archivo font-normal disabled:opacity-50 disabled:cursor-not-allowed";
      if (slot === "day") {
        const daysWithSlots = slots
          .filter((slot) => slot.day !== null)
          .map((slot) => slot.day);
        return SlotDays.filter((day) => !daysWithSlots.includes(day)).map(
          (day) => (
            <button
              className={cn(defaultClass)}
              key={day}
              onClick={() => handleItemSelect(slot, day, cb)}
              disabled={slots.some((slot) => slot.day === day)}
            >
              {day}
            </button>
          )
        );
      }
      if (slot === "openTime") {
        return SlotHours.map((hour) => (
          <button
            className={cn(defaultClass)}
            key={hour}
            onClick={() => handleItemSelect(slot, hour, cb)}
          >
            {hour}
          </button>
        ));
      }
      if (slot === "closeTime") {
        const hoursWithSlots = slots
          .filter((slot) => slot.closeTime !== null)
          .map((slot) => slot.closeTime);
        return SlotHours.map((hour) => (
          <button
            className={cn(defaultClass)}
            key={hour}
            onClick={() => handleItemSelect(slot, hour, cb)}
          >
            {hour}
          </button>
        ));
      }
      return null;
    },
    [handleItemSelect]
  );

  return (
    <FlexRowStartBtw className="w-full relative">
      {fields.map((field) => {
        return (
          <>
            <NSelect
              label={slots.length > 1 && slotIndex > 0 ? "" : getLabel(field)}
              placeholder={"--"}
              value={getSlotValue(field)}
              className={cn("w-full")}
              parentClassName="w-[200px] gap-[1px]"
              labelClassName="text-[12px] text-white-400"
              popoverContentClassName="p-0"
              hideSearch
              render={({ closePanel }) => (
                <ul className="w-full max-h-[200px] hideScrollBar">
                  {renderSlotData(field, () => {
                    closePanel && closePanel();
                  })}
                </ul>
              )}
            />
            {slots.length > 1 && slotIndex !== 0 && (
              <button
                className="absolute -right-1 -top-3 z-50 cursor-pointer p-1 rounded-full bg-blue-200 flex flex-col items-center justify-center enableBounceEffect"
                onClick={() => deleteSlot(slotIndex)}
              >
                <X size={12} className="stroke-white-100" />
              </button>
            )}
          </>
        );
      })}
    </FlexRowStartBtw>
  );
}
