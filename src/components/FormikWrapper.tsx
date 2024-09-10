import React, { isValidElement, ReactNode, useEffect } from "react";
import {
  Formik,
  Form,
  FormikHelpers,
  type FormikProps,
  useFormikContext,
} from "formik";
import { cn } from "@/lib/utils";

interface FormikWrapperProps<T> {
  initialValues: T;
  validationSchema: any;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<any>;
  children: ReactNode | ((formikProps: FormikProps<T>) => ReactNode);
  externalValues?: T;
}

function FormValueUpdater<T>({ values }: { values: T }) {
  const { setValues } = useFormikContext<T>();

  useEffect(() => {
    setValues(values);
  }, [values, setValues]);

  return null;
}

const FormikWrapper = <T extends object>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  externalValues,
}: FormikWrapperProps<T>) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<T>) => (
        <Form>
          {externalValues && <FormValueUpdater values={externalValues} />}
          {typeof children === "function" ? children(formikProps) : children}
        </Form>
      )}
    </Formik>
  );
};

export default FormikWrapper;
