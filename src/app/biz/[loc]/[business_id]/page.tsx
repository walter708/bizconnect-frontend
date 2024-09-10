import { FlexColCenter, FlexColStart, FlexRowStart } from "@/components/Flex";
import BusinessesNotfound from "@/components/NotFound";
import SimilarBusinesses from "@/components/SimilarBusinesses";
import { bizConnectAPI } from "@/config";
import { extractQueryParam } from "@/helpers/dynamic-seo";
import BusinessDetailsPreview from "@/modules/business/components/BusinessDetailsPreview";
import BackBtn from "@/modules/businessDetails/components/BackBtn";
import type { IOption } from "@/types/business";
import type { IBusinessProfile, ISearch } from "@/types/business-profile";
import { constructBizImgUrl, constructSearchUrl } from "@/utils";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import React from "react";

interface BizPageProps {
  params: { loc: string; business_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function BusinessPage({ params }: BizPageProps) {
  const business_id = params["business_id"];
  const {
    data: { categories, businessDetails },
    error,
  } = await getBusinessById(business_id);

  const similarBusinesses = await getSimilarBusinesses({
    businessCategory: businessDetails?.businessCategoryUuid!,
    allCategories: categories,
    country: businessDetails?.country!,
    city: businessDetails?.city!,
    stateAndProvince: businessDetails?.stateAndProvince!,
    currentBusinessId: business_id,
  });

  return (
    <div className="w-full bg-blue-204 px-[20px] ">
      <FlexColStart className="w-full h-auto max-w-7xl mx-auto">
        <BackBtn />
        {businessDetails ? (
          <>
            <div className="max-w-full mx-auto w-full bg-white-100 mb-20 px-[20px] rounded-[20px]">
              <div className="grid md:grid-cols-2 gap-5 h-auto mb-10 pt-[15px] ">
                <FlexColStart className="w-full gap-10 lg:px-3">
                  <div className="w-full">
                    <FlexRowStart className="w-full relative overflow-hidden mt-[10px] h-[217px] lg:h-[633px] rounded-[10px] border-[.5px] border-white-400/15">
                      <Image
                        src={constructBizImgUrl(
                          businessDetails?.croppedImageUrl!
                        )}
                        alt={businessDetails?.name!}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        loading="lazy"
                        className="w-full"
                      />
                    </FlexRowStart>
                  </div>
                </FlexColStart>

                <FlexColCenter className="w-full pt-5">
                  <BusinessDetailsPreview
                    businessDetails={businessDetails}
                    hideActionButtons={true}
                    openHourDrd={false}
                    isBusinessDetailsPage={true}
                  />
                </FlexColCenter>
              </div>
            </div>

            {/* Similar businesses */}
            <FlexColStart className="w-full mt-5 h-auto pb-[200px]">
              {similarBusinesses.data?.businesses.length > 0 && (
                <h3 className="text-[15px] leading-[18px] font-bold font-archivo text-blue-200">
                  Similar Businesses
                </h3>
              )}

              <SimilarBusinesses
                businesses={similarBusinesses.data?.businesses!}
                layout={similarBusinesses.data?.layout as "col" | "row"}
                windowLocation={similarBusinesses.data?.windowLocation!}
              />
            </FlexColStart>
          </>
        ) : (
          <BusinessesNotfound message="This business does not exist" />
        )}
      </FlexColStart>
    </div>
  );
}

type Props = {
  params: { loc: string; business_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const header_url = headersList.get("x-url") || "";
  const businessId = params["business_id"];
  const { data } = await getBusinessById(businessId);

  const categories = data?.businessDetails?.categories?.join(" - ");
  const metaOgDescription = `${data?.businessDetails?.name} ${data?.businessDetails?.description}, ${data?.businessDetails?.city}, ${data?.businessDetails?.stateAndProvince}, ${categories}`;
  const title = `${data.businessDetails?.name} - ${data.businessDetails?.city}, ${data.businessDetails?.stateAndProvince}, ${categories}`;

  return {
    title,
    description: metaOgDescription,
    url: header_url.replace("http://", "https://"),
    openGraph: {
      title,
      description: metaOgDescription,
      url: header_url.replace("http://", "https://"),
      images: [
        {
          url: constructBizImgUrl(data?.businessDetails?.logoUrl!),
        },
      ],
    },
  } as Metadata;
}
async function getBusinessById(bizId: string) {
  let error = null;
  let data: {
    businessDetails: (IBusinessProfile & { categories: string[] }) | null;
    categories: IOption[] | null;
  } = {
    businessDetails: null,
    categories: null,
  };
  const [categories, businessDetails] = await Promise.all([
    getCategories(),
    getBusinessDetails(bizId),
  ]);

  if (categories.error) {
    error = categories.error;
  } else if (businessDetails.error) {
    error = businessDetails.error;
  } else if (categories.data && businessDetails.data) {
    data["categories"] = categories.data;
    data["businessDetails"] = businessDetails.data;
    data["businessDetails"]["categories"] =
      categories.data?.length > 0
        ? categories.data
            .filter(
              (c) => c.uuid === businessDetails.data?.businessCategoryUuid
            )
            .map((c) => c.value)
        : [];
  }

  return {
    data,
    error,
  };
}

async function getBusinessDetails(id: string) {
  let error: string | null = null;
  let data: (IBusinessProfile & { categories: string[] }) | null = null;

  try {
    const url = `${
      bizConnectAPI.baseURL
    }/api/business-profile/list/${id}?tid=${Date.now()}`; // tid is used to prevent caching
    const req = await fetch(url);
    const resp = await req.json();
    data = resp.data["details"];
  } catch (e: any) {
    error = e?.message ?? "An error occurred";
    console.log(e);
  }

  return {
    data,
    error,
  };
}

async function getCategories() {
  let error: string | null = null;
  let data: IOption[] = [];

  try {
    const url = `${bizConnectAPI.baseURL}/api/business-profile/categories`;
    const req = await fetch(url);
    const resp = await req.json();
    data = resp.data["businessCategories"].map((c: any) => ({
      uuid: c.uuid,
      value: c.description,
    }));
  } catch (e: any) {
    error = e?.message ?? "An error occurred";
    console.log(e);
  }

  return {
    data,
    error,
  };
}

// SIMILAR BUSINESSES SECTION
type SimilarBusinessesProps = {
  businessCategory: string;
  allCategories: IOption[] | undefined | null;
  country: string;
  city: string;
  stateAndProvince: string;
  currentBusinessId: string;
};

type CombBusinessesData = IBusinessProfile & { category: string[] };

async function getSimilarBusinesses(props: SimilarBusinessesProps) {
  const {
    businessCategory,
    allCategories,
    country,
    stateAndProvince,
    currentBusinessId,
  } = props;

  const header_url = headers().get("x-url") || "";
  const searchParams = extractQueryParam(header_url);

  const queryParams = constructSimilarBusinessesQueryParam({
    allBusinessCategories: allCategories,
    businessCategory,
    country,
    stateAndProvince,
  });

  const url = `${bizConnectAPI.baseURL}/api/businesses/search?${queryParams}`;

  try {
    const req = await fetch(url);
    const resp = await req.json();
    const bizProfiles =
      (resp.data?.businessProfiles.data as IBusinessProfile[]) || [];

    bizProfiles.forEach((biz: any) => {
      const category = allCategories?.find(
        (c) => c.uuid === biz.businessCategoryUuid
      )?.value;
      if (category) biz["category"] = [category];
    });

    const nonDuplicateBiz = bizProfiles.filter(
      (biz) => biz.uuid !== currentBusinessId
    );

    return {
      data: {
        businesses: nonDuplicateBiz as CombBusinessesData[],
        layout: searchParams.filters.layout ?? "col",
        windowLocation: header_url,
      },
      error: null,
    };
  } catch (e: any) {
    return {
      data: {
        businesses: [],
        layout: "col",
        windowLocation: header_url,
      },
      error: e?.message ?? "An error occurred",
    };
  }
}

type CombBusinessesDataTypes = {
  allBusinessCategories: IOption[] | undefined | null;
  businessCategory: string;
  country?: string;
  stateAndProvince?: string;
};

const constructSimilarBusinessesQueryParam = (
  props: CombBusinessesDataTypes
): string => {
  const { allBusinessCategories, businessCategory, country, stateAndProvince } =
    props;

  const categoryUuid = allBusinessCategories?.find(
    (c) => c.uuid === businessCategory
  )?.value;

  const searchQuery: ISearch = { filters: [] };

  if (country) {
    searchQuery.filters.push({ targetFieldName: "country", values: [country] });
  }

  if (stateAndProvince) {
    searchQuery.filters.push({
      targetFieldName: "state",
      values: [stateAndProvince],
    });
  }

  if (categoryUuid) {
    searchQuery.filters.push({
      targetFieldName: "businessCategoryUuid",
      values: [categoryUuid],
    });
  }

  return constructSearchUrl(searchQuery);
};
