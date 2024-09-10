import { FlexColStart } from "@components/Flex";
import { IOption, UserBusinessList } from "@/types/business";
import { constructBizImgUrl } from "@/utils";
import { ColLayoutCard, RowLayoutCard } from "./LayoutCard";

interface BusinessCardContainerProps {
  data: UserBusinessList[];
  businessCategories: IOption[] | undefined;
  layout: "row" | "col";
}

const BusinessCardContainer = ({
  data,
  businessCategories,
  layout,
}: BusinessCardContainerProps) => {
  return (
    <FlexColStart className="w-full px-[20px] md:px-[30px] -translate-y-8 business-card-container flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center justify-center">
      {data?.length > 0
        ? data.map((bd) => {
            const categories = businessCategories
              ?.filter((c) => c.uuid === bd.businessCategoryUuid)
              .map((c) => c.value);

            const commonProps = {
              id: bd.uuid,
              name: bd.name,
              categories: categories,
              location: `${bd.city}, ${bd.stateAndProvince}`,
              operationDays: bd.operationDays,
              phone: bd.phoneNumber || "",
              image: constructBizImgUrl(bd.croppedImageUrl)!,
              _key: bd.uuid,
              key: bd.uuid,
              _urlLocation: `${bd.country}-${bd.stateAndProvince}`,
              windowLocation: window.location.href,
            };

            return layout === "col" ? (
              <ColLayoutCard {...commonProps} />
            ) : (
              <RowLayoutCard {...commonProps} />
            );
          })
        : null}
    </FlexColStart>
  );
};

export default BusinessCardContainer;
