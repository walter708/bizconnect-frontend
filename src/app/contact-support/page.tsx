import ContactSupportForm from "@/modules/contact-support/components/Form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Support",
};

const ContactSupport = () => {
  return (
    <div className="w-full px-[16px] bg-blue-204 md:pb-[311px] pb-[350px]">
      <div
        className={`max-w-7xl mx-auto flex flex-row items-center justify-center px-3`}
      >
        <div className="flex flex-col items-center mt-[60px] md:mt-[104px] mb-[25px] md:mb-[30px] gap-[5px] md:gap-[10px] ">
          <header className="bg-brand-green-shade100 text-dark-501 text-[13px] md:text-base font-medium leading-6 py-[10px] rounded-3xl px-4 w-max">
            SUPPORT
          </header>
          <p
            className={`text-center mt-2 text-blue-200 text-[25px] font-extrabold md:text-[45px] leading-[38px] md:leading-[80px]`}
          >
            We’d Love To Help
          </p>
          <p className="text-center text-gray-100 text-[15px] md:text-[20px] leading-[23px] md:leading-[40px] font-medium">
            Reach out to us and we will get in touch within 24 hours
          </p>
        </div>
      </div>

      <ContactSupportForm />
    </div>
  );
};

export default ContactSupport;
