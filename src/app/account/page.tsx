"use client";
import { Eye, ClosedEye, Mail, CircleUser } from "@components/icons";
import Input from "@/components/ui/input";
import Button from "@components/ui/button";
import { useFormik } from "formik";
import { SignUpData, BaseResponseMessage } from "@/types/auth";
import { updateUserDetails } from "@/api/auth";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useAuth } from "@hooks/useAuth";
import { LoaderComponent } from "@components/Loader";
import { FlexColCenter } from "@/components/Flex";
import withAuth from "@/utils/auth-helpers/withAuth";
import ContactSupportSubmitModal from "@/modules/contact-support/components/SubmitModal";

const validationSchema = yup.object({
  firstName: yup
    .string()
    .min(1, "Enter valid First Name")
    .required("First Name is required!"),
  lastName: yup
    .string()
    .min(1, "Enter valid Last Name")
    .required("Last Name is required!"),
  password: yup.string(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const MyAccount = () => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState(false);
  const { loading, userDetails } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<String | null>(null);

  useEffect(() => {
    if (!loading && userDetails) {
      formik.setFieldValue("firstName", userDetails.firstName);
      formik.setFieldValue("lastName", userDetails.lastName);
      formik.setFieldValue("email", userDetails.email);
    }
  }, [loading, userDetails]);

  const onSubmit = async (values: SignUpData) => {
    const { confirmPassword, email, ...data } = values;
    setIsLoading(true);

    let updateProfile = false;
    setSuccess(false);
    setError(false);
    const password = values.password as string;
    const confPass = values.confirmPassword as string;

    if (password.length == 0 && confPass.length == 0) {
      updateProfile = true;
    }

    if ((password.length > 0 || confPass.length > 0) && password === confPass) {
      updateProfile = true;
    }

    if (updateProfile) {
      try {
        const res: BaseResponseMessage = (await updateUserDetails(data)).data;
        if (res.success) {
          setSuccess(true);
          setIsModalOpen(true);
          setSuccessMessage(res?.message?.desc);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setError(true);
          setErrorMessage("error occured while updating profile");
        }
      } catch (err) {
        setIsLoading(false);
        setError(true);
        console.error(err);
        setErrorMessage("error occured while updating profile");
      }
    } else {
      setIsLoading(false);
      setError(true);
      setErrorMessage("password doesn't match");
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

  // Custom Styles
  const errorMessageStyle = {
    color: "red",
    display: "flex",
    fontSize: "13px",
  };

  const submitErrorMessageStyle = {
    color: "red",
    fontSize: "13px",
  };

  const successMessageStyle = {
    color: "green",
    fontSize: "13px",
  };

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <FlexColCenter className="w-full bg-blue-205 pb-64">
      <div className="xl:mx-auto max-w-7xl w-full mx-3 hidden md:block">
        <h4 className="text-center md:text-start font-bold text-lg md:text-[30px] leading-6 md:leading-0 mt-[49px] mb-[34px] text-blue-200">
          {!state ? "My Account" : ""}
        </h4>
      </div>
      <div className="xl:mx-auto max-w-7xl w-full mt-[31px] md:mt-[0]">
        {/* {state && ()} */}
        <div
          className={`${
            !state
              ? "grid md:grid-cols-2"
              : "flex items-center justify-center mx-auto max-w-[609px]"
          }  gap-[15px] px-5 md:px-0 md:y-9 rounded-[8px]`}
        >
          {/* Display Error message */}
          {error && <span style={submitErrorMessageStyle}>{errorMessage}</span>}

          {/* Display Success message */}

          <form
            onSubmit={formik.handleSubmit}
            className={`flex flex-col w-full bg-white-100 p-3 rounded-[8px] ${
              !state
                ? "md:pl-[54px]  lg:pr-20 md:pt-6 md:mb-[34px]"
                : "md:px-10"
            }`}
          >
            {success && (
              <span style={successMessageStyle}>
                Successfully Updated your Profile
              </span>
            )}
            {!state && (
              <>
                <h4 className="md:hidden text-center font-bold text-lg leading-6 text-blue-200 my-6">
                  {!state ? "My Account" : "Change password"}
                </h4>

                <h4 className="mb-6 font-semibold text-[15px] leading-0  text-blue-200">
                  Personal Details
                </h4>
                <span style={errorMessageStyle}>
                  {formik.touched.firstName && formik.errors.firstName
                    ? formik.errors.firstName
                    : ""}
                </span>
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
                      className="stroke-none mt-1"
                    />
                  }
                  onBlur={formik.handleBlur}
                  placeholder="Enter First Name"
                  parentClassname="w-full px-0 border border-white-400/50 px-4"
                  inputClassname="w-full px-3 outline-none border-none"
                />

                <span style={errorMessageStyle}>
                  {formik.touched.lastName && formik.errors.lastName
                    ? formik.errors.lastName
                    : ""}
                </span>
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
                      className="stroke-none mt-1"
                    />
                  }
                  placeholder="Enter Last Name"
                  parentClassname="w-full px-0 border border-white-400/50 px-4"
                  inputClassname="w-full px-3 outline-none border-none"
                />
                <Input
                  type="email"
                  label="Email Address"
                  name="email"
                  disabled={true}
                  value={formik.values.email}
                  rightIcon={
                    <Mail
                      strokeWidth={1}
                      className="rounded-full stroke-white-100 fill-blue-200"
                    />
                  }
                  placeholder="Enter Email Address"
                  parentClassname="w-full px-0 border border-white-400/50 px-4"
                  inputClassname="w-full px-3 outline-none border-none"
                />
                <span style={errorMessageStyle}>
                  {formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : ""}
                </span>
                {/* <FlexRowStartBtw className="w-full">
              <p className="text-[14px] font-normal text-dark-100/60">
                Password
              </p>
              <a
                href="/auth/forgot-password/email"
                className="text-[12px] font-semibold text-dark-100/60 underline"
              >
                Reset Password
              </a>
            </FlexRowStartBtw> */}

                <div className="mt-4 w-full">
                  <Button
                    type="button"
                    intent="primary"
                    size="lg"
                    onClick={() => setState(true)}
                    className="w-full font-semibold text-[14px]"
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            )}
            {state && (
              <>
                <h4 className="text-center font-bold text-lg md:text-[30px] leading-6 md:leading-0 mt-[24px] mb-[36px] text-blue-200">
                  {" "}
                  Change password
                </h4>

                <Input
                  type={!showPassword ? "password" : "text"}
                  name="password"
                  label="Old Password"
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
                <Input
                  type={!showPassword ? "password" : "text"}
                  name="password"
                  label="New Password"
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

                <span style={errorMessageStyle}>
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? formik.errors.confirmPassword
                    : ""}
                </span>
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
                        onClick={() =>
                          setShowConirmPassword(!showConfirmPassword)
                        }
                        className="cursor-pointer"
                        size={20}
                      />
                    ) : (
                      <ClosedEye
                        onClick={() =>
                          setShowConirmPassword(!showConfirmPassword)
                        }
                        className="cursor-pointer"
                        size={20}
                      />
                    )
                  }
                  placeholder="Enter Password"
                  parentClassname="w-full px-0 border border-white-400/50 px-4"
                  inputClassname="w-full px-3 outline-none border-none"
                />

                <div className={`${state && "mb-[34px]"} mt-4 w-full`}>
                  <Button
                    type="submit"
                    intent="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full font-semibold text-[14px]"
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
          </form>

          <div
            className={`${
              state && "hidden"
            } mb-9 bg-white-100 p-3 md:pl-[54px] rounded-[8px] pt-6 md:pr-[100px]`}
          >
            <p className="text-[15px] text-blue-200 font-semibold ">Security</p>
            <div className="flex items-center justify-between my-6">
              <div className="flex flex-col items-start">
                <p className="text-[15px] text-dark-501 font-normal bg-white-100 leading-[140%]">
                  password
                </p>
                <p className="text-[13px] text-gray-207 font-normal bg-white-100 mt-2">
                  ************
                </p>
              </div>

              <div>
                <p
                  className="text-[13px] leading-[140%] text-blue-200 font-normal bg-white-100 underline cursor-pointer"
                  onClick={() => setState(true)}
                >
                  Change password
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactSupportSubmitModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        successMessage={successMessage as string}
        errorMessage={errorMessage as string}
      />
    </FlexColCenter>
  );
};

export default withAuth(MyAccount);
