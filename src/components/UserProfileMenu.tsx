import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Button from "./ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus } from "./icons";
import { NSelect } from "./NewFilterComponent/NSelect";
import Divider from "./Divider";
import { FlexColStart } from "./Flex";
import { logOut } from "@/api/auth";
import { TOKEN_NAME } from "@/types/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

type MiniCardProps = {};

const MinicardMenu = [
  { key: "account", title: "My Account", path: "/account" },
  { key: "logout", title: "Log out" },
];

const UserProfileMenu: React.FC<MiniCardProps> = () => {
  const { userDetails, loading } = useAuth();
  const router = useRouter();

  const handleLogoutClick = () => {
    logOut(userDetails?.uuid || "")
      .then(() => {
        localStorage.removeItem(TOKEN_NAME);
        router.push("/?login=false");

        // force reload the page to clear all active states.
        window && window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <NSelect
      leftIcon={<img src="/assets/icons/profile.svg" alt="" />}
      rightIcon={
        <ChevronDown size={25} className="stroke-gray-103 cursor-pointer" />
      }
      className="w-auto border-none outline-none ring-none focus:border-none focus:outline-none"
      valueClassName="text-[15px] text-blue-200 font-medium"
      popoverContentClassName="hidden md:flex w-[231px] bg-white-100 rounded-[10px] flex flex-col gap-[19px] shadow-md z-50 shadow-slate-300 translate-y-[8px] shadow-lg shadow-slate-300 border-none outline-none rounded-t-[0px] p-0"
      value={loading ? "Loading..." : userDetails?.firstName ?? "N/A"}
      hideSearch
      disabled={loading}
      render={() => (
        <div className="text-[15px] text-blue-200 font-medium p-4">
          <p className="text-sm font-normal text-gray-100/50">Menu</p>
          <Divider className="border-solid border-[.5px] border-gray-100/20" />
          <FlexColStart className="w-full">
            {MinicardMenu.map((item) =>
              item.key === "account" ? (
                <Link href={item.path ?? ""} key={item.key}>
                  <button
                    className={cn(
                      `w-full text-blue-200 flex flex-row items-center text-[14px] font-medium cursor-pointer py-1 enableMiniBounceEffect`
                    )}
                    key={item.key}
                  >
                    {item.title}
                  </button>
                </Link>
              ) : (
                <button
                  onClick={
                    item.key === "logout"
                      ? handleLogoutClick
                      : () => router.push(item.path ?? "")
                  }
                  key={item.key}
                  className={cn(
                    `w-full text-blue-200 flex flex-row items-center text-[14px] font-medium cursor-pointer py-1 enableMiniBounceEffect`,
                    item.key === "logout" && "text-red-305"
                  )}
                >
                  {item.title}
                </button>
              )
            )}
            <Button
              className="w-full px-4 h-[44px] bg-white-100 text-[13px] font-pp font-medium gap-3 tracking-normal text-white border border-blue-200 hover:bg-white-100 enableBounceEffect flex-center"
              href="/register-business"
              leftIcon={
                <Plus
                  size={20}
                  className="stroke-blue-200 fill-blue-200"
                  strokeWidth={1}
                />
              }
            >
              Add a new business
            </Button>
          </FlexColStart>
        </div>
      )}
    />
  );
};

export default UserProfileMenu;
