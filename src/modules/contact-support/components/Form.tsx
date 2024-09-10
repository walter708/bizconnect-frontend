"use client";
import React from "react";
import ContactSupportSubmitModal from "./SubmitModal";
import { useState } from "react";
import { ContactSupportDataSchema } from "@/types/business";
import { BaseResponseMessage } from "@/types/auth";
import { submitContactRequest } from "@/api/business";
import { useFormik, FormikHelpers } from "formik";
import * as yup from "yup";
import Input from "@/components/ui/input";
import Button from "@components/ui/button";
import { FlexColStart } from "@components/Flex";
import ErrorComponent from "@/components/ErrorComponent";
import { countryCodes } from "@/data/countryCodes";

const validationSchema = yup.object({
  personName: yup
    .string()
    .min(1, "Enter valid Name")
    .required("First Name is required!"),
  email: yup.string().email("Enter valid email").required(),
  phoneNumber: yup
    .string()
    .matches(/^(?:\+?[0-9]\s?){7,15}[0-9]$/, "Invalid phone number")
    .required("Phone number is required"),
  problemDescription: yup
    .string()
    .min(1, "Describe the issue you are having")
    .required("Issue description is required"),
});

const CountryCodeDropdown = ({
  selectedCode,
  handleCodeChange,
}: {
  selectedCode: string;
  handleCodeChange: any;
}) => (
  <select
    value={selectedCode}
    onChange={handleCodeChange}
    className="appearance-none bg-none border-none pr-0 pl-2 text-sm text-gray-700 h-full focus:ring-0 focus-visible:outline-none focus:outline-none "
  >
    {countryCodes.map((country, idx) => (
      <option key={idx} value={country.code}>
        {country.flag} {country.code}
      </option>
    ))}
    <img src="/profile-chev.svg" alt="" />
  </select>
);

export default function ContactSupportForm() {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<String | null>(null);
  const [successMessage, setSuccessMessage] = useState<String | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState(countryCodes[0].code);

  const onSubmit = async (
    values: ContactSupportDataSchema,
    { resetForm }: FormikHelpers<ContactSupportDataSchema>
  ) => {
    setIsLoading(true);
    try {
      const res = await submitContactRequest(values).catch((err) => {
        const errorResponse: BaseResponseMessage = err.response.data;
        // Set error message
        const errorCode = errorResponse?.message.code;
        if (errorCode == 409) {
          setErrorMessage(errorResponse?.message.desc);
        } else {
          setErrorMessage("error occured while login");
        }
        setError(true);
        console.error("The Error that occured is " + err);
        setIsLoading(false);
      });
      const resData: BaseResponseMessage = res?.data;
      setSuccessMessage(resData?.message?.desc);
      resetForm();
      setIsModalOpen(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(true);
      console.error(err);
      setErrorMessage("error occured while login");
    }
  };

  const formik = useFormik({
    initialValues: {
      personName: "",
      email: "",
      phoneNumber: "",
      problemDescription: "",
    },
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema,
  });

  // Function to check if all input fields have values
  const hasAllFieldsFilled = () => {
    return Object.values(formik.values).every((value) => !!value.trim());
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Display Error message */}
      {error && <ErrorComponent value={errorMessage as string} />}
      <form
        className="max-w-7xl mx-auto grid md:grid-cols-2 w-full bg-white-100 md:gap-[68px] rounded-[15px] p-3 md:p-10 lg:pr-[80px]"
        onSubmit={formik.handleSubmit}
      >
        <div className="hidden md:block md:-ml-0">
          <img src="/assets/icons/contact-bg.svg" alt="" />
        </div>
        <FlexColStart className="w-full gap-0 m-0 p-0">
          <ErrorComponent value={formik.errors.personName ?? ""} />

          <Input
            type="text"
            label="Full name"
            name="personName"
            value={formik.values.personName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Name"
            required
          />
          <ErrorComponent
            value={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ""
            }
          />

          <Input
            type="text"
            label="Email address"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Your Email"
            required
          />
          <ErrorComponent
            value={
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? formik.errors.phoneNumber
                : ""
            }
          />

          <Input
            type="text"
            label="Phone number"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Your Phone Number"
            required
            // leftIcon={<img src="/contact-phone.svg" className="ml-3" alt="" /> }
            leftIcon={
              <div className="flex items-center">
                <CountryCodeDropdown
                  selectedCode={selectedCode}
                  handleCodeChange={(e: any) => setSelectedCode(e.target.value)}
                />
                <img src="/profile-chev.svg" alt="" />
              </div>
            }
          />
          <ErrorComponent
            value={
              formik.touched.problemDescription &&
              formik.errors.problemDescription
                ? formik.errors.problemDescription
                : ""
            }
          />

          <FlexColStart className="w-full mb-[24px]">
            <label htmlFor="">
              Message<span className="text-[#F75B4E]">*</span>
            </label>
            <textarea
              name="problemDescription"
              value={formik.values.problemDescription}
              onChange={formik.handleChange}
              rows={5}
              className="w-full px-3 py-2 font-pp font-normal text-[12px] bg-white-100 border  focus-visible:ring-white-100/20  focus:ring-0 focus-visible:outline-none focus:outline-none   border-gray-213 border-input rounded-[5px]"
              placeholder=""
              onBlur={formik.handleBlur}
            />
          </FlexColStart>

          <Button
            type="submit"
            intent="primary"
            size="lg"
            disabled={!hasAllFieldsFilled()}
            isLoading={isLoading}
            className="w-full rounded-[5px] mt-6"
          >
            <span className="font-pp font-medium text-[14px]">
              Submit Request
            </span>
          </Button>
        </FlexColStart>
      </form>

      <ContactSupportSubmitModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        successMessage={successMessage as string}
        errorMessage={errorMessage as string}
      />
    </>
  );
}
