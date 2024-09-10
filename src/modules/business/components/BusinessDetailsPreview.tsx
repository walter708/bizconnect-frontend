import {
  FlexColStart,
  FlexRowEnd,
  FlexRowEndBtw,
  FlexRowStart,
  FlexRowStartBtw,
} from "@/components/Flex";
import React from "react";
import BusinessHoursStatus from "./businessHoursStatus";
import SocialLinks from "@/modules/businessDetails/components/SocialLinks";
import type { IBusinessProfile } from "@/types/business-profile";
import ReadMoreText from "@/components/ReadMoreText";
import ContactCard from "@/modules/businessDetails/components/ContactCard";
import { Edit, Mail, MapPin, Phone } from "@/components/icons";
import OpeningHoursDrd from "@/modules/businessDetails/components/OpeningHoursDrd";
import { SlotDays } from "@/data/dateTimeSlot";
import { determineBusOpTime, orderDaysOfOperation } from "@/utils";
import Button from "@/components/ui/button";

type BusinessDetailsPreviewProps = {
  businessDetails: IBusinessProfile;
  onDelete?: () => void;
  hideActionButtons?: boolean;
  openHourDrd?: boolean;
  isBusinessDetailsPage?: boolean;
};

export default function BusinessDetailsPreview({
  businessDetails,
  onDelete,
  hideActionButtons = false,
  openHourDrd = false,
  isBusinessDetailsPage = false,
}: BusinessDetailsPreviewProps) {
  const getCurrentDay = SlotDays[new Date().getDay()];
  const orderedDays = orderDaysOfOperation(
    businessDetails?.operationDays ?? []
  );

  const hasBusinessClosed = determineBusOpTime(
    businessDetails?.operationDays ?? []
  );

  const constructSocialLinks = () => {
    const bizLinks = [
      {
        name: "facebook",
        url: businessDetails?.facebookUrl,
      },
      {
        name: "instagram",
        url: businessDetails?.instagramUrl,
      },
      {
        name: "twitter",
        url: businessDetails?.twitterUrl,
      },
      {
        name: "website",
        url: businessDetails?.websiteUrl,
      },
    ];
    return bizLinks;
  };
  const socialLinks = constructSocialLinks();

  return (
    <FlexColStart className="w-full h-full md:px-[28px] px-4">
      {/* name and category*/}
      <FlexRowStartBtw className="w-full">
        <FlexColStart className="w-full gap-1">
          {/* hide on mobile */}
          {isBusinessDetailsPage ? (
            <FlexRowStartBtw className="w-full">
              <BusinessHoursStatus
                isOpen={hasBusinessClosed.isOpened}
                closingTime={hasBusinessClosed.closingTime}
                className="mb-0 mt-0"
              />

              <FlexRowEnd className="w-full -translate-y-2">
                <SocialLinks
                  socialLinks={socialLinks as any}
                  className="w-auto mt-0 pb-0"
                  labelClassName="hidden"
                />
              </FlexRowEnd>
            </FlexRowStartBtw>
          ) : (
            <FlexRowStartBtw className="hidden md:block">
              <BusinessHoursStatus
                isOpen={hasBusinessClosed.isOpened}
                closingTime={hasBusinessClosed.closingTime}
                className="mb-0 mt-0"
              />
            </FlexRowStartBtw>
          )}

          <h1 className="text-[25px] text-blue-200 leading-[27.2px] font-bold">
            {businessDetails?.name}
          </h1>
          <p className="text-[13px] font-normal font-pp leading-[15px] text-blue-200/50">
            {businessDetails?.businessCategory?.description}
          </p>
        </FlexColStart>

        {!hideActionButtons && (
          <button onClick={onDelete} className="-translate-y-2">
            <img width={45} src="/assets/icons/trash.svg" alt="trash" />
          </button>
        )}
      </FlexRowStartBtw>

      {!isBusinessDetailsPage && (
        <FlexRowEndBtw className="w-full ">
          {/* hide on desktop */}
          <div className="block md:hidden">
            <BusinessHoursStatus
              isOpen={hasBusinessClosed.isOpened}
              closingTime={hasBusinessClosed.closingTime}
            />
          </div>
          <FlexRowEnd className="w-full">
            <SocialLinks
              socialLinks={socialLinks as any}
              className="w-auto mt-0 pb-0"
              labelClassName="hidden"
            />
          </FlexRowEnd>
        </FlexRowEndBtw>
      )}

      {/* description */}
      <FlexColStart className="w-full gap-1 mt-4">
        <p className="text-gray-103 text-[11px] md:text-[13px] leading-[14.14px] font-normal mb-2">
          Description
        </p>
        <ReadMoreText text={businessDetails?.description ?? "N/A"} />
      </FlexColStart>

      {/* contact info */}
      <FlexColStart className="mt-[15px] gap-0">
        <span className="text-[11px] md:text-[13px] leading-[13px] font-normal font-archivo text-gray-103">
          Contact Info
        </span>

        <FlexColStart className="gap-2">
          <ContactCard
            title="Address"
            tagline={`${businessDetails?.city}, ${businessDetails?.stateAndProvince}`}
            icon={
              <MapPin size={20} strokeWidth={1.5} className="stroke-dark-100" />
            }
          />
          <ContactCard
            title="Mobile"
            tagline={businessDetails?.phoneNumber ?? "N/A"}
            icon={
              <Phone size={20} strokeWidth={1.5} className="stroke-dark-100" />
            }
          />
          <ContactCard
            title="Email"
            tagline={businessDetails?.businessEmail ?? "N/A"}
            icon={
              <Mail size={20} strokeWidth={1.5} className="stroke-dark-100" />
            }
          />
        </FlexColStart>
      </FlexColStart>

      {/* opening hours */}
      <div className="w-full mt-3">
        <OpeningHoursDrd
          openingHoursCalendar={orderedDays}
          getCurrentDay={getCurrentDay}
          open={openHourDrd ?? true}
        />
      </div>

      {/* actions */}
      {!hideActionButtons && (
        <FlexRowStart className="w-full gap-5 mt-5">
          <Button
            href={`/register-business?update=${
              businessDetails && businessDetails.uuid
            }`}
            intent="primary"
            className="w-auto h-[45px] mt-4 rounded-md pt-[10px] gap-[7px] flex-center"
            hardRefresh={true}
            leftIcon={<Edit size={15} className="stroke-white-100" />}
          >
            <span className="font-medium text-[14px] leading-[14px] text-white-100 ">
              Edit Business Details
            </span>
          </Button>
        </FlexRowStart>
      )}
    </FlexColStart>
  );
}
