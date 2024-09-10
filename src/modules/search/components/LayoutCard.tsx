"use client";
import {
  FlexColStart,
  FlexRowCenter,
  FlexRowCenterBtw,
  FlexRowEnd,
  FlexRowStartCenter,
} from "@components/Flex";
import { MapPin, Phone } from "@components/icons";
import { determineBusOpTime } from "@/utils";
import { cn } from "@/lib/utils";
import TooltipComp from "@/components/TooltipComp";
import Image from "next/image";
import Link from "next/link";

interface BusinessCardProps {
  name: string;
  categories: string[] | undefined;
  location: string;
  operationDays:
    | {
        day: string | null;
        openTime: string | null;
        closeTime: string | null;
      }[]
    | undefined;
  phone: string;
  id: string;
  image: string;
  _key: string;
  _urlLocation: string;
  windowLocation: string;
}

const NAME_CONSTRAINT = 30;

export const ColLayoutCard = ({
  name,
  categories,
  location,
  operationDays,
  phone,
  image,
  id,
  _key,
  _urlLocation,
  windowLocation,
}: BusinessCardProps) => {
  const hasBusinessClosed = operationDays
    ? determineBusOpTime(operationDays)
    : null;

  const getPathname = () => {
    try {
      const { pathname } = new URL(windowLocation);
      return pathname;
    } catch (e: any) {
      return null;
    }
  };

  const pathname = getPathname();

  return (
    <CardWrapper key={_key} className="w-full md:max-w-[330px] min-h-[450px]">
      <CardNavigateWrapper
        id={id}
        name={name}
        location={_urlLocation}
        windowLocation={windowLocation}
      >
        <div className="w-full md:max-w-[330px] h-[328px] rounded-[10px] relative overflow-hidden">
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            loading="lazy"
          />
        </div>
      </CardNavigateWrapper>
      <FlexColStart className="w-full px-[4px] py-[2px] gap-0 mt-[10px]">
        <CardNavigateWrapper
          id={id}
          name={name}
          location={_urlLocation}
          windowLocation={windowLocation}
        >
          <h2 className="text-[15px] font-semibold font-archivo text-blue-200 leading-[18.31px]">
            {name.length > NAME_CONSTRAINT
              ? name.slice(0, NAME_CONSTRAINT) + "..."
              : name}
          </h2>

          {/* categories */}
          <FlexRowCenterBtw className="gap-[2px] mt-1">
            {categories &&
              categories.map((c) => {
                return (
                  <FlexRowCenter className="gap-[2px]" key={c}>
                    <span className="text-[11px] leading-[13px] font-light font-archivo text-gray-103">
                      {c}
                    </span>
                    {categories[categories.length - 1] !== c && (
                      <span className="h-[3px] w-[3px] rounded-full text-[6px] bg-teal-100"></span>
                    )}
                  </FlexRowCenter>
                );
              })}
          </FlexRowCenterBtw>

          {/* location */}
          <FlexRowStartCenter className="gap-[5px] h-[16px] py-[15px]">
            <MapPin size={15} className="stroke-gray-100/70" />
            <span className="text-[13px] font-normal font-archivo text-blue-200 mt-[3px]">
              {location}
            </span>
          </FlexRowStartCenter>
        </CardNavigateWrapper>

        {/* opening time */}
        {pathname != "/view-business" && (
          <FlexRowCenterBtw className="w-full">
            <CardNavigateWrapper
              id={id}
              name={name}
              location={_urlLocation}
              windowLocation={windowLocation}
            >
              <FlexRowStartCenter className="gap-[10px] whitespace-nowrap">
                {hasBusinessClosed && hasBusinessClosed.isOpened ? (
                  <>
                    <span className="text-[11px] font-normal font-archivo leading-[13px] text-teal-100">
                      Open
                    </span>
                    <span className="h-[3px] w-[3px] rounded-full text-[6px] bg-dark-105"></span>

                    <span className="text-[11px] font-normal font-archivo leading-[13px]">
                      Closes {hasBusinessClosed.closingTime}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] font-normal font-archivo leading-[13px] text-red-301">
                    Closed
                  </span>
                )}
              </FlexRowStartCenter>
            </CardNavigateWrapper>

            <CallButton phone={phone} layout="col" />
          </FlexRowCenterBtw>
        )}
        {/* share */}
        {pathname == "/view-business" && (
          <FlexRowCenterBtw className="gap-[10px] w-full">
            <button className="flex flex-row items-center justify-center w-full bg-blue-202 px-[5px] py-[13px] rounded-[5px] gap-[5px] text-[12px] businesss-call-line">
              <span className="text-[12px] font-medium font-archivo leading-[14.53px] mt-[2px] text-blue-200">
                Update Business Details
              </span>
            </button>

            <div className="bg-blue-204 p-3 round-[5px]">
              {/* <Share size={15} className="stroke-blue-200/80" /> */}
            </div>
          </FlexRowCenterBtw>
        )}
      </FlexColStart>
    </CardWrapper>
  );
};

export const RowLayoutCard = ({
  name,
  categories,
  location,
  operationDays,
  phone,
  image,
  id,
  _urlLocation,
  windowLocation,
}: BusinessCardProps) => {
  const hasBusinessClosed = operationDays
    ? determineBusOpTime(operationDays)
    : null;

  return (
    <CardWrapper className="w-full max-h-[110px] pb-[10px]">
      <FlexRowStartCenter className="w-full px-[0px]">
        <CardNavigateWrapper
          id={id}
          name={name}
          location={_urlLocation}
          windowLocation={windowLocation}
        >
          {/* a parent container was added so objectFit could work properlly. */}
          <div
            className="rounded-[10px] relative overflow-hidden"
            style={{
              width: "64px",
              height: "95px",
            }}
          >
            <Image
              src={image}
              alt={name}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              loading="lazy"
            />
          </div>
        </CardNavigateWrapper>
        <FlexColStart className="w-full px-[5px] gap-0 mt-2">
          <CardNavigateWrapper
            id={id}
            name={name}
            location={_urlLocation}
            windowLocation={windowLocation}
          >
            <h2 className="text-[15px] font-semibold font-archivo text-blue-200 leading-[18.31px]">
              {name.length > NAME_CONSTRAINT
                ? name.slice(0, NAME_CONSTRAINT) + "..."
                : name}
            </h2>
          </CardNavigateWrapper>

          <CardNavigateWrapper
            id={id}
            name={name}
            location={_urlLocation}
            windowLocation={windowLocation}
          >
            {/* categories */}
            <FlexRowCenterBtw className="w-auto gap-2 mt-1">
              {categories &&
                categories.map((c) => {
                  return (
                    <FlexRowCenter className="gap-[2px]" key={c}>
                      <span className="text-[11px] leading-[13px] font-light font-archivo text-gray-103">
                        {c}
                      </span>
                      {categories[categories.length - 1] !== c && (
                        <span className="h-[3px] w-[3px] rounded-full text-[6px] bg-teal-100"></span>
                      )}
                    </FlexRowCenter>
                  );
                })}
            </FlexRowCenterBtw>

            {/* location */}
            <FlexRowStartCenter className="gap-[5px] h-[16px] py-[15px]">
              <MapPin size={15} className="stroke-gray-100/70" />
              <span className="text-[13px] font-normal font-archivo text-blue-200 mt-[3px]">
                {location}
              </span>
            </FlexRowStartCenter>
          </CardNavigateWrapper>

          {/* opening time */}
          <FlexRowCenterBtw className="w-full">
            <CardNavigateWrapper
              id={id}
              name={name}
              location={_urlLocation}
              windowLocation={windowLocation}
            >
              <FlexRowStartCenter className="w-full gap-[10px] whitespace-nowrap">
                {hasBusinessClosed && hasBusinessClosed.isOpened ? (
                  <>
                    <span className="text-[11px] font-normal font-archivo leading-[13px] text-teal-100">
                      Open
                    </span>
                    <span className="h-[3px] w-[3px] rounded-full text-[6px] bg-dark-105"></span>

                    <span className="text-[11px] font-normal font-archivo leading-[13px]">
                      Closes {hasBusinessClosed.closingTime}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] font-normal font-archivo leading-[13px] text-red-301">
                    Closed
                  </span>
                )}
              </FlexRowStartCenter>
            </CardNavigateWrapper>

            <FlexRowEnd className="w-full">
              <CallButton phone={phone} layout="row" />
            </FlexRowEnd>
          </FlexRowCenterBtw>
        </FlexColStart>
      </FlexRowStartCenter>
    </CardWrapper>
  );
};

function CallButton({
  phone,
  layout,
}: {
  phone: string;
  layout: "col" | "row";
}) {
  let callBtn = null;
  if (layout === "col") {
    callBtn =
      phone && phone.length > 0 ? (
        <a
          href={`tel:${phone}`}
          className="flex flex-row items-center justify-center text-blue-200 bg-blue-202 w-[81px] h-[25px] px-[5px] rounded-full gap-[5px] text-[12px] whitespace-nowrap businesss-call-line"
          target="_blank"
        >
          <Phone size={15} className="stroke-blue-200/80" />
          <span className="text-[12px] font-normal font-archivo leading-[14px] mt-[2px]">
            Call me
          </span>
        </a>
      ) : (
        <TooltipComp text="No phone number available">
          <div className="flex flex-row items-center justify-center text-blue-200 w-[81px] h-[25px] px-[5px] rounded-full gap-[5px] text-[12px] whitespace-nowrap businesss-call-line opacity-50 cursor-not-allowed bg-gray-100/20">
            <Phone size={15} className="stroke-blue-200/80" />
            <span className="text-[12px] font-normal font-archivo leading-[14px] mt-[2px]">
              Call me
            </span>
          </div>
        </TooltipComp>
      );
  }
  if (layout === "row") {
    callBtn =
      phone && phone.length > 0 ? (
        <a
          href={`tel:${phone}`}
          className="flex flex-row items-center justify-center text-blue-200 bg-blue-202 w-[35px] h-[25px] px-[5px] rounded-full gap-[5px] text-[12px] businesss-call-line"
          target="_blank"
        >
          <Phone size={15} className="stroke-blue-200/80" />
        </a>
      ) : (
        <TooltipComp text="No phone number available">
          <div className="flex flex-row items-center justify-center w-[35px] h-[25px] px-[5px] rounded-full gap-[5px] text-[12px] businesss-call-line opacity-50 cursor-not-allowed g-gray-100/20">
            <Phone size={15} className="stroke-blue-200/80" />
          </div>
        </TooltipComp>
      );
  }
  return callBtn;
}

interface CWProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: React.ComponentProps<"div">["className"];
}

const CardWrapper = ({ children, style, className, ...props }: CWProps) => {
  return (
    <div
      className={cn(
        "w-full rounded-[10px] shadow-white-300 shadow-md bg-white-100 pt-[6px] pr-[8px] pb-[6px] pl-[8px] gap-[10px] ",
        className
      )}
      style={{
        background: "#FFFFFF",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const CardNavigateWrapper = ({
  id,
  children,
  location,
  name,
  windowLocation,
}: {
  id: string;
  name: string;
  location: string;
  children: React.ReactNode;
  windowLocation: string;
}) => {
  const _location = new URL(windowLocation);
  const loc = location.replace(/\s/gi, "-");
  const _name = name.toLowerCase().replace(/\s/gi, "-");
  const params = new URLSearchParams(_location.search);
  const layoutParam = params.get("layout") ?? "col";
  const combinedUrl = `/biz/${_name}-${loc}/${id}?layout=${layoutParam}`;
  return (
    <Link
      href={combinedUrl}
      className="w-auto outline-none border-none bg-none cursor-pointer"
      key={id}
      onClick={(e) => {
        const target =
          (e.target as HTMLElement)?.parentElement?.classList.contains(
            "businesss-call-line"
          ) ||
          (e.target as HTMLElement)?.classList.contains("businesss-call-line");
        // prevent redirecting to specified page and opening the tel-phone number on that page
        if (target) {
          console.log("target exiusts");
          e.preventDefault();
          return;
        }
      }}
    >
      {children}
    </Link>
  );
};
