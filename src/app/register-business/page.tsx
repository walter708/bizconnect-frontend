"use client";
import {
  getUserBusinessProfileDetail,
  updateUserBusinessProfileDetail,
  createBusinessProfile,
} from "@/api/business";
import { FlexColCenter, FlexRowCenter } from "@/components/Flex";
import FormikWrapper from "@/components/FormikWrapper";
import Button from "@/components/ui/button";
import {
  constructCloudinaryUrl,
  uploadBusinessImageToCloudinary,
} from "@/helpers/business";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import NBusinessProfile from "@/modules/register-business/components/NBusinessProfile";
import NOperationInfo from "@/modules/register-business/components/NOperationInfo";
import type {
  BusinessProfileFormikPropsValues,
  CloudinaryUploadResponse,
  BusinessCreationBody,
  RegisterBusinessTabs,
  UserBusinessDetailsResponse,
  UserBusinessList,
  UpdateBusinessBody,
} from "@/types/business";
import withAuth from "@/utils/auth-helpers/withAuth";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { LoaderComponent } from "@/components/Loader";
import useAfterMount from "@/hooks/useAfterMount";
import { getAxiosErrorMessage } from "@/utils";

const tabs = [
  { name: "business-profile", title: "Business Profile" },
  { name: "operations-info", title: "Operations Info" },
] as { name: RegisterBusinessTabs; title: string }[];

const initialValues: BusinessProfileFormikPropsValues = {
  businessName: "",
  description: "",
  businessCategory: "",
  country: "",
  stateAndProvince: "",
  city: "",
  street: "",
  postalCode: "",
  image: null,
  instagramUrl: "",
  websiteUrl: "",
  linkedinUrl: "",
  facebookUrl: "",
  phoneNumber: "",
  businessEmail: "",
  cropped: "",
  uncropped: "",
  operationDays: [],
};

const validationSchema = Yup.object({
  businessName: Yup.string()
    .min(1, "Enter valid Business Name")
    .required("Business Name is required!"),
  businessCategory: Yup.string().required("Business Category is required!"),
  description: Yup.string().required("Description is required!"),
  country: Yup.string().required("Country is required!"),
  stateAndProvince: Yup.string().required("State and Province is required!"),
  city: Yup.string().required("city is required!"),
  operationDays: Yup.array()
    .of(
      Yup.object().shape({
        day: Yup.string().nullable().required("Day is required"),
        openTime: Yup.string().nullable().required("Open time is required"),
        closeTime: Yup.string().nullable().required("Close time is required"),
      })
    )
    .min(1, "At least one operation day is required"),
});

const requiredBusinessProfileFields = [
  "businessName",
  "description",
  "businessCategory",
  "country",
  "stateAndProvince",
  "city",
];

function RegisterBusinessPage() {
  const { userDetails } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get("update");
  const [businessProfile, setBusinessProfile] =
    useState<UserBusinessList | null>(null);
  const [formValues, setFormValues] =
    useState<BusinessProfileFormikPropsValues>(initialValues);
  const [selectedTab, setSelectedTab] =
    useState<RegisterBusinessTabs>("business-profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImageData, setUploadedImageData] = useState<{
    cropped: CloudinaryUploadResponse | null;
    original: CloudinaryUploadResponse | null;
  }>({ cropped: null, original: null });
  const [formikSubmitValues, setFormikSubmitValues] =
    useState<BusinessProfileFormikPropsValues | null>(null);
  const uploadImageMut = useMutation({
    mutationFn: async (data: {
      folderPath: string;
      cropped: string;
      original: string;
    }) => {
      const { folderPath, cropped, original } = data;
      const [originalImageResponse, croppedImageResponse] = await Promise.all([
        uploadBusinessImageToCloudinary({
          image: original,
          folderPath,
        }),
        uploadBusinessImageToCloudinary({
          image: cropped,
          folderPath,
        }),
      ]);
      return { originalImageResponse, croppedImageResponse };
    },
    onSuccess: (data) => {
      setUploadedImageData({
        cropped: data.croppedImageResponse,
        original: data.originalImageResponse,
      });
    },
    onError: (error) => {
      toast.error("Error uploading image");
      console.log(error);
    },
  });
  const createBusinessProfileMut = useMutation({
    mutationFn: async (data: BusinessCreationBody) =>
      await createBusinessProfile(data as any),
    onSuccess: (data) => {
      toast.success("Business profile created successfully");
      setIsModalOpen(true);
    },
    onError: (error: any) => {
      const errMsg =
        error?.response?.data?.message ?? "Error creating business profile";
      toast.error(errMsg);
      console.log(error);
    },
  });
  const updateBusinessProfileMut = useMutation({
    mutationFn: async (props: { data: UpdateBusinessBody; id: string }) =>
      await updateUserBusinessProfileDetail(props.id, props.data),
    onSuccess: () => {
      toast.success("Business profile updated successfully");
      setIsModalOpen(true);
    },
    onError: (error: any) => {
      const errMsg = getAxiosErrorMessage(error);
      toast.error(errMsg);
      console.log(error);
    },
  });
  const getBusinessProfile = useMutation({
    mutationFn: async (id: string) => await getUserBusinessProfileDetail(id),
    onSuccess: (data) => {
      const resp = (data.data as UserBusinessDetailsResponse).data;
      setBusinessProfile(resp.details as UserBusinessList);

      // update form values
      updateFormValues(resp.details);
    },
    onError: (error: any) => {
      const errMsg =
        error?.response?.data?.message ?? "Error fetching business profile";
      toast.error(errMsg);
      console.log(error);
    },
  });

  const tabsRef = useRef<HTMLDivElement>(null);

  const validateRequiredFields = (values: BusinessProfileFormikPropsValues) => {
    let isError = false;
    const allRequiredFieldsFilled = requiredBusinessProfileFields.every(
      (field) => values[field as keyof BusinessProfileFormikPropsValues]
    );

    if (!allRequiredFieldsFilled) {
      toast.error(
        `Please fill all required fields. Missing: ${requiredBusinessProfileFields.find(
          (field) => !values[field as keyof BusinessProfileFormikPropsValues]
        )}`
      );
      isError = true;
    }

    if (values.operationDays) {
      values.operationDays.forEach((day) => {
        if (!day.openTime || !day.closeTime) {
          toast.error("Opening and Closing time are required.");
          isError = true;
        }
        if (day.openTime === day.closeTime) {
          toast.error("Opening and Closing time cannot be the same.");
          isError = true;
        }
      });
    }

    return isError;
  };

  const updateFormValues = (businessProfile: UserBusinessList) => {
    const validFormFields: (keyof BusinessProfileFormikPropsValues)[] = [
      "businessName",
      "description",
      "businessCategory",
      "country",
      "stateAndProvince",
      "city",
      "street",
      "postalCode",
      "image",
      "instagramUrl",
      "websiteUrl",
      "linkedinUrl",
      "facebookUrl",
      "phoneNumber",
      "businessEmail",
      "operationDays",
    ];

    // @ts-ignore
    const formValues = validFormFields.reduce((acc, field) => {
      if (field === "image" && businessProfile.logoUrl) {
        acc[field] = constructCloudinaryUrl(businessProfile.croppedImageUrl!);
        acc["uncropped"] = constructCloudinaryUrl(businessProfile.logoUrl);
      } else if (field === "businessName" && businessProfile.name) {
        acc[field] = businessProfile.name;
      } else if (field === "operationDays") {
        acc[field] = businessProfile.operationDays;
      } else if (
        field === "businessCategory" &&
        businessProfile.businessCategoryUuid
      ) {
        acc[field] = businessProfile.businessCategoryUuid;
      } else if (
        field in businessProfile &&
        businessProfile[field as keyof UserBusinessList] !== null
      ) {
        const value = businessProfile[field as keyof UserBusinessList];
        if (typeof value === "string" || Array.isArray(value)) {
          acc[field] = value as any;
        }
      }
      return acc;
    }, {} as BusinessProfileFormikPropsValues);

    setFormValues(formValues);
  };

  const handleSubmit = async (values: BusinessProfileFormikPropsValues) => {
    const notValid = validateRequiredFields(values);

    if (notValid) return;

    setFormikSubmitValues(values);

    if (values.uncropped && values.cropped) {
      const folderPath = `BizConnect/Logo/${userDetails?.uuid}`;
      uploadImageMut.mutate({
        folderPath,
        cropped: values.cropped,
        original: values.uncropped,
      });
    } else {
      // If no image to upload, directly call create/update
      if (businessId) {
        handleUpdateBusinessProfile(values);
      } else {
        handleCreateBusinessProfile(values);
      }
    }
  };

  const handleCreateBusinessProfile = async (
    values: BusinessProfileFormikPropsValues
  ) => {
    const payload = {
      name: values.businessName,
      description: values.description,
      country: values.country,
      stateAndProvince: values.stateAndProvince,
      city: values.city,
      street: values.street,
      postalCode: values.postalCode,
      businessCategoryUuid: values.businessCategory,
      businessEmail: values.businessEmail,
      phoneNumber: values.phoneNumber,
      websiteUrl: values.websiteUrl,
      linkedinUrl: values.linkedinUrl,
      instagramUrl: values.instagramUrl,
      facebookUrl: values.facebookUrl,
      operationDays: values.operationDays,
    } as BusinessCreationBody;

    if (uploadedImageData.cropped && uploadedImageData.original) {
      payload["cloudinaryConfig"] = {
        versions: {
          cropped: uploadedImageData.cropped.version,
          original: uploadedImageData.original.version,
        },
        publicIds: {
          cropped: uploadedImageData.cropped.public_id,
          original: uploadedImageData.original.public_id,
        },
        signatures: {
          cropped: uploadedImageData.cropped.signature,
          original: uploadedImageData.original.signature,
        },
      };
    }
    createBusinessProfileMut.mutate(payload);
  };

  const handleUpdateBusinessProfile = async (
    values: BusinessProfileFormikPropsValues
  ) => {
    const payload = {
      name: values.businessName,
      description: values.description,
      country: values.country,
      stateAndProvince: values.stateAndProvince,
      city: values.city,
      street: values.street,
      postalCode: values.postalCode,
      businessCategoryUuid: values.businessCategory,
      businessEmail: values.businessEmail,
      phoneNumber: values.phoneNumber,
      operationDays: values.operationDays,
      websiteUrl: values.websiteUrl,
      linkedinUrl: values.linkedinUrl,
      instagramUrl: values.instagramUrl,
      facebookUrl: values.facebookUrl,
    } as UpdateBusinessBody;

    if (
      !values.cropped &&
      !values.image &&
      !values.uncropped &&
      businessProfile?.croppedImageUrl &&
      businessProfile.logoUrl
    ) {
      payload["deleteImage"] = true;
      // set this value so it available on the backend when updating
      payload.image = {
        croppedUrl: businessProfile?.croppedImageUrl ?? null,
        originalUrl: businessProfile?.logoUrl ?? null,
      };
    }

    if (
      uploadedImageData.cropped &&
      uploadedImageData.original &&
      !payload["deleteImage"]
    ) {
      payload["cloudinaryConfig"] = {
        versions: {
          cropped: uploadedImageData.cropped.version,
          original: uploadedImageData.original.version,
        },
        publicIds: {
          cropped: uploadedImageData.cropped.public_id,
          original: uploadedImageData.original.public_id,
        },
        signatures: {
          cropped: uploadedImageData.cropped.signature,
          original: uploadedImageData.original.signature,
        },
      };
    }

    updateBusinessProfileMut.mutate({ data: payload, id: businessId! });
  };

  const handleNextButton = (values: BusinessProfileFormikPropsValues) => {
    if (tabsRef.current) tabsRef.current.scrollIntoView({ behavior: "smooth" });
    if (validateRequiredFields(values)) return;
    setSelectedTab("operations-info");
  };

  useEffect(() => {
    if (uploadImageMut.isSuccess && formikSubmitValues) {
      if (businessId) {
        handleUpdateBusinessProfile(formikSubmitValues);
      } else {
        handleCreateBusinessProfile(formikSubmitValues);
      }
    }
  }, [uploadImageMut.isSuccess, formikSubmitValues]);

  useAfterMount(() => {
    if (businessId) {
      getBusinessProfile.mutate(businessId);
    }
  }, [businessId]);

  return (
    <FormikWrapper
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={() => {}}
      externalValues={formValues}
    >
      {(formikProps) => (
        <div
          ref={tabsRef}
          className="w-full px-3 pb-[150px] pt-[33px] bg-blue-205 rounded-[8px] "
        >
          <div className="bg-white-100 max-w-[609px] mx-auto px-4 md:px-8 rounded-[8px]">
            <FlexRowCenter className="w-full h-full gap-[10px] py-2 px-3 bg-white-100">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "text-[16px] font-bold font-pp cursor-pointer leading-[24px] py-2 w-full text-center border-b-4 border-gray-204",
                    // selectedTab?.toLowerCase() === tab.name.toLowerCase()
                    idx === 0
                      ? "border-b-4 border-[#1ABEBB] text-blue-200"
                      : "text-blue-200/60",
                    selectedTab?.toLowerCase() === tab.name.toLowerCase()
                      ? "border-b-4 border-[#1ABEBB] text-blue-200"
                      : "text-blue-200/60"
                  )}
                  onClick={() => {
                    if (selectedTab === "business-profile") {
                      handleNextButton(formikProps.values);
                    } else {
                      setSelectedTab(tab.name as RegisterBusinessTabs);
                    }
                  }}
                >
                  <span className="inset-0 z-0 bg-gradient-to- border-b-2 border-[#1ABEBB]"></span>
                </button>
              ))}
            </FlexRowCenter>

            {getBusinessProfile.isPending ? (
              <LoaderComponent />
            ) : selectedTab === "business-profile" ? (
              <NBusinessProfile
                {...formikProps}
                handleNextButton={handleNextButton}
                businessId={businessId!}
              />
            ) : (
              <NOperationInfo
                {...formikProps}
                handleSubmit={handleSubmit}
                businessId={businessId!}
                isLoading={
                  uploadImageMut.isPending ||
                  createBusinessProfileMut.isPending ||
                  updateBusinessProfileMut.isPending
                }
              />
            )}
          </div>

          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Success Modal"
            style={{
              overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
              content: {
                background: "none",
                outline: "none",
                border: "none",
              },
            }}
          >
            <FlexColCenter className="w-full h-full">
              <FlexColCenter className="w-full h-auto md:max-w-[400px] max-h-[80vh] bg-white-100 rounded-sm p-4 text-center">
                <h2 className="text-base font-bold mb-2.5">
                  {businessId ? "Update Succesful" : "You're in!"}
                </h2>
                <p className="text-xs font-normal mb-1">
                  {businessId
                    ? "You have successfully updated your business account."
                    : "You have successfully created your business account."}
                </p>

                <Button
                  intent={"primary"}
                  size={"lg"}
                  className="w-full rounded-[5px] mt-2"
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push("/view-business");
                  }}
                >
                  <span className="text-[14px] font-semibold font-pp">
                    Click to Continue
                  </span>
                </Button>
              </FlexColCenter>
            </FlexColCenter>
          </ReactModal>
        </div>
      )}
    </FormikWrapper>
  );
}

export default withAuth(RegisterBusinessPage);
