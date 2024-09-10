"use client";
import { useEffect, useState } from "react";
import Button from "@components/ui/button";
import { JwtPayload, TOKEN_NAME } from "@/types/auth";
import { logOut } from "@/api/auth";
import {
  FlexColStart,
  FlexRowCenter,
  FlexRowCenterBtw,
  FlexRowEndBtw,
  FlexRowStart,
} from "@components/Flex";
import { cn } from "@/lib/utils";
import { useAuth } from "@hooks/useAuth";
import { Cancel, Menu, Plus } from "./icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import UserProfileMenu from "./UserProfileMenu";

const navigationRoute = [
  { title: "Discover Businesses", name: "discover-business", path: "/search" },
  { title: "My Businesses", name: "", path: "/view-business" },
  { title: "My Account", name: "", path: "/account", requiresAuth: true },
  { title: "Support", name: "", path: "/contact-support" },
  { title: "Login", name: "login", path: "/auth/login" },
  { title: "Signup", name: "signup", path: "/auth/signup" },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath = pathname.includes("/auth");
  const [tokenData, setTokenData] = useState<JwtPayload | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { loading, userDetails } = useAuth();

  useEffect(() => {
    const authToken = localStorage.getItem(TOKEN_NAME) as string;
    if (authToken === null) return;
    try {
      const parsedToken = JSON.parse(atob(authToken?.split(".")[1]));
      setTokenData(parsedToken);
    } catch (e: any) {
      console.error("Error parsing token: ", e);
    }
  }, []);

  const handleLogOut = () => {
    logOut(tokenData?.id || "")
      .then(() => {
        localStorage.removeItem(TOKEN_NAME);
        router.push("/?login=false");
        setMenuOpen(false);

        // force reload the page to clear all active states.
        window && window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleMenuIcon = () => {
    setMenuOpen(true);
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <FlexColStart className="w-full h-full bg-blue-203 max-w-7xl mx-auto">
          <FlexRowCenterBtw className="w-full rounded-[5px] px-8 py-[18px] shadow-sm bg-white-100">
            <a href="/">
              <img src={"/assets/images/logo/logo-header.svg"} />
            </a>

            {!loading && !userDetails?.email ? (
              <div
                style={{ backgroundColor: isAuthPath ? "!hidden" : "" }}
                className="justify-between items-center hidden md:flex font-medium text-sm leading-[14px] text-gray-100"
              >
                {navigationRoute.map((route) => {
                  if (route.name !== "login" && route.name !== "signup") {
                    return (
                      <Link
                        key={route.name}
                        href={route.path}
                        className={`${
                          pathname === route.path && "text-brand-green-shade99"
                        } mx-3 sm:mx-4 p-3`}
                      >
                        {route.title}
                      </Link>
                    );
                  } else if (route.name === "login") {
                    return (
                      <Button
                        key={route.name}
                        intent="transparent"
                        href="/auth/login"
                        className="px-[15px] py-[15.5px] b !text-blue-200 bg-white-100 rounded-md border-[1px] border-white-100 hidden lg:flex text-center items-center justify-center mr-2"
                        hardRefresh={true}
                      >
                        <span className="font-hnM text-sm leading-[15px] font-medium">
                          Log In
                        </span>
                      </Button>
                    );
                  } else if (route.name === "signup") {
                    return (
                      <Button
                        key={route.name}
                        intent="primary"
                        href="/auth/signup"
                        className="px-[20px] py-[15.5px] hidden lg:flex text-center items-center justify-center"
                        hardRefresh={true}
                      >
                        <span className="font-hnM text-sm leading-[15px] font-medium">
                          Sign Up
                        </span>
                      </Button>
                    );
                  }
                })}
              </div>
            ) : (
              <FlexRowEndBtw className="justify-between items-center hidden md:flex font-medium text-sm leading-[14px] gap-[89px] text-gray-100">
                <FlexRowCenter className="w-full flex items-center gap-[5px] whitespace-nowrap">
                  <Link
                    href="/view-business"
                    className={`${
                      pathname === "/view-business" &&
                      " text-brand-green-shade99"
                    } sm:mx-4 p-3`}
                  >
                    My Businesses
                  </Link>

                  <Link
                    href="/search"
                    className={`${
                      pathname === "/search" && " text-brand-green-shade99"
                    } sm:mx-4 p-3`}
                  >
                    Discover Businesses{" "}
                  </Link>
                  <Link
                    href="/contact-support"
                    className={`${
                      pathname === "/contact-support" &&
                      " text-brand-green-shade99"
                    } sm:mx-4 p-3`}
                  >
                    Support
                  </Link>

                  <Link
                    href="/about-us"
                    className={`${
                      pathname === "/about-us" && " text-brand-green-shade99"
                    } sm:mx-4 p-3`}
                  >
                    About Us
                  </Link>
                </FlexRowCenter>

                <UserProfileMenu />
              </FlexRowEndBtw>
            )}

            <Menu
              size={30}
              className="stroke-blue-200 cursor-pointer relative top-3 md:hidden"
              onClick={() => {
                handleMenuIcon();
              }}
            />
          </FlexRowCenterBtw>

          {menuOpen && (
            <div
              className={cn(
                "ease-in-out duration-500 w-full h-max fixed md:absolute top-0 left-0 shadow-md px-[32px] py-[4em] bg-white-100 z-[999] md:hidden",
                menuOpen
                  ? "ease-in-out duration-500 w-full h-max fixed md:absolute top-0 left-0 shadow-md px-[32px] py-[4em] bg-white-100 z-[999] md:hidden"
                  : "ease-in-out duration-500"
              )}
            >
              <img
                className="w-[180px]"
                src={"/assets/images/logo/logo-header.svg"}
              />
              <Cancel
                className="absolute top-[4em] right-[24px] cursor-pointer"
                onClick={() => setMenuOpen(false)}
              />

              <FlexColStart className="w-full mt-10 list-none">
                {navigationRoute
                  .filter((nav) => !(nav.requiresAuth && !userDetails))
                  .map((nav, i) => {
                    const pathname = window.location.pathname;
                    const currPage = pathname.split("/").pop();

                    return (
                      <a
                        href={nav.path}
                        key={i}
                        className={cn(
                          "w-full pb-[15px] font-pp font-medium text-[15px] md:text-[18px] tracking-normal leading-14 text-gray-100 cursor-pointer",
                          currPage === nav.path.replace("/", "")
                            ? "text-teal-100"
                            : ""
                        )}
                        onClick={() => setMenuOpen(false)}
                      >
                        {nav.title}
                      </a>
                    );
                  })}

                {!loading && !userDetails?.email && (
                  <FlexRowStart className="w-full mt-[30px]">
                    <Button
                      href={"/auth/signup"}
                      className="w-full max-w-[120px] h-[55px] p-[8px] rounded-[6px]"
                      intent={"primary"}
                      onClick={() => setMenuOpen(false)}
                    >
                      Signup
                    </Button>
                    <Button
                      href={"/auth/login"}
                      className="w-full max-w-[120px] h-[55px] p-[8px] rounded-[6px]"
                      intent={"transparent"}
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Button>
                  </FlexRowStart>
                )}
                {userDetails && (
                  <>
                    <Button
                      className="w-full sm:w-max px-4 h-[44px] bg-white-100 text-[15px] font-pp font-medium leading-[16.32px] tracking-normal text-white !border border-blue-200 hover:bg-white-100"
                      onClick={() => router.push("/register-business")}
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

                    <Button
                      className="w-full h-[37px] py-[20px] rounded-[5px] mt-3 border border-red-803 text-red-803"
                      intent={"transparent"}
                      onClick={handleLogOut}
                    >
                      <span className="font-hnM">Logout</span>
                    </Button>
                  </>
                )}
              </FlexColStart>
            </div>
          )}
        </FlexColStart>
      </div>
    </div>
  );
};

export default Navbar;
