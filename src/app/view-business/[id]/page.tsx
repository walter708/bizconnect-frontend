"use client";
import {
  deleteUserBusinessProfile,
  getUserBusinessProfileDetail,
} from "@/api/business";
import BreadCrumb from "@/components/BreadCumb";
import { FlexColCenter, FlexColStart, FlexRowStart } from "@/components/Flex";
import { LoaderComponent } from "@/components/Loader";
import BusinessDetailsPreview from "@/modules/business/components/BusinessDetailsPreview";
import BackBtn from "@/modules/businessDetails/components/BackBtn";
import { BaseResponseMessage } from "@/types/auth";
import type { IBusinessProfile } from "@/types/business-profile";
import { constructBizImgUrl } from "@/utils";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "react-modal";
import DeleteBusinessModalCard from "@/modules/view-business/components/DeleteBusinessModalCard";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAfterMount from "@/hooks/useAfterMount";
import BusinessesNotfound from "@/components/NotFound";
import usePageLoading from "@/hooks/usePageLoading";
import withAuth from "@/utils/auth-helpers/withAuth";

const BusinessDetail = () => {
  const [businessDetails, setBusinessDetails] =
    useState<IBusinessProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialPageLoading = usePageLoading();
  const getBusinessProfileMutation = useMutation({
    mutationKey: ["getBusinessProfile"],
    mutationFn: () => getUserBusinessProfileDetail(id as string),
    onSuccess: (data) => {
      const resp = data.data as any;
      setBusinessDetails(resp?.data?.details);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
      setError("Something went wrong");
    },
  });
  const deleteBusinessProfileMutation = useMutation({
    mutationKey: ["deleteBusinessProfile"],
    mutationFn: (businessProfileID: string) =>
      deleteUserBusinessProfile(businessProfileID),
    onSuccess: (data) => {
      const resp = data.data as BaseResponseMessage;
      if (resp.success) {
        toast.success("Business profile deleted successfully");
        setIsModalOpen(false);
        router.back();
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
      setIsModalOpen(false);
      setError("Something went wrong");
    },
  });

  useAfterMount(() => {
    getBusinessProfileMutation.mutate();
  }, [id]);

  if (error) {
    return (
      <FlexColCenter className="w-full h-screen">
        <p className="text-red-500 font-normal text-[15px]">{error}</p>
      </FlexColCenter>
    );
  }

  if (initialPageLoading || getBusinessProfileMutation.isPending) {
    return <LoaderComponent />;
  }

  if (!businessDetails && !getBusinessProfileMutation.isPending) {
    return <BusinessesNotfound message="This business does not exist" />;
  }

  return (
    <>
      {businessDetails && (
        <FlexColStart className="w-full h-auto md:px-[28px] px-4 bg-blue-203">
          <div className="hidden md:flex flex-col w-full">
            <BreadCrumb
              items={[
                {
                  label: "My Business",
                  href: "/view-business",
                },
                {
                  label: businessDetails?.name,
                  href: "#",
                  isActive: true,
                },
              ]}
            />
            <div className="text-[30px] font-bold text-blue-200">
              {businessDetails?.name}
            </div>
          </div>

          <div className="md:hidden flex items-center justify-between w-full">
            <BackBtn label="My Businesses" />
          </div>

          <div className="max-w-full mx-auto w-full pb-20">
            <div className="grid md:grid-cols-2 gap-5 h-screen mb-10 bg-white-100 px-4 pt-[33px] pb-40 b-20">
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

              <BusinessDetailsPreview
                businessDetails={businessDetails}
                onDelete={() => setIsModalOpen(true)}
                hideActionButtons={false}
              />
            </div>
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Success Modal"
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-90%",
                transform: "translate(-50%, -50%)",
                maxWidth: "90%",
                maxHeight: "80vh",
                overflow: "auto",
                borderRadius: "15px",
              },
              overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            }}
          >
            <DeleteBusinessModalCard
              businessDetails={businessDetails as IBusinessProfile}
              onDelete={(id: string) =>
                deleteBusinessProfileMutation.mutate(id)
              }
              closeModal={() => setIsModalOpen(false)}
              isLoading={deleteBusinessProfileMutation.isPending}
            />
          </Modal>
        </FlexColStart>
      )}
    </>
  );
};
export default withAuth(BusinessDetail);
