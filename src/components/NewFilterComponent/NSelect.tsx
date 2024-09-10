import React, { useState, useRef, ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Loader } from "../icons";
import {
  FlexColStart,
  FlexRowCenterBtw,
  FlexRowEndCenter,
  FlexRowStartCenter,
} from "../Flex";
import { cn } from "@/lib/utils";

export interface RenderProps {
  searchResult:
    | { value: string; id?: string; uuid?: string; label?: string }[]
    | [];
  searchValue: string;
  value?: Record<string, string | null>;
  setValue?: React.Dispatch<
    React.SetStateAction<Record<string, string | null>>
  >;
  closePanel?: () => void;
  activeItem: string | null;
  clearSearch?: () => void;
  required?: boolean;
}

type Items = { value: string; id?: string; uuid?: string; label?: string }[];

interface NSelectProps {
  placeholder?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: React.ComponentProps<"div">["className"];
  parentClassName?: React.ComponentProps<"div">["className"];
  labelClassName?: React.ComponentProps<"label">["className"];
  popoverContentClassName?: React.ComponentProps<"div">["className"];
  valueClassName?: React.ComponentProps<"div">["className"];
  label?: string;
  items?: Items;
  searchKey?: "value" | "id";
  disabled?: boolean;
  error?: string | null;
  render: (props: RenderProps) => React.ReactElement;
  value?: string | null;
  loading?: boolean;
  onClick?: () => void;
  activeItem?: string | null;
  hideSearch?: boolean;
  required?: boolean;
}

export function NSelect({
  placeholder = "Select an option",
  leftIcon,
  rightIcon,
  className,
  label,
  items,
  searchKey,
  disabled,
  error,
  render,
  loading,
  onClick,
  activeItem,
  value,
  parentClassName,
  hideSearch,
  required,
  labelClassName,
  popoverContentClassName,
  valueClassName,
}: NSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Items>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && onClick) {
      onClick();
    }
  };

  const onSearchChange = (value: string) => {
    if (items && items?.length > 0) {
      if (value.length > 0) {
        const result = items?.filter((item) => {
          // @ts-expect-error
          return item[searchKey ?? "value"]
            .toLowerCase()
            .includes(value.toLowerCase().trim());
        });
        setSearchResult(result);
      } else {
        setSearchResult(items);
      }
    }
  };

  return (
    <FlexColStart
      className={cn("w-full gap-1", parentClassName)}
      id="nselect-parent"
    >
      <label
        className={cn(
          "text-[14px] font-normal font-archivo text-blue-200",
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-red-305">*</span>}
      </label>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          className={cn(
            "w-full h-[46px] border-[1.5px] border-solid tracking-[0px] text-[12px] text-blue-200 px-4 rounded-[5px] disabled:opacity-[.5] disabled:cursor-not-allowed disabled:bg-white-400/10",
            error && error?.length > 0 && "border-red-305",
            open ? "border-blue-200/60" : "border-white-400/30",
            className
          )}
          disabled={disabled}
        >
          <FlexRowCenterBtw className="w-full">
            <FlexRowStartCenter className="w-auto">
              <span>{leftIcon}</span>
              <span
                className={cn(
                  "text-xs font-archivo text-dark-100 font-medium",
                  placeholder && !value && "opacity-[.4] font-normal",
                  valueClassName
                )}
              >
                {!value ? placeholder ?? "Select..." : value}
              </span>
            </FlexRowStartCenter>
            <FlexRowEndCenter className="w-auto">
              {loading && (
                <Loader className="stroke-dark-100 animate-spin" size={20} />
              )}
              <span>{rightIcon ?? <ChevronDown size={20} />}</span>
            </FlexRowEndCenter>
          </FlexRowCenterBtw>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]",
            popoverContentClassName
          )}
          ref={popoverRef}
        >
          <FlexColStart className="w-full p-0">
            {!hideSearch && (
              <FlexRowStartCenter className="w-full">
                <input
                  type="text"
                  className="w-full focus:ring-0 focus:border-t-transparent focus:border-l-transparent focus:border-r-transparent border-b-[1px] border-b-solid focus:border-b-white-400/30 px-[3px] py-[2px] text-[15px] placeholder:text-blue-200/50 font-archivo"
                  placeholder="Search..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchValue(e.target.value);
                    onSearchChange(e.target.value);
                  }}
                />
              </FlexRowStartCenter>
            )}
            <ScrollArea className="w-full hideScrollBar">
              {render &&
                render({
                  searchResult,
                  searchValue,
                  closePanel: () => setOpen(false),
                  activeItem: activeItem!,
                  clearSearch: () => setSearchValue(""),
                })}
            </ScrollArea>
          </FlexColStart>
        </PopoverContent>
      </Popover>
    </FlexColStart>
  );
}

interface NSelectItemProps {
  value: string;
  onClick: () => void;
  active?: boolean;
  className?: React.ComponentProps<"div">["className"];
  href?: string;
}

export function NSelectItems({
  value,
  onClick,
  active,
  className,
  href,
}: NSelectItemProps) {
  return (
    <>
      {href ? (
        <a
          href={href}
          className={cn(
            "w-full h-[35px] px-3 rounded-md flex items-center gap-2 font-archivo text-sm cursor-pointer",
            active ? "bg-blue-200 text-white-100" : " text-dark-100",
            className
          )}
        >
          {value}
        </a>
      ) : (
        <button
          className={cn(
            "w-full h-[35px] px-3 rounded-md flex items-center gap-2 font-archivo text-sm cursor-pointer",
            active ? "bg-blue-200 text-white-100" : " text-dark-100",
            className
          )}
          onClick={onClick}
        >
          <span>{value}</span>
        </button>
      )}
    </>
  );
}

interface NItemNotFound {
  text?: string;
  className?: React.ComponentProps<"div">["className"];
}

export function NItemNotFound({ text, className }: NItemNotFound) {
  return (
    <p
      className={cn(
        "w-full h-[40px] text-sm font-archivo text-white-400/60 flex items-center justify-center",
        className
      )}
    >
      {text ?? "No result found"}
    </p>
  );
}
