"use client";
import ErrorComponent from "@/components/ErrorComponent";
import {
  FlexColCenter,
  FlexColStart,
  FlexColStartCenter,
} from "@/components/Flex";
import {
  NItemNotFound,
  NSelect,
  NSelectItems,
} from "@/components/NewFilterComponent/NSelect";
import Input from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  BusinessCategories,
  BusinessProfileFormikPropsValues,
  IOption,
} from "@/types/business";
import { FormikErrors, FormikTouched } from "formik";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import City from "@/helpers/countries-states-city/city";
import Country from "@/helpers/countries-states-city/country";
import State from "@/helpers/countries-states-city/state";
import { FILTERED_COUNTRY } from "@/utils/business-profile-utils";
import { lowerCase } from "@/utils";
import countryHelpers from "@/helpers/countries-states-city/country";
import stateHelpers from "@/helpers/countries-states-city/state";
import cityHelpers from "@/helpers/countries-states-city/city";
import { SearchIcon2 } from "@/components/icons";
import { allBusinessCategories } from "@/api/business";
import {
  ImageCropper,
  ImageCropperPlaceholder,
  ImageUploader,
} from "@/components/image-cropping";
import Button from "@/components/ui/button";

interface NBusinessProfileProps {
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
  handleNextButton: (values: BusinessProfileFormikPropsValues) => void;
  businessId?: string;
}

type BusinessFieldsName = keyof BusinessProfileFormikPropsValues;
type BusinessFields = BusinessFieldsName[];

const businessLocationData = [
  "businessCategory",
  "country",
  "stateAndProvince",
  "city",
] as BusinessFields;

const requiredFieldError = {
  country: "Country is required",
  stateAndProvince: "State/Province is required",
  city: "City is required",
  description: "Business description is required",
  businessCategory: "Business category is required",
} as Record<BusinessFieldsName, string>;

const BusinessProfile: React.FC<NBusinessProfileProps> = ({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  errors,
  touched,
  setFieldError,
  setFieldTouched,
  handleNextButton,
  businessId,
}) => {
  const [businessCategories, setBusinessCategories] = useState<IOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const resp = await allBusinessCategories();
      const data = resp.data as BusinessCategories;
      setBusinessCategories(
        data.data.businessCategories.map((d) => ({
          uuid: d.uuid,
          value: d.description,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const [croppedImgMetadata, setCroppedImgMetadata] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
    zoom: number;
    name: string;
  } | null>(null);
  const [imageCropperVisible, setImageCropperVisible] = useState(false);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const getFilteredStates = (country: string) => {
    if (!country) return [];
    const countryISO = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === country.toLowerCase()
    )?.isoCode;
    const states = State.getStatesOfCountry(countryISO!);
    const formatedStates = states.map((state) => ({
      uuid: state.name,
      value: state.name,
    }));
    return formatedStates;
  };

  const getFilteredCities = (country: string, state: string) => {
    if (!country || !state) return [];

    const countryISO = Country.getAllCountries().find(
      (c) => lowerCase(c.name) === lowerCase(country)
    )?.isoCode;
    const states = State.getStatesOfCountry(countryISO!);
    const _matchedState = states.find(
      (s) => s.name === values.stateAndProvince
    );
    const stateCode = _matchedState?.isoCode;
    const cities = City.getCitiesOfState(countryISO!, stateCode!);

    const formatedCities = cities.map((city) => ({
      uuid: city.name,
      value: city.name,
    }));
    return formatedCities;
  };

  const formattedCountries = useMemo(() => {
    const selectedCountry = values.country;
    const mappedCountries = FILTERED_COUNTRY.map((country) => ({
      uuid: country,
      value: country,
    }));

    // if country is selected, move it to the top of the list
    if (selectedCountry) {
      const selectedIndex = mappedCountries.findIndex(
        (c) => c.value === selectedCountry
      );
      if (selectedIndex !== -1) {
        const selected = mappedCountries.splice(selectedIndex, 1)[0];
        mappedCountries.unshift(selected);
      }
    }

    return mappedCountries;
  }, [values.country]);

  /**
   * Memoized function to generate a list of business items.
   * It maps the items to a new array with uuid and value properties.
   * If an item is selected, it moves that item to the top of the list.
   * The function re-runs when businessItems or values.businessItem changes.
   */
  const listCategories = useMemo(() => {
    const mappedCategories = businessCategories.map((c) => ({
      uuid: c.uuid,
      value: c.value,
    }));
    const selectedCategory = values.businessCategory;

    if (selectedCategory) {
      const selectedIndex = mappedCategories.findIndex(
        (c) => c.uuid === selectedCategory
      );
      if (selectedIndex !== -1) {
        const selected = mappedCategories.splice(selectedIndex, 1)[0];
        mappedCategories.unshift(selected);
      }
    }

    return mappedCategories;
  }, [businessCategories, values.businessCategory]);

  const listStates = useMemo(() => {
    const filteredStates = getFilteredStates(values.country!);
    const selectedState = values.stateAndProvince;

    if (selectedState) {
      const selectedIndex = filteredStates.findIndex(
        (s) => s.value === selectedState
      );
      if (selectedIndex !== -1) {
        const selected = filteredStates.splice(selectedIndex, 1)[0];
        filteredStates.unshift(selected);
      }
    }

    return filteredStates;
  }, [values.country, values.stateAndProvince, getFilteredStates]);

  const listCities = useMemo(() => {
    const filteredCities = getFilteredCities(
      values.country!,
      values.stateAndProvince!
    );
    const selectedCity = values.city;

    if (selectedCity) {
      const selectedIndex = filteredCities.findIndex(
        (c) => c.value === selectedCity
      );
      if (selectedIndex !== -1) {
        const selected = filteredCities.splice(selectedIndex, 1)[0];
        filteredCities.unshift(selected);
      }
    }

    return filteredCities;
  }, [values.country, values.stateAndProvince, values.city, getFilteredCities]);

  const getSelectValue = (name: BusinessFieldsName & "pagination") => {
    if (name === "country" && values.country) {
      const isCountrySupported = countryHelpers.isCountrySupportedByName(
        values.country!
      );
      return isCountrySupported ? values.country : null;
    }
    if (name === "stateAndProvince" && values.stateAndProvince) {
      const isStateSupported = stateHelpers.isStateSupportedByName(
        values.stateAndProvince!
      );
      return isStateSupported ? values.stateAndProvince : null;
    }
    if (name === "city" && values.city) {
      const isCitySupported = cityHelpers.isCitySupportedByName(values.city!);
      return isCitySupported ? values.city : null;
    }
    if (name === "businessCategory") {
      const category = businessCategories.find(
        (c) => c.uuid === values.businessCategory
      );
      return category ? category.value : null;
    }
    return name !== "pagination" ? values[name as BusinessFieldsName] : null;
  };

  const getSelectPlaceholder = (name: BusinessFieldsName) => {
    const placeholders = {
      country: "Select Country",
      stateAndProvince: "Select State and Province",
      city: "Select City",
      businessCategory: "Business Category",
    };
    return placeholders[name as keyof typeof placeholders] || "";
  };

  const getLists = useCallback(
    (name: BusinessFieldsName) => {
      switch (name) {
        case "businessCategory":
          return listCategories;
        case "country":
          return formattedCountries;
        case "stateAndProvince":
          return listStates;
        case "city":
          return listCities;
        default:
          return [];
      }
    },
    [listCategories, formattedCountries, listStates, listCities]
  );

  const handleItemClick = useCallback(
    (name: BusinessFieldsName, value: string, cb?: () => void) => {
      const isDeselecting = value === values[name];
      const newValue = isDeselecting ? "" : value;

      const resetDependentFields = (field: BusinessFieldsName) => {
        // reset city if country or state is deselected
        if (field === "country" || field === "stateAndProvince") {
          setFieldValue("city", "", false);
        }
        // reset state if country is deselected
        if (field === "country") {
          setFieldValue("stateAndProvince", "", false);
        }
      };

      resetDependentFields(name);
      setFieldValue(name, newValue, false);
      setFieldError(name, isDeselecting ? requiredFieldError[name] : undefined);
      setFieldTouched(name, true, false);

      cb?.();
    },
    [setFieldValue, setFieldError, setFieldTouched, values, requiredFieldError]
  );

  return (
    <FlexColStart className="w-full h-full bg-blue-205 px-0 ">
      <FlexColStart className="w-full h-auto text-center bg-white-100 px-3 pb-[23px] gap-0">
        <FlexColCenter className="w-full h-auto gap-0 my-[24px]">
          <h4 className="text-[16px] text-center font-bold font-pp leading-[24px] text-blue-200">
            {businessId ? "Update" : "Setup"} Your Business Profile
          </h4>
          <h6 className="text-[15px] font-pp text-gray-103">
            Tell Us about your business
          </h6>
        </FlexColCenter>

        <ErrorComponent
          value={(touched.businessName && errors.businessName) || ""}
        />
        <Input
          type="text"
          label="Business Name"
          name="businessName"
          value={values.businessName}
          onChange={handleChange}
          parentClassname={cn(
            "w-full px-0",
            touched.businessName && errors.businessName && "border-red-305"
          )}
          inputClassname="w-full px-3 border-white-400/50"
          placeholder="Enter Business Name"
          onBlur={handleBlur}
          required
        />

        <FlexColStart className="w-full mb-4 gap-1">
          <ErrorComponent
            value={(touched.description && errors.description) || ""}
          />
          <label className="text-[14px] font-normal font-pp text-dark-100">
            Describe your business
          </label>
          <textarea
            name="description"
            className={cn(
              "w-full border-[1px] border-solid text-[12px] text-blue-200 py-[10px] px-[10px] rounded-[5px] placeholder:text-dark-104 font-pp font-medium",
              errors.description && touched.description
                ? "border-red-305"
                : "border-dark-103"
            )}
            value={values.description}
            onChange={handleChange}
            rows={4}
            placeholder="Short sentence about your business"
            onBlur={handleBlur}
          />
        </FlexColStart>

        {/* location data */}
        {businessLocationData.map((field) => (
          <React.Fragment key={field}>
            <ErrorComponent
              value={
                ((touched[field as keyof BusinessProfileFormikPropsValues] &&
                  errors[
                    field as keyof BusinessProfileFormikPropsValues
                  ]) as string) || ""
              }
              className="mt-5"
            />

            <NSelect
              required
              label={getSelectPlaceholder(field)}
              placeholder={getSelectPlaceholder(field)}
              value={
                getSelectValue(
                  field as BusinessFieldsName & "pagination"
                ) as BusinessFieldsName
              }
              items={getLists(field)}
              leftIcon={
                field === "businessCategory" ? (
                  <SearchIcon2 size={16} className="stroke-white-400" />
                ) : undefined
              }
              searchKey="value"
              disabled={
                field === "businessCategory"
                  ? isLoading
                  : field === "stateAndProvince"
                  ? !values.country
                  : field === "city"
                  ? !values.stateAndProvince
                  : false
              }
              loading={field === "businessCategory" && isLoading}
              render={({
                searchResult,
                closePanel,
                clearSearch,
                searchValue,
              }) => (
                <ul className="w-full max-h-[200px] overflow-y-auto">
                  {(searchValue.length > 0 ? searchResult : getLists(field))
                    .length > 0 ? (
                    (searchValue.length > 0
                      ? searchResult
                      : getLists(field)
                    ).map((item) => (
                      <NSelectItems
                        key={item.value}
                        onClick={() =>
                          handleItemClick(
                            field,
                            field === "businessCategory"
                              ? item.uuid!
                              : item.value,
                            () => {
                              closePanel?.();
                              clearSearch?.();
                            }
                          )
                        }
                        value={item.value}
                        active={
                          field === "businessCategory"
                            ? item.uuid === values[field]
                            : item.value === values[field]
                        }
                      />
                    ))
                  ) : (
                    <NItemNotFound />
                  )}
                </ul>
              )}
            />
            <br />
          </React.Fragment>
        ))}

        {/* street and zeep code */}
        <ErrorComponent value={(touched.street && errors.street) || ""} />
        <Input
          type="text"
          label="Street"
          name="street"
          value={values.street}
          onChange={handleChange}
          parentClassname={cn("w-full px-0", errors.street && "border-red-305")}
          inputClassname="w-full px-3 border-white-400/50"
          placeholder="Enter Street"
          onBlur={handleBlur}
        />

        <br />

        <ErrorComponent
          value={(touched.postalCode && errors.postalCode) || ""}
        />
        <Input
          type="text"
          label="Zip Code / Postal Code"
          name="postalCode"
          value={values.postalCode}
          onChange={handleChange}
          parentClassname={cn(
            "w-full px-0",
            errors.postalCode && "border-red-305"
          )}
          inputClassname="w-full px-3 border-white-400/50"
          placeholder="Enter Postal Code"
          onBlur={handleBlur}
        />

        <br />
        {imageCropperVisible && values.uncropped && (
          <ImageCropper
            image={values.uncropped!}
            _getImageData={(original, cropped) => {
              setImageCropperVisible(false);
              setFieldValue("cropped", cropped);
              setFieldValue("uncropped", original);
            }}
            closeCropper={() => {
              setImageCropperVisible(false);
            }}
            zoom={croppedImgMetadata?.zoom ?? 1}
            visible={imageCropperVisible}
          />
        )}

        {values.cropped || values.image ? (
          <ImageCropperPlaceholder
            image={values.cropped! ?? values.image}
            label={"Business Logo"}
            openCropper={() => setImageCropperVisible(true)}
            clearImage={() => {
              setFieldValue("cropped", null);
              setFieldValue("uncropped", null);
              if (businessId) {
                setFieldValue("image", null);
              }
            }}
            name={croppedImgMetadata?.name ?? ""}
          />
        ) : (
          <ImageUploader
            getImage={(image) => {
              setFieldValue("uncropped", image);
              setImageCropperVisible(true);
            }}
            getImageName={(name) => {
              if (name) {
                setCroppedImgMetadata((prev) => ({
                  ...prev!,
                  name,
                }));
              }
            }}
          />
        )}

        <Button
          onClick={() => handleNextButton(values)}
          className="w-full rounded-[5px] mt-5"
          type="submit"
          intent="primary"
          size="lg"
        >
          <span className="font-pp text-[14px] font-medium">Next</span>
        </Button>
      </FlexColStart>
    </FlexColStart>
  );
};

export default BusinessProfile;
