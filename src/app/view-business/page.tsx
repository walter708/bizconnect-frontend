"use client";
import Button from "@components/ui/button";
import { BaseResponseMessage } from "@/types/auth";
import React, { useState } from "react";
import Modal from "react-modal";
import {
  getUserBusinessProfileList,
  deleteUserBusinessProfile,
} from "@/api/business";
import { UserBusinessListResponse } from "@/types/business";
import { FlexColCenter, FlexColStart } from "@components/Flex";
import { LoaderComponent } from "@components/Loader";
import ReadMoreText from "@/components/ReadMoreText";
import withAuth from "@/utils/auth-helpers/withAuth";
import { Plus } from "@/components/icons";
import { constructBizImgUrl } from "@/utils";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessDetailsPreview from "@/modules/business/components/BusinessDetailsPreview";
import type { IBusinessProfile } from "@/types/business-profile";
import { useMutation } from "@tanstack/react-query";
import useAfterMount from "@/hooks/useAfterMount";
import { toast } from "react-toastify";
import Link from "next/link";
import DeleteBusinessModalCard from "@/modules/view-business/components/DeleteBusinessModalCard";
import router from "next/router";

const ViewBusiness = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userListOfBusinessProfile, setUserListOfBusinessProfile] = useState<
    IBusinessProfile[] | []
  >([]);
  const [selectedBusiness, setSelectedBusiness] =
    useState<IBusinessProfile | null>(null);
  const getBusinessProfileMutation = useMutation({
    mutationKey: ["getBusinessProfile"],
    mutationFn: () => getUserBusinessProfileList(),
    onSuccess: (data) => {
      const resp = data.data as UserBusinessListResponse;
      const businessList = resp.data.businessProfiles as IBusinessProfile[];
      setUserListOfBusinessProfile(businessList);
      setSelectedBusiness(businessList.length > 0 ? businessList[0] : null);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
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
        setSelectedBusiness(null);
        getBusinessProfileMutation.mutate();
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  useAfterMount(() => {
    getBusinessProfileMutation.mutate();
  }, []);

  return (
    <>
      <div className="w-full px-[16px] bg-blue-205 pb-20">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between w-full text- py-5">
          <div className="">
            <h2 className="mb-[5px] sm:mb-[16px] text-[32px] md:text-[40px] leading-[40px] md:leading-[42px] font-semibold font-pp text-blue-200">
              My Businesses
            </h2>
            <p className="text-[13px] md:text-[20px] font-pp leading-[24px] md:leading-[23px] font-medium text-gray-103">
              Here is a list of all business associated with your account.
            </p>
          </div>
          <div className="w-full sm:w-[unset]">
            <Button
              className="w-full sm:w-max px-4 h-[44px] bg-white-100 text-[15px] font-pp font-medium leading-[16.32px] tracking-normal text-white border border-blue-200 hover:bg-white-100"
              href="/register-business"
              leftIcon={
                <Plus
                  size={20}
                  strokeWidth={1}
                  className="fill-blue-200 stroke-blue-200"
                />
              }
            >
              Add a new business
            </Button>
          </div>
        </header>

        {getBusinessProfileMutation.isPending && (
          <FlexColCenter className="w-full">
            <LoaderComponent />
          </FlexColCenter>
        )}

        {!getBusinessProfileMutation.isPending &&
          userListOfBusinessProfile.length > 0 && (
            <div className="w-full md:grid lg:grid-cols-2 gap-5 h-auto mb-10 bg-white-100 pt-[33px] pb-40">
              <ScrollArea className="w-full h-screen">
                <FlexColStart className="w-full gap-10 lg:px-3 md:grid md:grid-cols-2 items-center">
                  {userListOfBusinessProfile.map((profile, i) => {
                    return (
                      <React.Fragment key={i}>
                        {/* desktop view */}
                        <div
                          className={cn(
                            selectedBusiness?.uuid == profile.uuid &&
                              "shadow-lg",
                            "w-full h-auto hidden md:block p-3 rounded-[8px] pb-[10px] cursor-pointer"
                          )}
                          key={i}
                          onClick={() => setSelectedBusiness(profile)}
                        >
                          <div className="w-full h-[342px] relative rounded-[10px] overflow-hidden">
                            <Image
                              src={constructBizImgUrl(
                                profile?.croppedImageUrl!
                              )}
                              alt={profile.name}
                              layout="fill"
                              objectFit="cover"
                              objectPosition="center"
                              loading="lazy"
                              className="w-full"
                            />
                          </div>
                          <h3 className="text-[16px] font-pp font-semibold leading-[40px]">
                            {profile.name}
                          </h3>
                          <p className="text-[16px] leading-[24px] mb-[20px]">
                            <ReadMoreText text={profile.description!} />
                          </p>
                        </div>

                        {/* mobile view */}
                        <Link
                          href={`/view-business/${profile.uuid}`}
                          className={cn(
                            selectedBusiness?.uuid == profile.uuid &&
                              "shadow-lg",
                            "w-full h-auto block md:hidden p-3 rounded-[8px] pb-[10px] cursor-pointer"
                          )}
                        >
                          <div className="w-full h-[342px] relative rounded-[10px] overflow-hidden">
                            <Image
                              src={constructBizImgUrl(
                                profile?.croppedImageUrl!
                              )}
                              alt={profile.name}
                              layout="fill"
                              objectFit="cover"
                              objectPosition="center"
                              loading="lazy"
                              className="w-full"
                            />
                          </div>
                          <h3 className="text-[16px] font-pp font-semibold leading-[40px]">
                            {profile.name}
                          </h3>
                          <p className="text-[16px] leading-[24px] mb-[20px]">
                            <ReadMoreText text={profile.description!} />
                          </p>
                        </Link>
                      </React.Fragment>
                    );
                  })}

                <div className={`w-full flex flex-col flex-1 gap-[10px] items-center justify-center p-3 rounded-[8px] pb-[10px] cursor-pointer bg-gray-222 border border-dashed border-blue-200 h-[450px]` }  onClick={() => router.push("/register-business")}>
                  <img src="/assets/icons/add-view-bui.svg" alt="" />
                  <h1 className="text-[15px] font-medium text-blue-200 leading-[auto]">Add a new business</h1>
                </div>
                </FlexColStart>
              </ScrollArea>

              <FlexColCenter className="w-full hidden md:block">
                {selectedBusiness && (
                  <BusinessDetailsPreview
                    businessDetails={selectedBusiness}
                    onDelete={() => setIsModalOpen(true)}
                    hideActionButtons={false}
                  />
                )}
              </FlexColCenter>
            </div>
          )}

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
            businessDetails={selectedBusiness as IBusinessProfile}
            onDelete={(id: string) => deleteBusinessProfileMutation.mutate(id)}
            closeModal={() => setIsModalOpen(false)}
            isLoading={deleteBusinessProfileMutation.isPending}
          />
        </Modal>
      </div>
    </>
  );
};

export default withAuth(ViewBusiness);
