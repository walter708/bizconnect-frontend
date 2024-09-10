import { FlexColStart } from "@components/Flex";
import { IBusinessProfile } from "@/types/business-profile";
import { constructBizImgUrl } from "@/utils";
import BusinessesNotfound from "@/components/NotFound";
import {
  ColLayoutCard,
  RowLayoutCard,
} from "@/modules/search/components/LayoutCard";
import { cn } from "@/lib/utils";

interface SimilarBusinessesProps {
  layout: "col" | "row";
  businesses: CombBusinessesDataTypes[];
  windowLocation: string;
}

type CombBusinessesDataTypes = IBusinessProfile & { category: string[] };

const SimilarBusinesses = ({
  businesses,
  layout,
  windowLocation,
}: SimilarBusinessesProps) => {
  return (
    <FlexColStart className="w-full mt-[20px]">
      <FlexColStart
        className={cn(
          "flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5",
          "w-full gap-[20px]"
        )}
      >
        {businesses?.length > 0 &&
          businesses.map((businesses) => {
            const businessesImg = constructBizImgUrl(
              businesses.croppedImageUrl!
            );
            return layout === "col" ? (
              <ColLayoutCard
                name={businesses.name ?? "N/A"}
                categories={businesses?.category as string[]}
                location={`${businesses.city}, ${businesses.stateAndProvince}`}
                operationDays={businesses.operationDays}
                phone={businesses.phoneNumber ?? "N/A"}
                image={businessesImg}
                _key={businesses.uuid!}
                id={businesses.uuid}
                key={businesses.uuid}
                _urlLocation={`${businesses.country}-${businesses.stateAndProvince}`}
                windowLocation={windowLocation}
              />
            ) : (
              <RowLayoutCard
                name={businesses.name ?? "N/A"}
                categories={businesses?.category as string[]}
                location={`${businesses.city}, ${businesses.stateAndProvince}`}
                operationDays={businesses.operationDays}
                phone={businesses.phoneNumber ?? "N/A"}
                image={businessesImg}
                _key={businesses.uuid!}
                id={businesses.uuid}
                key={businesses.uuid}
                _urlLocation={`${businesses.country}-${businesses.stateAndProvince}`}
                windowLocation={windowLocation}
              />
            );
          })}
      </FlexColStart>
      {businesses?.length === 0 && (
        <BusinessesNotfound message="No similar businesses found." />
      )}
    </FlexColStart>
  );
};

export default SimilarBusinesses;
