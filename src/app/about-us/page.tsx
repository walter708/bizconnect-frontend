import { FlexColStartCenter } from "@components/Flex";
import { UpdateNavbarBgColor } from "@/modules/about-us/components/updateNavbarBgColor";

const data = [
  {
    title: "John Doe",
    subtitle: "Co-founder & CEO",
    img: "/assets/images/about-us/dp1.svg",
  },
  {
    title: "John Doe",
    subtitle: "Co-founder & CEO",
    img: "/assets/images/about-us/dp2.svg",
  },
  {
    title: "John Doe",
    subtitle: "Co-founder & CEO",
    img: "/assets/images/about-us/dp3.svg",
  },
  {
    title: "John Doe",
    subtitle: "Co-founder & CEO",
    img: "/assets/images/about-us/dp4.svg",
  },
  {
    title: "John Doe",
    subtitle: "Co-founder & CEO",
    img: "/assets/images/about-us/dp5.svg",
  },
  {
    title: "John Doe",
    subtitle: "Co-founder & CEO",
    img: "/assets/images/about-us/dp6.svg",
  },
];
const AboutUs = () => {
  return (
    <FlexColStartCenter className="w-full gap-1 bg-blue-204 pb-[186px] md:pb-[138px]">
      <UpdateNavbarBgColor />
      <div
        className={
          "max-w-7xl mx-auto flex flex-col items-center justify-center px-3 text-center "
        }
      >
        <div className="flex flex-col items-center mb-7 mt-[60px] md:mt-[97px]  gap-[5px] md:gap-[10px] ">
          <header className="bg-brand-green-shade100 text-dark-501 text-[13px] md:text-base font-medium leading-6 py-[10px] rounded-3xl px-4 w-max">
            ABOUT US
          </header>
          <h2
            className={
              "text-center mt-2 text-blue-200 text-[25px] font-extrabold md:text-[45px] leading-[38px] md:leading-[60px]"
            }
          >
            Discover Our Story: UnVeiling the passion{" "}
            <br className="hidden md:block" /> behind Bizconnect24
          </h2>
        </div>

        <p className="text-gray-100 text-[15px] md:text-[20px] leading-[30px] md:leading-[40px] tracking-[0]">
          At BizConnect24, we are dedicated to empowering small and local
          businesses by bridging the gap between entrepreneurs and their
          customers. Proudly powered by Luminescence Technologies Limited, we
          have established ourselves as the leading platform for connecting
          business owners with the people who matter most—their customers.
          <br className="hidden md:block" />
          Our mission is simple: to provide small business owners with the
          tools, resources, and connections they need to succeed in today’s
          competitive market. Whether you're just starting out or looking to
          take your business to the next level, BizConnect24 is designed to help
          you boost your sales, increase visibility, and grow your customer
          base.
        </p>
        <img
          src="/about-us.svg"
          className="hidden sm:block mt-[55px] mb-[33px] md:mb-[97px]"
          alt=""
        />
        <img
          src="/about-us1.svg"
          className="sm:hidden mt-[55px] mb-[33px] md:mb-[97px]"
          alt=""
        />
      </div>

      <div
        className={
          "max-w-7xl mx-auto flex flex-col items-center justify-center px-3 text-center"
        }
      >
        <div className="flex flex-col font-bold mb-[27px] md:mb-[51px]">
          <h1 className="text-brand-green-shade99 text-[13px] md:text-base leading-[24px]">
            TEAMS
          </h1>
          <h5 className="text-[30px] md:text-[36px] leading-[auto] text-blue-200">
            Meet Our Teams Of <br className="block md:hidden" /> Experts
          </h5>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-[17px]">
          {data?.map((item, i) => (
            <div
              key={item?.title}
              className="flex flex-col items-center justify-between"
            >
              <img
                src={item?.img}
                className={`${(i == 0 || i == 4) && "-mt-2"} bg-cover`}
                alt=""
              />
              <div className="flex flex-col text-dark-501">
                <h2 className="text-[15px] font-normal">{item?.subtitle}</h2>
                <h6 className="text-[25px] font-bold">{item?.title}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FlexColStartCenter>
  );
};

export default AboutUs;
