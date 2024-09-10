import { CloudinaryConfig, DEFAULT_BIZ_IMAGE } from "@/config";
import { DaysByDayNumber } from "@/data/dateTimeSlot";
import type { OperationDays } from "@/types/business";
import type { INFilters, ISearch } from "@/types/business-profile";
import type { AxiosError } from "axios";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms * 1000));

export const removeAMPM = (time: string) => {
  return time.replace(/(am|pm|AM|PM)/gi, "");
};

interface DaysOfOperation {
  day: string | null;
  openTime: string | null;
  closeTime: string | null;
}

export const determineBusOpTime = (daysOfOperation: DaysOfOperation[]) => {
  if (!Array.isArray(daysOfOperation) || daysOfOperation.length === 0)
    return { isOpened: false, closingTime: null };

  const now = new Date();
  const today = now.getDay();
  const day = daysOfOperation?.find(
    (d) => lowerCase(d.day) === lowerCase(DaysByDayNumber[today])
  );

  if (day && day.openTime && day.closeTime) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const parseTime = (timeStr: string) => {
      const [time, period] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (period.toLowerCase() === "pm" && hours !== 12) hours += 12;
      if (period.toLowerCase() === "am" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const openMinutes = parseTime(day.openTime);
    const closeMinutes = parseTime(day.closeTime);

    const isOpenPastMidnight = closeMinutes < openMinutes;
    const isOpen = isOpenPastMidnight
      ? currentMinutes >= openMinutes || currentMinutes < closeMinutes
      : currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    return {
      isOpened: isOpen,
      closingTime: isOpen ? day.closeTime : null,
    };
  }

  return { isOpened: false, closingTime: null };
};

export const orderDaysOfOperation = (daysOfOperation: OperationDays) => {
  if (!daysOfOperation || daysOfOperation.length === 0) return daysOfOperation;
  return daysOfOperation.sort((a, b) => {
    return (
      Object.values(DaysByDayNumber).indexOf(a.day) -
      Object.values(DaysByDayNumber).indexOf(b.day)
    );
  });
};

export const capitalizeFirstLetter = (str: string) => {
  if (!str || str.length === 0) return str;

  return str.slice(0, 1).toUpperCase() + str.slice(1);
};

export const isImgUrlValid = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e: unknown) {
    return false;
  }
};

export const isUrlValid = (url: string) => {
  try {
    // first stage of validation
    new URL(url);

    // second stage (regexp)
    const urlRegex =
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const result = url.match(urlRegex);

    return result !== null;
  } catch (e: any) {
    return false;
  }
};

/**
 * Constructs a business image URL
 * @param publicId - The public ID of the image
 *
 * Use this only for businesses preview
 */
export const constructBizImgUrl = (publicId: string | null) => {
  return publicId
    ? `https://res.cloudinary.com/${CloudinaryConfig.cloudName}/image/upload/c_fill,q_500/${publicId}.jpg`
    : DEFAULT_BIZ_IMAGE.image;
};

const replacedFilterNames = {
  businessCategoryUuid: "cat",
  category: "cat",
  stateAndProvince: "st",
  state: "st",
  city: "cty",
  country: "cn",
  limit: "limit",
  page: "page",
  sortBy: "sortBy",
  sortDirection: "sortDirection",
  query: "query",
  layout: "layout",
};

// extract query params from the address bar
export const extractQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const filters: ISearch["filters"] = [];
  const queryReplacements = ["cat", "st", "cty", "cn"];

  for (const [key, value] of urlParams) {
    if (queryReplacements.includes(key)) {
      switch (key) {
        case "cat":
          filters.push({
            targetFieldName: "businessCategoryUuid",
            values: [decodeURIComponent(value)],
          });
          break;
        case "st":
          filters.push({
            targetFieldName: "stateAndProvince",
            values: [capitalizeFirstLetter(value)],
          });
          break;
        case "cty":
          filters.push({
            targetFieldName: "city",
            values: [capitalizeFirstLetter(value)],
          });
          break;
        case "cn":
          filters.push({
            targetFieldName: "country",
            values: [capitalizeFirstLetter(value)],
          });
          break;
      }
      continue;
    }

    if (typeof key !== "undefined") {
      filters.push({
        targetFieldName: key as keyof ISearch,
        values: value.split(","),
      });
    }
  }

  return { filters };
};

type QueryKey = keyof typeof replacedFilterNames;

export const constructSearchUrl = (
  searchQuery: ISearch,
  pagination?: {
    page: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: string;
  }
) => {
  const query: string[] = [];
  searchQuery.filters.forEach((filter) => {
    const values = filter.values.join(",");
    if (values.length > 0) {
      query.push(
        `${replacedFilterNames[filter.targetFieldName as QueryKey]}=${encodeURI(
          values
        )}`
      );
    }
  });

  // pagination
  if (pagination) {
    for (const [key, value] of Object.entries(pagination)) {
      query.push(`${key}=${value}`);
    }
  }

  return query.join("&");
};

export const constructNSearchUrlFromFilters = (filters: INFilters) => {
  const query: string[] = [];
  for (const [key, value] of Object.entries(filters)) {
    if (key === "pagination") {
      for (const [k, v] of Object.entries(value)) {
        query.push(`${k}=${v}`);
      }
      continue;
    }
    if (value && key !== "pagination") {
      query.push(`${replacedFilterNames[key as QueryKey]}=${encodeURI(value)}`);
    }
  }

  return query.join("&");
};

export const constructSearchUrlFromObject = (
  filters: Record<string, string | null>
) => {
  const query: string[] = [];
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      query.push(`${key}=${value}`);
    }
  }
  return query.join("&");
};

export const forceReloadClientPage = (time?: number) => {
  // force reload the page to update the search query
  // fetch business data
  // apply dynamic seo.
  setTimeout(() => {
    window.location.reload();
  }, time ?? 10);
};

export const lowerCase = (str: string | null) => {
  if (!str) return str;
  return str.toLowerCase();
};

export const upperCase = (str: string | null) => {
  if (!str) return str;
  return str.toUpperCase();
};

export const overrideQueryParameters = (
  newParams: Record<string, string | null>
) => {
  const nParams = constructSearchUrlFromObject(newParams);
  const urlObj = new URL(
    `${window.location.origin}${window.location.pathname}?${nParams}`
  );
  const params = new URLSearchParams();
  Object.keys(newParams).forEach((key) => {
    if (newParams[key] !== null) {
      params.set(key, newParams[key]);
    } else {
      params.delete(key);
    }
  });
  urlObj.search = params.toString();
  window.history.replaceState({}, "", urlObj.toString());
};

export const getAxiosErrorMessage = (
  error: AxiosError & {
    response?: { data?: { message?: string | { desc: string } } };
  },
  message?: string
): string => {
  if (typeof error?.response?.data?.message === "string") {
    return error.response.data.message;
  }
  if (typeof error?.response?.data?.message?.desc === "string") {
    return error.response.data.message.desc;
  }
  return error?.message || message || "An unknown error occurred";
};

export const capitalizeWords = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
