import { FlexColCenter, FlexRowCenterBtw } from "@/components/Flex";
import Button from "@/components/ui/button";
import type { IBusinessProfile } from "@/types/business-profile";

export default function DeleteBusinessModalCard({
  businessDetails,
  onDelete,
  closeModal,
  isLoading,
}: {
  businessDetails: IBusinessProfile;
  onDelete: (id: string) => void;
  closeModal: () => void;
  isLoading: boolean;
}) {
  return (
    <FlexColCenter className="w-[450px] py-5 px-10">
      <img src="/assets/icons/delete-modal.svg" alt="" />
      <FlexColCenter className="w-full gap-2 mt-4 px-5">
        <p className="w-full text-center text-gray-500 text-[15px] font-medium">
          Are you sure you want to delete{" "}
          <span className="font-bold text-black">{`"${businessDetails?.name}"`}</span>{" "}
          business profile?
        </p>
        <p className="w-full text-center text-gray-500 text-[13px] font-normal leading-[20px]">
          This action will <span className="font-bold">permanently</span> remove
          this business from your list of businesses
        </p>
      </FlexColCenter>
      <br />
      <FlexRowCenterBtw className="w-auto gap-10">
        <Button
          intent={"transparent"}
          className={
            "text-gray-103 bg-blue-204 h-[45px] px-[25px] text-center cursor-pointer rounded-[5px] font-normal border-[.2px] border-white-400/30 enableBounceEffect"
          }
          onClick={() => closeModal()}
        >
          Cancel
        </Button>
        <Button
          intent={"error"}
          isLoading={isLoading}
          disabled={isLoading}
          className={
            "h-[45px] px-[25px] rounded-[5px] font-normal disabled:bg-red-301 enableBounceEffect"
          }
          onClick={() => onDelete(businessDetails.uuid)}
        >
          Delete
        </Button>
      </FlexRowCenterBtw>
    </FlexColCenter>
  );
}
