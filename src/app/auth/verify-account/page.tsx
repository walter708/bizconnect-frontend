"use client";
import { LoaderComponent } from "@/components/Loader";
import Button from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FlexColCenter } from "@components/Flex";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const VerifiedAccount = () => {
  const router = useRouter();
  const { loading, userDetails } = useAuth();

  useEffect(() => {
    if (!loading && userDetails?.verified) {
      setTimeout(() => {
        router.push("/");
      }, 500);
    }
  }, [loading, userDetails]);

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <FlexColCenter className="w-full h-full md:h-screen bg-gray-50 py-[80px] px-[16px] pb-[150px] gap-3">
      <div className="w-full max-w-[500px] rounded-[20px] py-[46px] px-[16px] pb-[32px]  bg-white-100 text-center mx-auto">
        <div className="text-[16px] font-semibold leading-[24px] font-pp mb-[24px]">
          {userDetails?.verified ? (
            <div className="flex flex-col items-center">
              <img
                src="/assets/icons/email-success.svg"
                className="mb-2"
                alt=""
              />
              <h1 className="leading-[30px] text-[20px] font-bold">
                Email verification successful
              </h1>
              <h3 className="text-gray-103  text-[15px] leading-[30px] tracking-[0] text- mb-4 font-normal">
                Your email address has been verified sucessfully
              </h3>
              <Button className="text-white-100 bg-blue-200 px-[55.3px] py-[22.12px]">
                Okay, awesome!
              </Button>
            </div>
          ) : (
            <FlexColCenter className="flex flex-col items-center">
              <img src="/assets/icons/checkmail.svg" className="mb-2" alt="" />
              <div className="mb-2">Check your email</div>
              <div className="text-gray-103 text-[15px] leading-[30px] font-normal tracking-[0]">
                A link to verify your email has been sent to your mail{" "}
                <span className="font-bold text-blue-200">
                  tan*****@gmail.com
                </span>
              </div>
            </FlexColCenter>
          )}
        </div>
      </div>
      {!userDetails?.verified && (
        <p className="text-gray-100 text-[12px] md:text-[15px] leading-[30px] font-normal tracking-[0]">
          Can't find mail?{" "}
          <span className="text-blue-200 font-normal underline">Resend</span>
        </p>
      )}
    </FlexColCenter>
  );
};

export default VerifiedAccount;
