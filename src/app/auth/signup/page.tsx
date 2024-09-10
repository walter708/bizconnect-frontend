"use client";
import { Mail, ClosedEye, Eye, CircleUser } from "@components/icons";
import Input from "@/components/ui/input";
import { useFormik } from "formik";
import {
  SignUpResponse,
  SignUpData,
  TOKEN_NAME,
  LogInResponse,
} from "@/types/auth";
import { registerUser } from "@/api/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import {
  FlexColStart,
  FlexColStartCenter,
  FlexRowCenterBtw,
} from "@components/Flex";
import Button from "@components/ui/button";
import ErrorComponent from "@/components/ErrorComponent";
import withoutAuth from "@/utils/auth-helpers/withoutAuth";
import Link from "next/link";
import { useDataCtx } from "@/context/DataCtx";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  firstName: yup
    .string()
    .min(1, "Enter valid First Name")
    .required("First Name is required!"),
  lastName: yup
    .string()
    .min(1, "Enter valid Last Name")
    .required("Last Name is required!"),
  email: yup.string().email("Enter valid email").required(),
  password: yup.string().required("Please Enter your password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const Signup = () => {
  const { setNavbarBgColor } = useDataCtx();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    setShowConirmPassword(false);
    setNavbarBgColor({
      parent: "#f4f9ff",
      child: "#fff",
    });
  }, []);

  const onSubmit = async (values: SignUpData) => {
    if (!termsAccepted) {
      toast.error("Accept the Terms and Conditions to continue.");
      return;
    }

    const { confirmPassword, ...data } = values;
    setIsLoading(true);
    try {
      const res = await registerUser(data);
      const resData: SignUpResponse = res?.data;

      if (resData?.success) {
        localStorage.setItem(TOKEN_NAME, resData.data.token.split(" ")[1]);
        router.push("/auth/verify-account");
        window.location.reload();
      } else {
        setError(true);
        setErrorMessage("Error occurred while signing up");
      }
    } catch (err: any) {
      const errorResponse: LogInResponse = err.response?.data;
      const errorCode = errorResponse?.message.code;
      if (errorCode === 409) {
        setErrorMessage(
          `User with email ${data.email} already exists, please login.`
        );
      } else {
        setErrorMessage("Error occurred while signing up");
      }
      setError(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema,
  });

  return (
    <FlexColStart className="w-full h-full bg-blue-203 pt-[40px] px-3 pb-[150px] flex items-center">
      <FlexColStartCenter className="max-w-[609px] mx-auto text-center bg-white-100 rounded-[8px] pt-[24px] px-3 pb-[23px] md:px-10 drop-shadow-xl">
        <h4 className="text-lg md:text-2xl text-center font-bold font-pp leading-[24px] mb-[24px] text-blue-200">
          Create An Account
        </h4>

        {/* Display Error message */}
        {error && (
          <span className="text-red-100 text-[13px]">{errorMessage}</span>
        )}

        <form className="flex flex-col" onSubmit={formik.handleSubmit}>
          <ErrorComponent
            value={
              formik.touched.firstName && formik.errors.firstName
                ? formik.errors.firstName
                : ""
            }
          />
          <Input
            type="text"
            label="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            rightIcon={
              <CircleUser
                width={"24px"}
                height={"24px"}
                className="stroke-none mt-1 fill-blue-200"
              />
            }
            onBlur={formik.handleBlur}
            required
            placeholder="Enter First Name"
            parentClassname="w-full px-0 border border-white-400/50 px-4"
            inputClassname="w-full px-3 outline-none border-none"
          />
          <ErrorComponent
            value={
              formik.touched.lastName && formik.errors.lastName
                ? formik.errors.lastName
                : ""
            }
          />
          <Input
            type="text"
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rightIcon={
              <CircleUser
                width={"24px"}
                height={"24px"}
                className="stroke-none fill-blue-200 mt-1"
              />
            }
            required
            placeholder="Enter Last Name"
            parentClassname="w-full px-0 border border-white-400/50 px-4"
            inputClassname="w-full px-3 outline-none border-none"
          />
          <ErrorComponent
            value={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ""
            }
          />

          <Input
            type="email"
            label="Email Address"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            rightIcon={
              <Mail
                strokeWidth={1}
                size={20}
                className="rounded-full stroke-white-100 fill-blue-200"
              />
            }
            placeholder="Enter Email Address"
            parentClassname="w-full px-0 border border-white-400/50 px-4"
            inputClassname="w-full px-3 outline-none border-none"
          />
          <ErrorComponent
            value={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ""
            }
          />
          <Input
            type={!showPassword ? "password" : "text"}
            label="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            rightIcon={
              showPassword ? (
                <Eye
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  size={20}
                />
              ) : (
                <ClosedEye
                  onClick={() => setShowPassword(!showPassword)}
                  size={20}
                  className="cursor-pointer"
                />
              )
            }
            placeholder="Enter Password"
            parentClassname="w-full px-0 border border-white-400/50 px-4"
            inputClassname="w-full px-3 outline-none border-none"
          />

          <ErrorComponent
            value={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : ""
            }
          />

          <Input
            type={!showConfirmPassword ? "password" : "text"}
            label="Confirm Password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            rightIcon={
              showConfirmPassword ? (
                <Eye
                  className="cursor-pointer"
                  onClick={() => setShowConirmPassword(!showConfirmPassword)}
                  size={20}
                />
              ) : (
                <ClosedEye
                  onClick={() => setShowConirmPassword(!showConfirmPassword)}
                  size={20}
                  className="cursor-pointer"
                />
              )
            }
            placeholder="Enter Password"
            parentClassname="w-full px-0 border border-white-400/50 px-4"
            inputClassname="w-full px-3 outline-none border-none"
          />

          <FlexRowCenterBtw className="w-full mb-[14px]">
            {/*  */}
            <label className="checkbox-container">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span className="checkbox-checkmark"></span>
            </label>
            <p className="font-pp font-normal text-blue-200 text-[12px] leading-[17px] text-start">
              By clicking Sign Up you agree to our{" "}
              <a
                target="_blank"
                href="/docs/BizConnect24-Terms-of-Agreement.pdf"
                className="text-teal-100 cursor-pointer under"
              >
                Terms and Conditions
              </a>{" "}
              and that you have <br className="hidden md:block" /> read our{" "}
              <a
                target="_blank"
                href="/docs/BizConnect24-Terms-of-Agreement.pdf" // pointing to the public dir
                className="text-teal-100 no-underline cursor-pointer"
              >
                Privacy Policy
              </a>
            </p>
          </FlexRowCenterBtw>

          <Button
            intent={"primary"}
            size={"lg"}
            className="w-full rounded-sm"
            isLoading={isLoading}
            spinnerColor="#000"
            onClick={formik.handleSubmit as any}
          >
            <span className="text-[14px] font-pp">Submit</span>
          </Button>
        </form>

        <p className="text-red-700 font-medium leading-[19.6px] text-[14px] font-pp mt-[4px] ">
          Have an Account?{" "}
          <Link href="/auth/login">
            <span className="text-blue-200 font-normal leading-[19.6px]">
              Sign in
            </span>
          </Link>
        </p>
      </FlexColStartCenter>
    </FlexColStart>
  );
};

export default withoutAuth(Signup);
