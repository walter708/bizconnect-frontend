"use client";
import { cn } from "@/lib/utils";
import { FlexRowStart } from "@components/Flex";
import { fadeIn } from "@/utils/motion";
import { motion } from "framer-motion";

const navigations = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About",
    link: "/about-us",
  },
  {
    name: "Discover Businesses",
    link: "/search",
  },
  {
    name: "Support",
    link: "/contact-support",
  },
];

const socialLinks = [
  { name: "instagram" },
  { name: "facebook" },
  { name: "twitter" },
];

const Footer = () => {
  return (
    <div className="w-full bg-blue-205">
      <footer
        className="w-full text-white-100 px-7 py-10 mx-auto max-w-7xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="lg:flex items-center justify-between">
          <div className="">
            <a href="/">
              <img
                className="w-[200px]"
                src={"/assets/images/logo/logo-header.svg"}
              />
            </a>
            <p className="text-[14px] font-normal font-pp py-[20px] text-blue-200 pb-[30px] text-wrap md:whitespace-nowrap">
              Connecting Immigrant and Local Business Owners with{" "}
              <br className="hidden md:block" /> their Customers
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-3 md:gap-[25px] w-full md:mr-20">
            {navigations.map((n, i) => (
              <a
                href={n.link}
                key={i}
                className={cn(
                  "text-[14px] cursor-pointer font-medium font-pp pb-[10px] text-gray-100",
                  "text-gray-100"
                )}
              >
                {n.name}
              </a>
            ))}
          </div>

          <FlexRowStart className="gap-[16px] my-[16px] md:justify-end">
            {socialLinks.map((s, i) => (
              <motion.a
                variants={fadeIn("left", "spring", 0.5, 1)}
                initial="hidden"
                whileInView="show"
                href="#"
                key={i}
                className={`w-[30px] h-[30px] flex items-center justify-center rounded-full bg-blue-200/10`}
              >
                <RenderSocialIcons name={s.name} />
              </motion.a>
            ))}
          </FlexRowStart>
        </div>

        <motion.h5
          variants={fadeIn("bottom", "spring", 0.5, 1)}
          initial="hidden"
          whileInView="show"
          className="text-center text-gray-100 leading-[14px] font-normal text-[12px] font-pp mt-10"
        >
          {new Date().getFullYear()} Bizconnect24. All right reserved
        </motion.h5>
      </footer>
    </div>
  );
};

export default Footer;

function RenderSocialIcons({ name }: { name: string }) {
  let icon = null;
  let defaultStyle = "scale-[.80]";
  switch (name) {
    case "instagram":
      icon = (
        <img
          className={cn("w-[20px]", defaultStyle)}
          src={"/assets/images/logo/ig-logo.svg"}
        />
      );
      break;
    case "facebook":
      icon = (
        <img
          className={cn("w-[14px]", defaultStyle)}
          src={"/assets/images/logo/facebook-logo.svg"}
        />
      );
      break;
    case "twitter":
      icon = (
        <img
          className={cn("w-[20px]", defaultStyle)}
          src={"/assets/images/logo/x-logo.svg"}
        />
      );
      break;
    default:
      icon = null;
  }
  return icon;
}
