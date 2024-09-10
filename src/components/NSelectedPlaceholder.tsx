import { FlexRowStart, FlexRowStartCenter } from "./Flex";
import { X } from "./icons";

interface NSelectedPlaceholderProps {
  selectedValues: { uuid?: string; value?: string }[];
  getPlaceholder: (id: string | null) => void;
  type: "businessCategory" | "daysOfOperation";
}

/**
 * @description - This component is used to display the selected values in the placeholder (register-business page)
 * @param selectedValues - The selected values to display in the placeholder
 * @param getPlaceholder - The function to call when a placeholder is clicked
 * @param type - The type of placeholder
 * @returns null if no placeholder is found, otherwise the placeholder is returned
 */

export default function NSelectedPlaceholder({
  selectedValues,
  getPlaceholder,
  type,
}: NSelectedPlaceholderProps) {
  return (
    <FlexRowStart className="w-auto">
      {selectedValues.map((d) => (
        <FlexRowStartCenter
          key={d.uuid}
          className="w-auto px-[10px] py-[7px] bg-gray-201 rounded-full"
        >
          <span className="text-[11px] font-inter tracking-normal leading-[13px] font-semibold text-blue-200 ml-[5px]">
            {type === "daysOfOperation" ? d.value?.slice(0, 3) : d.value}
          </span>
          <button
            className="flex items-center justify-start border-none outline-none cursor-pointer transition-all p-0 m-0"
            onClick={() => {
              getPlaceholder(d.uuid || null);
            }}
          >
            <X size={15} className="text-[5px] text-gray-100" />
          </button>
        </FlexRowStartCenter>
      ))}
    </FlexRowStart>
  );
}
