"use client";
import { Eye, ClosedEye, Mail } from "@components/icons";
import Button from "@components/ui/button";
import Input from "@/components/ui/input";
import { useFormik } from "formik";
import { LogInData, LogInResponse, TOKEN_NAME, JwtPayload } from "@/types/auth";
import { loginUser } from "@/api/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import {
  FlexColStart,
  FlexColStartCenter,
  FlexRowStart,
} from "@components/Flex";
import ErrorComponent from "../../../components/ErrorComponent";
import withoutAuth from "@/utils/auth-helpers/withoutAuth";
import { useDataCtx } from "@/context/DataCtx";

const validationSchema = yup.object({
  email: yup.string().email("Enter valid email").required(),
  password: yup.string().required("Please Enter your password"),
});

const Login = () => {
  const { setNavbarBgColor } = useDataCtx();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<String | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: LogInData) => {
    setIsLoading(true);
    try {
      const res = await loginUser(values);
      const resData: LogInResponse = res?.data;

      if (resData?.success) {
        const tokenString = resData.data.token.split(" ")[1];
        localStorage.setItem(TOKEN_NAME, tokenString);

        const parsedToken: JwtPayload = tokenString
          ? JSON.parse(atob(tokenString.split(".")[1]))
          : {};

        if (parsedToken.verified) {
          window.location.href = "/?login=true";
        } else {
          router.push("/auth/verify-account");
          window.location.reload();
        }

        setError(false);
      }
    } catch (err: any) {
      const errorResponse: LogInResponse = err.response?.data;
      const errorCode = errorResponse?.message?.code;

      setErrorMessage(
        errorCode === 404 || errorCode === 401
          ? errorResponse?.message?.desc
          : "An error occurred while logging in"
      );
      setError(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setNavbarBgColor({
      parent: "#F6F8FA",
      child: "#fff",
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema,
  });

  return (
    <FlexColStart className="w-full h-full md:h-[80%] px-4 pt-[40px] pb-[150px] bg-blue-203 flex items-center">
      <FlexColStartCenter className="max-w-[609px] mx-auto px-3 md:px-10 pt-[24px] pb-[32px] bg-white-100 text-center rounded-[8px] w-full shadow-lg shadow-gray-103/20">
        <h4 className="text-lg md:text-2xl font-pp font-bold leading-[24px] mb-[24px]">
          Login
        </h4>
        {/* Display Error message */}
        {error && (
          <span className="text-red-100 text-[13px]">{errorMessage}</span>
        )}
        <form className="flex flex-col w-full" onSubmit={formik.handleSubmit}>
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
          <FlexRowStart className="w-full gap-0 -translate-y-2">
            <a
              className="forgot text-[12px] underline font-normal text-blue-200"
              href="/auth/forgot-password/email"
            >
              Forgot password?
            </a>
          </FlexRowStart>

          <Button
            intent={"primary"}
            size={"lg"}
            className="w-full rounded-[6px] mt-5"
            isLoading={isLoading}
            spinnerColor="#000"
            onClick={formik.handleSubmit as any}
          >
            <span className="text-[14px]">Submit</span>
          </Button>
        </form>

        <p className="text-dark-100 text-[14px] font-pp mt-[14px] flex-center gap-3 ">
          Don't have an Account?{" "}
          <a
            href="/auth/signup"
            className="text-blue-200 text-[14px] font-light underline"
          >
            Sign up
          </a>
        </p>
      </FlexColStartCenter>
    </FlexColStart>
  );
};

export default withoutAuth(Login);
