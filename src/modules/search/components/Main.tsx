"use client";
import {
  FlexColCenter,
  FlexColStart,
  FlexRowCenter,
  FlexRowStart,
  FlexRowStartCenter,
} from "@components/Flex";
import { Filter, Plus, SearchIcon2 } from "@components/icons";
import BusinessCardContainer from "@/modules/search/components/BusinessCard";
import { UserBusinessList } from "@/types/business";
import { useBusinessCtx } from "@context/BusinessCtx";
import { type INFilters } from "@/types/business-profile";
import { LoaderComponent } from "@components/Loader";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Input from "@/components/ui/input";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  constructNSearchUrlFromFilters,
  extractQueryParams,
  overrideQueryParameters,
} from "@/utils";
import { DEFAULT_COUNTRY } from "@/config";
import { useDataCtx } from "@/context/DataCtx";
import { usePathname, useSearchParams } from "next/navigation";
import NBusinessFilter from "@/components/NewFilterComponent/NBusinessFilter";
import { useLocation } from "@/hooks/useLocation";
import countryHelpers from "@/helpers/countries-states-city/country";
import { useMutation } from "@tanstack/react-query";
import { searchForBusinesses } from "@/api/business";
import { toast } from "react-toastify";
import { Pagination } from "@/components/Pagination";
import useAfterMount from "@/hooks/useAfterMount";
import Divider from "@/components/Divider";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/button";
import BusinessesNotfound from "@/components/NotFound";
import SelectedPlaceholder from "@/components/SelectedPlaceholder";

dayjs.extend(relativeTime);

interface BusinessesData {
  data: UserBusinessList[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

const MainSearchPageComponent = () => {
  const { userDetails } = useAuth();
  const { businessCategory } = useBusinessCtx();
  const [layout, setLayout] = useState<"row" | "col">("col");
  const { setNavbarBgColor } = useDataCtx();
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [copyOfBusinesses, setCopyOfBusinesses] = useState<BusinessesData>({
    data: [],
    limit: 0,
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const [businesses, setBusinesses] = useState<BusinessesData>({
    data: [],
    limit: 0,
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { loading: locationLoading, location } = useLocation();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [query, setQuery] = useState<string | null>(null);
  const [nFilters, setNFilters] = useState<INFilters>({
    category: null,
    country: null,
    stateAndProvince: null,
    city: null,
  });
  const [headline, setHeadline] = useState({
    title: "",
    businesses: "",
  });
  const getBusinessesMut = useMutation({
    mutationFn: async (param: string) => await searchForBusinesses(param),
    onSuccess: (res) => {
      const resp = res?.data?.businessProfiles as BusinessesData;
      if (resp.page === 0) resp.page = 1;
      setBusinesses(resp);
      setCopyOfBusinesses(resp);
      setPageLoading(false);
    },
    onError: (error) => {
      const err = (error as any).response.data;
      setPageLoading(false);
      toast.error(err.message);
    },
  });

  const initialMountRef = useRef(false);

  // extract query params
  const extractFilterFromQueryParam = useCallback(() => {
    const { filters } = extractQueryParams();
    const paginationKeys = ["page", "limit"];
    const updates = filters.reduce(
      (acc: Partial<INFilters>, f) => {
        const key = paginationKeys.includes(f.targetFieldName)
          ? "pagination"
          : {
              businessCategoryUuid: "category",
              cn: "country",
              st: "stateAndProvince",
              cty: "city",
            }[f.targetFieldName] || (f.targetFieldName as keyof INFilters);
        const value = paginationKeys.includes(f.targetFieldName)
          ? parseInt(f.values[0])
          : decodeURIComponent(f.values[0]);

        if (key === "pagination") {
          acc.pagination = { ...acc.pagination, [f.targetFieldName]: value };
        } else {
          (acc as any)[key] = value;
        }
        return acc;
      },
      { pagination: { ...nFilters.pagination } }
    );

    // Maintain location hierarchy
    const hierarchicalUpdates = {
      ...updates,
      country: updates.country || null,
      stateAndProvince:
        updates.country && updates.stateAndProvince
          ? updates.stateAndProvince
          : null,
      city:
        updates.country && updates.stateAndProvince && updates.city
          ? updates.city
          : null,
    };

    // check if layout is set in query params
    const layout = searchParams.get("layout");
    if (layout) setLayout(layout as "row" | "col");

    setNFilters((p) => ({
      ...p,
      ...hierarchicalUpdates,
    }));
  }, []);

  // apply filters on mount
  const applyFiltersOnMount = useCallback(() => {
    if (locationLoading || !location || initialMountRef.current) return;

    initialMountRef.current = true;

    const { countryCode, country, state, city } = location;
    const isCountrySupported = countryHelpers.isCountrySupportedByIsoCode(
      countryCode!
    );
    const defaultLocation = isCountrySupported
      ? { country, state, city }
      : { country: DEFAULT_COUNTRY, state: "", city: "" };

    const currentParams = new URLSearchParams(window.location.search);
    const overrideParams: Record<string, string> = {};

    const useDefaultLocation =
      !currentParams.has("cn") &&
      !currentParams.has("st") &&
      !currentParams.has("cty");

    if (useDefaultLocation) {
      overrideParams.cn = defaultLocation.country!;
      if (defaultLocation.state) overrideParams.st = defaultLocation.state;
      if (defaultLocation.city) overrideParams.cty = defaultLocation.city;
    } else {
      // Maintain location hierarchy
      const cn = currentParams.get("cn");
      const st = currentParams.get("st");
      const cty = currentParams.get("cty");

      if (cn) overrideParams.cn = cn;
      if (cn && st) overrideParams.st = st;
      if (cn && st && cty) overrideParams.cty = cty;
    }

    // Add other parameters
    Object.entries({
      query: currentParams.get("query") || nFilters.query,
      cat: currentParams.get("cat") || nFilters.category,
      layout: currentParams.get("layout") || layout,
    }).forEach(([key, value]) => {
      if (value) overrideParams[key] = value;
    });

    // Add pagination only if not already in the URL
    if (nFilters.pagination) {
      ["page", "limit"].forEach((param) => {
        if (
          nFilters.pagination &&
          nFilters.pagination[param as keyof typeof nFilters.pagination]
        ) {
          overrideParams[param] =
            nFilters.pagination[
              param as keyof typeof nFilters.pagination
            ]!.toString();
        }
      });
    }

    setNFilters((prev) => ({
      ...prev,
      country: overrideParams.cn,
      stateAndProvince: overrideParams.st,
      ...(overrideParams.cty && { city: overrideParams.cty }),
    }));

    overrideQueryParameters(overrideParams);

    if (businesses?.data.length === 0) {
      const nSearchParam = constructNSearchUrlFromFilters({
        ...nFilters,
        country: overrideParams.cn,
        stateAndProvince: overrideParams.st || nFilters.stateAndProvince,
        city: overrideParams.cty || nFilters.city,
      });
      getBusinessesMut.mutate(nSearchParam);
    }
  }, [locationLoading, location, nFilters, businesses?.data.length]);

  useAfterMount(() => {
    applyFiltersOnMount();
  }, [applyFiltersOnMount]);

  useAfterMount(() => {
    extractFilterFromQueryParam();
  }, []);

  const generateHeadlineFromQuery = () => {
    return {
      country: nFilters.country || null,
      state: nFilters.stateAndProvince || null,
      city: nFilters.city || null,
      query: nFilters.query || null,
    };
  };

  useEffect(() => {
    if (pageLoading || getBusinessesMut.isPending) return;
    const { country, state, city, query } = generateHeadlineFromQuery();

    const locHeadline = (country: string, state: string, city: string) => {
      const locations = [country, state, city].filter(Boolean).join(", ");
      return locations ? `Near '${locations}'` : "";
    };

    const titlePrefix = `Explore ${
      query ? `"${query}" Businesses` : "Businesses"
    }`;
    const titleSuffix = `${
      city && state
        ? ` Near ${city}, ${state}`
        : city
        ? ` Near ${city}`
        : state
        ? ` Near ${state}`
        : country
        ? ` in ${country}`
        : " Near You"
    }`;

    const top10BusinessesName = businesses.data
      ?.map((b) => b.name)
      .slice(0, 10)
      .join(" - ");

    const title = `${titlePrefix}${titleSuffix}`;

    setHeadline({
      title:
        businesses.data.length === 0
          ? `No result for${
              query ? ` '${query}'` : " businesses"
            } ${locHeadline(country!, state!, city!)}`
          : title,
      businesses: top10BusinessesName,
    });
  }, [businesses, pageLoading, getBusinessesMut.isPending]);

  useEffect(() => {
    const searchParam = new URLSearchParams(window.location.search);
    const _query = searchParam.get("query");

    if (_query && !query) setQuery(_query);

    setNavbarBgColor({
      child: "#fff",
    });
  }, [query, setNavbarBgColor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    setQuery(value.length > 0 ? value : null);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = event.currentTarget.value.trim();
      const currentParams = new URLSearchParams(window.location.search);
      const layout = currentParams.get("layout");

      setQuery(value.length > 0 ? value : null);

      // update NFILTERS with query
      setNFilters((prev) => ({
        ...prev,
        query: value,
      }));

      let searchParams: Record<string, string> = {
        ...(nFilters.country && { cn: nFilters.country }),
        ...(nFilters.stateAndProvince && { st: nFilters.stateAndProvince }),
        ...(nFilters.city && { ct: nFilters.city }),
        ...(nFilters.category && { cat: nFilters.category }),
        ...(nFilters.pagination?.limit && {
          limit: nFilters.pagination.limit.toString(),
        }),
      };

      if (value && value.length > 0) searchParams.query = value;
      if (layout) searchParams.layout = layout;

      const urlSearchParams = new URLSearchParams(searchParams);
      const nSearchParam = urlSearchParams.toString();

      window.history.replaceState({}, "", `${pathname}?${nSearchParam}`);

      // Perform search
      getBusinessesMut.mutate(nSearchParam);
    }
  };

  const applyFilter = () => {
    const currentParams = new URLSearchParams(window.location.search);
    const layout = currentParams.get("layout");
    // check if country exists
    if (!nFilters.country) {
      toast.error("Please select a country");
      return;
    }

    // override the query params
    const overrideParams: Record<string, string> = {
      ...(nFilters.country && { cn: nFilters.country }),
      ...(nFilters.stateAndProvince && { st: nFilters.stateAndProvince }),
      ...(nFilters.city && { cty: nFilters.city }),
      ...(nFilters.category && { cat: nFilters.category }),
      ...(nFilters.query && { query: nFilters.query }),
    };

    if (layout) overrideParams.layout = layout;

    overrideQueryParameters(overrideParams);

    const params = new URLSearchParams(window.location.search);
    getBusinessesMut.mutate(params.toString());
    setShowFilter(false);
  };

  const resetFilters = (refetch?: boolean) => {
    // reset nFilters to initial state
    setNFilters({
      ...nFilters,
      country: getDefaultCountryBasedOnUserLocation(),
      layout: nFilters.layout ?? "col",
      stateAndProvince: null,
      city: null,
      category: null,
      query: null,
    });
    setQuery(null);
    overrideQueryParameters({
      cn: getDefaultCountryBasedOnUserLocation(),
      layout: nFilters.layout ?? "col",
      st: null,
      ct: null,
      cat: null,
      query: null,
      page: null,
      limit: null,
    });

    if (refetch) {
      const params = new URLSearchParams(window.location.search);
      getBusinessesMut.mutate(params.toString());
    }
  };

  const getDefaultCountryBasedOnUserLocation = () => {
    const isCountrySupported = countryHelpers.isCountrySupportedByIsoCode(
      location?.countryCode!
    );
    if (!isCountrySupported) return DEFAULT_COUNTRY;
    return location?.country!;
  };

  const handleLayoutChange = useCallback(() => {
    setLayout((prevLayout) => {
      const newLayout = prevLayout === "col" ? "row" : "col";
      const search = new URLSearchParams(window.location.search);
      search.set("layout", newLayout);
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${search.toString()}`
      );
      return newLayout;
    });
  }, []);

  const generatePaginationSearchParams = useCallback(() => {
    const searchParam = constructNSearchUrlFromFilters(nFilters);
    const search = new URLSearchParams(searchParam);
    search.set("layout", layout ?? "row");
    return search;
  }, [nFilters, layout]);

  // Effect to sync URL with state
  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    const urlQuery = currentParams.get("query");
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams, query]);

  const handleFilterRemoval = (id: string) => {
    let isCountrySelected = false;
    const filteredOutCriteria = Object.entries(nFilters).filter(
      ([key, value]) => value !== null && key !== id
    );
    const overrideParams: Record<string, string | null> = {};

    filteredOutCriteria.forEach(([key, value]) => {
      if (key !== "pagination") {
        overrideParams[key] = value as string;
      }
    });

    if (id === "country") {
      isCountrySelected = true;
      overrideParams.country = null;
      delete overrideParams.stateAndProvince;
      delete overrideParams.city;
    } else {
      overrideParams[id] = null;
    }

    overrideQueryParameters({
      ...(overrideParams.country && { cn: overrideParams.country }),
      ...(overrideParams.stateAndProvince && {
        st: overrideParams.stateAndProvince,
      }),
      ...(overrideParams.city && { cty: overrideParams.city }),
      ...(overrideParams.category && { cat: overrideParams.category }),
      ...(overrideParams.query && { query: overrideParams.query }),
    });

    setNFilters((prev) => ({
      ...prev,
      ...overrideParams,
    }));

    if (isCountrySelected) window.location.reload();

    const params = new URLSearchParams(window.location.search);
    getBusinessesMut.mutate(params.toString());
  };

  return (
    <div className="w-full bg-blue-204">
      <FlexColStart className="w-full h-full bg-blue-204 pb-[2em] mx-auto max-w-7xl">
        <header className="flex flex-col px-[20px] md:px-[30px] gap-4 sm:flex-row sm:items-center justify-between w-full py-5 mt-10">
          <div>
            <h1 className="text-[25px] md:text-[30px] font-bold font-pp text-blue-200">
              {headline.title}
            </h1>
            <p className="text-[15px] font-medium font-pp leading-[23px] text-gray-103">
              Discover businesses within and beyond your community
            </p>
          </div>
          {/* {!userDetails && (
            <div className="w-full sm:w-[unset]">
              <Button
                className="w-full sm:w-max px-4 h-[44px] !text-white-100 text-[15px] font-pp font-medium leading-[16.32px] tracking-normal !text-white bg-blue-200"
                href="/register-business"
                leftIcon={<Plus size={20} className="stroke-white-100" />}
              >
                Sign up to explore more similar businesses
              </Button>
            </div>
          )} */}
        </header>

        {/* search component */}
        <FlexRowStartCenter className="sm:hidden w-full px-[20px] md:px-[30px] gap-[5px] bg-transparent">
          <Input
            inputClassname="font-pp px-0 font-normal border-none tracking-[0] placeholder:text-gray-103"
            parentClassname="px-4 bg-white-100 cursor-pointer rounded-[10px] border-none -mb-4"
            type="text"
            placeholder="Search business"
            leftIcon={
              <SearchIcon2
                size={20}
                strokeWidth={1.2}
                className="stroke-gray-103"
              />
            }
            defaultValue={query ? query : ""}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            autoComplete="off"
          />
          <div className="flex items-center gap-2 pt-5">
            <button
              className="border-none outline-none cursor-pointer rounded-[5px] p-2 flex items-center justify-center bg-blue-50 -translate-y-2"
              onClick={() => setShowFilter(true)}
            >
              <Filter size={15} className="stroke-blue-200" />
            </button>
            <button
              onClick={handleLayoutChange}
              className="border-none outline-none cursor-pointer rounded-[10px] p-2 flex items-center justify-center -translate-y-2"
            >
              <FlexColCenter>
                {layout === "col" ? (
                  <img
                    src={"/assets/icons/layout-panel-top.svg"}
                    className="m-2"
                  />
                ) : (
                  <img
                    src={"/assets/icons/layout-panel-left.svg"}
                    className="m-2"
                  />
                )}
              </FlexColCenter>
            </button>
          </div>
        </FlexRowStartCenter>

        <FlexRowCenter className="hidden px-[20px] md:px-[30px] sm:flex items-center gap-5">
          <Input
            inputClassname="font-pp px-0 font-normal border-none tracking-[0] placeholder:text-gray-103"
            parentClassname="w-full h-[52px] px-4 bg-white-100 cursor-pointer rounded-[10px] border-none sm:w-[534px]"
            type="text"
            placeholder="Search business"
            leftIcon={
              <SearchIcon2
                size={20}
                strokeWidth={1.2}
                className="stroke-gray-103"
              />
            }
            defaultValue={query ? query : ""}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            autoComplete="off"
          />
          <button
            className="hidden h-[45px] sm:flex items-center gap-2 mb-0 text-blue-200 bg-blue-209 px-4 rounded-[10px] -translate-y-2"
            onClick={() => setShowFilter(true)}
          >
            <Filter size={18} className="stroke-blue-200" />
            <span className="text-[15px] -py-1 font-medium whitespace-nowrap">
              Filter By
            </span>
          </button>
        </FlexRowCenter>

        <AppliedFilters
          nFilters={nFilters}
          onSelectFilter={handleFilterRemoval}
          resetFilters={() => resetFilters(true)}
        />

        <Divider className="border-solid border-gray-400/30 border-[.5px] mt-0 mb-10" />

        <FlexColCenter className="w-full">
          {(pageLoading || getBusinessesMut.isPending) && (
            <div className="mt-5">
              <LoaderComponent />
            </div>
          )}

          {!pageLoading &&
            !getBusinessesMut.isPending &&
            businesses?.data?.length === 0 && <BusinessesNotfound />}
        </FlexColCenter>

        <NBusinessFilter
          opened={showFilter}
          nFilters={nFilters}
          setNFilters={setNFilters}
          onClose={() => setShowFilter(false)}
          resetFilters={resetFilters}
          onApplyFilters={applyFilter}
        />

        {getBusinessesMut.isPending || pageLoading ? null : (
          <BusinessCardContainer
            data={businesses.data}
            businessCategories={businessCategory}
            layout={layout}
          />
        )}

        {businesses?.data?.length > 0 &&
          !pageLoading &&
          !getBusinessesMut.isPending && (
            <Pagination
              totalPages={businesses.totalPages}
              urlSearchParam={generatePaginationSearchParams()}
              activePage={String(businesses.page)}
              location={window.location}
              SSR={true} // this uses <a> tags to navigate rather than <Link>
            />
          )}
      </FlexColStart>
    </div>
  );
};

export default React.memo(MainSearchPageComponent);

type AppliedFiltersProps = {
  nFilters: INFilters;
  onSelectFilter: (filter: string) => void;
  resetFilters: () => void;
};
function AppliedFilters({
  nFilters,
  onSelectFilter,
  resetFilters,
}: AppliedFiltersProps) {
  const { country, city, stateAndProvince, category, query } = nFilters;

  if (!country) return null;

  return (
    <FlexRowStart className="w-full h-auto px-[20px] md:px-[30px]">
      <span className="text-gray-103 font-normal text-xs md:text-[15px]">
        Filter result:
      </span>

      <FlexRowStart className="w-auto gap-0 md:gap-2 py-2 md:py-0 md:ml-2 -translate-y-4 md:-translate-y-1 flex-wrap">
        <SelectedPlaceholder
          getSelectedHolder={onSelectFilter}
          selectedValues={[
            ...(country ? [{ uuid: "country", value: country }] : []),
            ...(stateAndProvince
              ? [{ uuid: "stateAndProvince", value: stateAndProvince }]
              : []),
            ...(city ? [{ uuid: "city", value: city }] : []),
            ...(category ? [{ uuid: "category", value: category }] : []),
            ...(query ? [{ uuid: "query", value: query }] : []),
          ].filter(Boolean)}
          labelClassName="font-normal md:text-[12px] text-xs"
        />

        <button
          className="w-auto px-[20px] md:px-[30px] py-[7px] bg-transparent border-[.5px] border-white-400/10 rounded-full scale-[.95] -translate-x-2 md:scale-100 md:-translate-x-0 gap-0 md:gap-2 md:text-[12px] text-xs enableBounceEffect"
          onClick={resetFilters}
        >
          Reset
        </button>
      </FlexRowStart>
    </FlexRowStart>
  );
}
