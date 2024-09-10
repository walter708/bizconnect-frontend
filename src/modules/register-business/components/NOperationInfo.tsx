"use client";
import { FlexColCenter, FlexColStart, FlexRowCenter } from "@/components/Flex";
import {
  Facebook,
  Globe,
  Instagram,
  LinkedIn,
  Mail,
  Phone,
} from "@/components/icons";
import Input from "@/components/ui/input";
import type { BusinessProfileFormikPropsValues } from "@/types/business";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import Divider from "@/components/Divider";
import DateTimeSlots from "@/components/DateTimeSlots";

interface NOperationInfoProps {
  values: BusinessProfileFormikPropsValues;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: FormikErrors<BusinessProfileFormikPropsValues>;
  touched: FormikTouched<BusinessProfileFormikPropsValues>;
  setFieldTouched: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean
  ) => void;
  setFieldError: (field: string, message: string | undefined) => void;
  handleSubmit: (values: BusinessProfileFormikPropsValues) => void;
  businessId?: string;
  isLoading?: boolean;
}

type SupportedSocialMedia = "instagram" | "website" | "linkedin" | "facebook";

const socialMediaLinksInput = [
  "instagram",
  "website",
  "linkedin",
  "facebook",
] as SupportedSocialMedia[];

const NOperationInfo: React.FC<NOperationInfoProps> = ({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  errors,
  touched,
  handleSubmit,
  setFieldTouched,
  setFieldError,
  businessId,
  isLoading,
}) => {
  const getLinkValue = (socialIconName: SupportedSocialMedia) => {
    switch (socialIconName) {
      case "instagram":
        return values.instagramUrl;
      case "website":
        return values.websiteUrl;
      case "linkedin":
        return values.linkedinUrl;
      case "facebook":
        return values.facebookUrl;
      default:
        return "";
    }
  };

  console.log(values);

  return (
    <FlexColStart className="w-full h-full bg-gray-205  ">
      <FlexColStart className="w-full h-auto text-center bg-white-100 px-3 pb-[23px] gap-0 rounded-[8px]">
        <FlexColCenter className="w-full h-auto my-[24px] gap-0">
          <h4 className="text-[16px] text-center font-bold font-pp leading-[24px] text-blue-200">
            {businessId ? "Update" : "Setup"} Your Business Profile
          </h4>
          <h6 className="text-[15px] text-gray-103 font-pp font-normal leading-[17.89px]">
            Operation Info
          </h6>
        </FlexColCenter>

        <Input
          type="tel"
          name="phoneNumber"
          value={values.phoneNumber}
          onChange={handleChange}
          label="Business Phone Number"
          rightIcon={
            <Phone className="stroke-none fill-blue-200 scale-[.75]" />
          }
          placeholder="Enter Phone Number"
          parentClassname="w-full px-0 border border-white-400/50 px-3"
          inputClassname="w-full px-3 outline-none border-none"
        />

        <Input
          type="email"
          name="businessEmail"
          value={values.businessEmail}
          onChange={handleChange}
          label="Business Email"
          rightIcon={
            <Mail
              strokeWidth={1}
              className="stroke-white-100 fill-blue-200 rounded-md scale-[.85]"
            />
          }
          placeholder="Enter Business Email"
          parentClassname="w-full px-0 border border-white-400/50 px-3"
          inputClassname="w-full px-3 outline-none border-none"
        />

        <Divider />
        {/* business timing */}
        <DateTimeSlots
          operationDays={values.operationDays}
          getDaysOfOperation={(slot) => {
            setFieldValue("operationDays", slot);
          }}
          formikValues={values}
        />
        <Divider />

        <FlexColCenter className="w-full gap-5">
          <h4 className="mt-[10px] text-[15px] font-pp font-semibold text-blue-200">
            Add social media links{" "}
            <span className="ml-1 text-white-400/50 text-xs font-normal font-pp">
              (optional)
            </span>
          </h4>
          {socialMediaLinksInput.map((socialIconName) => {
            const formattedSocialIconName =
              socialIconName.charAt(0).toUpperCase() + socialIconName.slice(1);
            const linkName = socialIconName.toLowerCase() + "Url";

            return (
              <div className="w-full mb-[24px]" key={socialIconName}>
                <FlexRowCenter className="w-full relative">
                  {renderSocialMediaIcons(socialIconName)}
                  <input
                    className="w-full rounded-[5px]  p-[16px] border-[1px] border-dark-103 text-[12px] font-pp font-medium leading-[14px] tracking-wide text-blue-200 pl-[60px]"
                    name={linkName}
                    type="url"
                    placeholder={`copy and paste ${formattedSocialIconName} Link`}
                    value={getLinkValue(socialIconName)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FlexRowCenter>
              </div>
            );
          })}
        </FlexColCenter>

        <FlexColCenter className="w-full">
          <Button
            intent={"primary"}
            size={"lg"}
            className="w-full rounded-[5px] mt-5"
            isLoading={isLoading}
            spinnerColor="#000"
            onClick={() => handleSubmit(values)}
            type="submit"
          >
            <span className="text-[14px] font-pp">
              {businessId ? `Update Profile` : `Submit Profile`}
            </span>
          </Button>
        </FlexColCenter>
      </FlexColStart>
    </FlexColStart>
  );
};

NOperationInfo.displayName = "NOperationInfo";

export default NOperationInfo;

const renderSocialMediaIcons = (name: SupportedSocialMedia) => {
  let icon = null;
  let defaultClass = "absolute left-4 scale-[.75] stroke-blue-200 ";
  switch (name) {
    case "instagram":
      icon = <Instagram className={cn(defaultClass, "left-5")} />;
      break;
    case "website":
      icon = <Globe className={cn(defaultClass, "left-5")} />;
      break;
    case "linkedin":
      icon = (
        <LinkedIn
          strokeWidth={2.5}
          className={cn(defaultClass, "left-5 fill-blue-200 stroke-none")}
        />
      );
      break;
    case "facebook":
      icon = (
        <Facebook
          className={cn(defaultClass, "left-5 stroke-none fill-blue-200")}
        />
      );
      break;
    default:
      break;
  }
  return icon;
};
