"use client";
import { getUserBusinessProfileList } from "@/api/business";
import {
  FlexColCenter,
  FlexColStart,
  FlexRowCenterBtw,
  FlexRowStartCenter,
} from "@/components/Flex";
import { Bag, CtaArrow, Plus, SearchIcon2, X } from "@/components/icons";
import Pill from "@/components/Pill";
import Button from "@/components/ui/button";
import { prevPageLocalKeyName } from "@/config";
import { CSR } from "@/helpers/csr";
import useAfterMount from "@/hooks/useAfterMount";
import { useAuth } from "@/hooks/useAuth";
import type { UserBusinessListResponse } from "@/types/business";
import { useState } from "react";
import ReactModal from "react-modal";

export function HeaderSearchComp() {
  return (
    <FlexColCenter className="w-full !gap-0">
      <a
        href="/search"
        className="w-full h-[44px] rounded-[10px] flex flex-row items-center justify-start px-[15px] gap-5 cursor-pointer bg-white border-[1px] border-solid border-blue-200 shadow-md bg-white-100"
        onClick={() => {
          localStorage.setItem(prevPageLocalKeyName, window.location.pathname);
        }}
      >
        <FlexRowStartCenter className="w-full gap-[4px]">
          <SearchIcon2 size={20} className="stroke-gray-103" strokeWidth={1} />
          <span
            className="text-[12px] leading-[14.32px] font-archivo font-normal relative top-[0px]"
            style={{
              color: "#9090A7",
            }}
          >
            Search businesses
          </span>
        </FlexRowStartCenter>
      </a>
    </FlexColCenter>
  );
}

export function HeaderOnboardingComp() {
  const { userDetails } = useAuth();
  const [showOnBoard, setShowOnBoard] = useState<boolean>(false);

  if (userDetails) return null;
  return (
    <div className="w-full pr-16 lg:pr-36">
      <Button
        intent="primary"
        // href="/onboarding"
        onClick={() => setShowOnBoard(true)}
        rightIcon={
          <span>
            <CtaArrow
              strokeWidth={1}
              className="stroke-white-100 inline-block"
            />
          </span>
        }
        className="w-full h-44px mt-4 rounded-md py-[15.5px]  px-[72px]"
      >
        <span className="font-archivo font-medium text-[14px] leading-[24px] text-white-100">
          Business Owner? Get Started
        </span>
      </Button>

      <ReactModal
        overlayClassName="fixed inset-0 flex items-center justify-center bg-[#00000080]"
        isOpen={showOnBoard}
        contentLabel="Filter"
        className="w-full md:w-[774px] sm:mx-auto my-auto mx-3 h-max rounded-[30px] bg-white-100 relative py-[32px] p-[20px] md:p-10"
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
        onRequestClose={() => setShowOnBoard(false)}
      >
        <div>
          <FlexRowCenterBtw className="w-full ">
            <h4 className="text-[16px] md:text-[25px] font-normal md:font-bold font-hnM leading-[24px] md:leading-[0] text-blue-200">
              Select the option that suits you
            </h4>

            <button
              className="enableBounceEffect"
              onClick={() => setShowOnBoard(false)}
            >
              <X className="stroke-dark-100" size={25} />
            </button>
          </FlexRowCenterBtw>

          <div className="w-full h-full ">
            <FlexColStart className="w-full gap-[30px] text-[16px] md:px-[32px] py-[50px] s:py-[32px] bg-white-100 ">
              <CSR
                render={({ userDetails, loading }) => (
                  <Pill
                    path={
                      userDetails ? "/auth/register-business" : "/auth/signup"
                    }
                    icon={
                      <span className="w-[20px] h-[20px] rounded-sm flex items-center justify-center bg-orange-300">
                        <Plus
                          strokeWidth={1}
                          className=" stroke-none fill-white-100"
                        />
                      </span>
                    }
                    title="New Business? Signup"
                    variant="red"
                  />
                )}
              />
              <Pill
                path="/auth/login"
                icon={<Bag className="stroke-none" />}
                title="Existing Business? Login"
                variant="pink"
              />
            </FlexColStart>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}

export function HeaderBusinessBtn() {
  const { userDetails } = useAuth();
  const [businessPresent, setBusinessPresent] = useState(false);

  useAfterMount(() => {
    if (userDetails) {
      getUserBusinessProfileList().then((res) => {
        const businessListResponse: UserBusinessListResponse = res.data;
        setBusinessPresent(
          businessListResponse.data?.businessProfiles.length > 0 || false
        );
      });
    }
  }, [userDetails]);

  return (
    <>
      {userDetails && (
        <FlexColStart className="gap-[5px]">
          {businessPresent && (
            <Button
              intent="primary"
              href="/view-business"
              leftIcon={<SearchIcon2 size={20} className="stroke-white-100" />}
              className="w-full mt-8 rounded-md h-[44px] pt-[10px] pr-[100px] pb-[10px] pl-[100px]"
            >
              <span className="font-archivo font-semibold text-[14px] leading-[24px] text-white-100 ">
                View your business
              </span>
            </Button>
          )}
          <Button
            intent="transparent"
            href="/register-business"
            leftIcon={
              <Plus
                strokeWidth={0.8}
                size={25}
                className="fill-blue-200 stroke-none"
              />
            }
            className="w-full mt-8 rounded-md h-[44px]"
          >
            <span
              className={`font-archivo font-semibold text-[14px] leading-[24px] ${
                !businessPresent && "text-blue-200"
              }`}
            >
              {businessPresent
                ? "Create a new business profile"
                : "Create your first business profile"}
            </span>
          </Button>
        </FlexColStart>
      )}
    </>
  );
}
