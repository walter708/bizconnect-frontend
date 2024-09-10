import type { SlotDaysType } from "@/data/dateTimeSlot";
import { BaseResponseMessage } from "./auth";

export type BusinessProfileFormikPropsValues = {
  businessName: string;
  description: string;
  businessCategory: string;
  country: string;
  stateAndProvince: string;
  city: string;
  street: string;
  postalCode: string;
  image: string | null; // Now a string
  instagramUrl: string;
  websiteUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  phoneNumber: string;
  businessEmail: string;
  operationDays: OperationDays;
  cropped: string;
  uncropped: string;
};

export interface BusinessCreationBody {
  name: string;
  description: string;
  businessCategoryUuid: string;
  country: string;
  stateAndProvince: string;
  city: string;
  street?: string;
  postalCode?: string;
  phoneNumber?: string | null;
  businessEmail?: string | null;
  operationDays: OperationDays;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  // twitterUrl?: string | null;
  facebookUrl?: string | null;
  image?: {
    croppedUrl: string | null;
    originalUrl: string | null;
  } | null;
  cloudinaryConfig?: {
    versions?: {
      cropped?: number | null;
      original?: number | null;
    };
    publicIds?: {
      cropped?: string | null;
      original?: string | null;
    };
    signatures?: {
      cropped?: string | null;
      original?: string | null;
    };
  } | null;
}

export interface UpdateBusinessBody extends BusinessCreationBody {
  uuid: string;
  deleteImage?: boolean;
}

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
  resource_type: string;
  tags: [];
  folder: string;
  original_extension: string;
  api_key: string;
}

export interface businessCategories {
  uuid: string;
  description: string;
}

export interface UserBusinessList {
  uuid: string;
  userUuid: string;
  name: string;
  description: string;
  businessCategoryUuid: string;
  country: string;
  stateAndProvince: string;
  city: string;
  street: string | null;
  postalCode: string | null;
  logoUrl: string | null;
  phoneNumber: string | null;
  businessEmail: string | null;
  operationDays: OperationDays;
  imageUrl: string | null;
  croppedImageUrl: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  facebookUrl: string | null;
  createdUtc: string;
  modifiedUtc: string;
  businessCategory: {
    uuid: string;
    description: string;
  };
}

export interface UserBusinessListResponse extends BaseResponseMessage {
  data: {
    businessProfiles: UserBusinessList[];
  };
}

export interface UserBusinessDetailsResponse extends BaseResponseMessage {
  data: {
    details: UserBusinessList;
  };
}

export interface BusinessCategories extends BaseResponseMessage {
  data: {
    businessCategories: businessCategories[];
  };
}

export interface UploadSignature extends BaseResponseMessage {
  data: {
    timestamp: number;
    signature: string;
  };
}

export interface IOption {
  uuid: string;
  value: string;
}

export interface ContactSupportDataSchema {
  personName: string;
  email: string;
  phoneNumber: string;
  problemDescription: string;
}
export interface ContactSupportResponse extends BaseResponseMessage {
  data: {
    message: string;
  };
}

export type MultiSearchType = "multi" | "single";

export type BusinessListingLayouts = "row" | "col";

export enum BusinessFilterType {
  BUSINESS_CATEGORY = "businessCategory",
  COUNTRY = "country",
  STATE = "stateAndProvince",
  CITY = "city",
}

export type RegisterBusinessTabs = "business-profile" | "operations-info";

export type OperationDays = {
  day: SlotDaysType;
  openTime: string;
  closeTime: string;
}[];

export type ValidSocialMedia =
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "tiktok"
  | "website";
