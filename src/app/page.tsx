import { FlexColCenter, FlexColStart } from "@/components/Flex";
import { CtaArrow } from "@/components/icons";
import Button from "@/components/ui/button";
import SITE_CONFIG from "@/config/site";
import {
  BusinessCard,
  CustomerCard,
  HomeSignupBtn,
  TitleCard,
} from "@/modules/home/components";
import {
  HeaderBusinessBtn,
  HeaderOnboardingComp,
  HeaderSearchComp,
} from "@/modules/home/components/HeaderComp";

const Home = () => {
  return (
    <div className="w-full h-full">
      <header className="w-full px-3 md:px-8 py-4 lg:py-20 bg-blue-203">
        <div className="md:hidden">
          <HeaderSearchComp />
        </div>
        <br />
        <div
          style={{ flex: 1 }}
          className="relative flex flex-1 justify-between gap-3 max-w-7xl mx-auto md:py-14 md:-mt-10"
        >
          <FlexColStart
            style={{ flex: 2.6 }}
            className="flex gap-[10px] !w-[533px]"
          >
            <h1 className="w-full text-[25px] md:text-[45px] font-bold leading-[38px] sm:leading-[54.94px] tracking-normal text-left text-blue-200">
              Connecting Immigrant & Local Business Owners with Their Customers
            </h1>
            <p className="text-[13px] font-medium leading-[36px]  text-left text-gray-103 ">
              Seamlessly do business within your area and on the go
            </p>
            <div className="w-full lg:pr-20 hidden md:block">
              <HeaderSearchComp />
              <HeaderOnboardingComp />
              {/* <HeaderBusinessBtn /> */}
            </div>
          </FlexColStart>

          <div style={{ flex: 3 }} className="hidden md:flex flex-1"></div>
          <div
            style={{ flex: 3 }}
            className="absolute hidden md:flex top-5 -right-[70px]"
          >
            <img
              src="/assets/images/global.svg"
              className="hidden md:block"
              alt=""
            />
          </div>
        </div>

        <div className="md:hidden">
          <HeaderOnboardingComp />

          <HeaderBusinessBtn />
        </div>
      </header>
      <div className="block md:hidden w-full pt-[40px] pb-20 bg-blue-203">
        <img
          src={"/assets/images/world-map.svg"}
          alt="world map"
          className="w-full h-auto"
          style={{ height: "auto", width: "100%" }}
        />
      </div>

      <section className="max-w-7xl mx-auto w-full h-auto md:px-8 py-4 pt-[40px] bg-white-100 ">
        <div className="w-full px-4 pb-[3em]">
          <TitleCard
            className="flex !items-center text-center md:px-[30px]  md:max-w-4xl md:mx-auto"
            title={"FOR BUSINESSES"}
            header={"Unlock Boundless Opportunities"}
            subTitle={
              "We've built a platform to help immigrant & Local businesses showcase their products and services to consumers, addressing the challenges of navigating unfamiliar territories."
            }
          />

          {/* Businesses Card */}
          {/* <FlexColStart className="w-full mt-[20px] gap-[13px] pb-[5em]"> */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3  w-full mt-[20px] gap-[13px] pb-[5em]">
            <BusinessCard
              className={"business-card"}
              icon={
                <img src={"/assets/images/opportunities/visibility-icon.svg"} />
              }
              header={"Increased Visibility"}
              subTitle={
                "With Bizconnect24, immigrant & Local business owners can showcase their products and services to a wider audience"
              }
            />
            <BusinessCard
              className={"business-card"}
              icon={
                <img src={"/assets/images/opportunities/audience-icon.svg"} />
              }
              header={"Access to Targeted Audience"}
              subTitle={
                "Bizconnect24 caters specifically to immigrant & Local communities, allowing business owners to connect with a highly targeted audience that is actively seeking their products or services"
              }
            />
            <BusinessCard
              className={"business-card"}
              icon={
                <img src={"/assets/images/opportunities/growth-icon.svg"} />
              }
              header={"Business Growth"}
              subTitle={
                "With access to a larger customer base and tools to expand their reach, immigrant & Local business owners can experience accelerated growth and increased revenue opportunities."
              }
            />
          </div>

          <div className="block md:hidden w-full mt-5 h-[150px] text-center">
            <TitleCard
              className={
                "title-card  flex items-center text-center md:text-start md:items-start md:px-[30px]  md:max-w-4xl md:mx-auto"
              }
              title={"FOR CUSTOMERS"}
              header={"Discover Businesses"}
              subTitle={
                "Bizconnect24 brings the best of local services to your fingertips, engage with businesses as a customer"
              }
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:order-2 w-full h-auto flex items-center justify-center md:p-5 px-[5px]">
              <img
                style={{ width: "100%", height: "auto" }}
                src={"/assets/images/customer-homebg.jpeg"}
                alt={"customer-homebg"}
              />
            </div>

            {/* Customer Card */}
            {/* <FlexColCenter className="w-full mt-10 gap-[31px]"> */}
            <div>
              <div className="hidden md:block w-full">
                <TitleCard
                  className={
                    "title-card flex !items-start !text-start mb-[25px]"
                  }
                  title={"FOR CUSTOMERS"}
                  header={"Discover Businesses"}
                  subTitle={
                    "Bizconnect24 brings the best of local services to your fingertips, engage with businesses as a customer"
                  }
                />
              </div>

              <div className=" order-2 md:order-1 grid grid-cols-1 w-full gap-10">
                <CustomerCard
                  icon={
                    <img
                      className="w-[60px] mr-3 md:mr-[20px]"
                      src={"/assets/images/opportunities/choice-icon.svg"}
                    />
                  }
                  header={"Choice"}
                  subTitle={
                    "With Bizconnect24, customers have a myriad of options at their fingertips, empowering them to explore diverse businesses and find the perfect fit for their needs and preferences"
                  }
                />

                <CustomerCard
                  icon={
                    <img
                      className="w-[60px] mr-3 md:mr-[20px]"
                      src={"/assets/images/opportunities/convenience-icon.svg"}
                    />
                  }
                  header={"Convenience"}
                  subTitle={
                    "Through the diverse options Bizconnect24 offers, customers are also effortlessly able to discover and engage with immigrant businesses closest to them"
                  }
                />

                <CustomerCard
                  icon={
                    <img
                      className="w-[60px] mr-3 md:mr-[20px]"
                      src={"/assets/images/opportunities/community-icon.svg"}
                    />
                  }
                  header={"Community"}
                  subTitle={
                    "Through Bizconnect24, customers become part of a vibrant and supportive community, connecting with fellow enthusiasts who share a passion for diversity, entrepreneurship, and cultural exchange"
                  }
                />
              </div>
              <div className="w-full flex items-center md:items-start justify-center md:justify-start mt-5">
                <Button
                  intent="primary"
                  href="/search"
                  className="w-full max-w-[400px] flex items-center justify-center  h-[55px] mt-4 rounded-md pt-[10px] pr-[72px] pb-[10px] pl-[62px] gap-[7px] flex-center"
                  hardRefresh={true}
                >
                  <span className="font-medium text-[14px] leading-[14px] text-white-100 ">
                    Explore Businesses
                  </span>
                  <CtaArrow strokeWidth={0.4} className="stroke-white-100" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FlexColCenter
        className="relative w-full py-16 md:py-28 top-0 right-0 bg-[url('/assets/images/join-network-bg.svg')] bg-blue-200"
        style={{
          backgroundImage: `url("/assets/images/join-network-bg.svg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src="/grow-net-md.svg"
          className="block md:hidden absolute right-0 top-0"
          alt=""
        />
        <img
          src="/assets/images/grow-network.svg"
          className="hidden md:block absolute right-0 top-0"
          alt=""
        />
        <img
          src="/assets/images/grow-network2.svg"
          className="absolute hidden sm:block left-0 bottom-0"
          alt=""
        />
        <FlexColCenter className="w-full px-8 pb-[20px] text-center gap-[18px] max-w-4xl mx-auto">
          <h1 className="text-[30px] md:text-[40px] text-white-100 text-center font-bold leading-[36.63px] md:leading-[54.94px] ">
            Join Our Growing Network
          </h1>
          <p className="text-[15px] md:text-base leading-[25px] font-normal text-white-100 ">
            Join immigrant entrepreneurs leveraging BizConnect24 to unlock your
            business growth. Sign up now for greater visibility and experience
            record breaking earnings
          </p>
        </FlexColCenter>
        <div className="flex items-center gap-3 flex-col md:flex-row py-4">
          <HomeSignupBtn />
          <div className="flex items-center justify-start">
            <Button
              intent="primary"
              href="/search?cn=Canada"
              className="px-[70px] md:px-10 py-[15.5px] rounded-md border-[1px] border-white-100 "
              rightIcon={
                <CtaArrow strokeWidth={0.4} className="stroke-white-100" />
              }
              hardRefresh={true}
            >
              <span className="font-hnM font-bold text-[15.5px] leading-[14px] text-left text-white-100 ">
                Explore Businesses
              </span>
            </Button>
          </div>
        </div>
      </FlexColCenter>
    </div>
  );
};

export default Home;
