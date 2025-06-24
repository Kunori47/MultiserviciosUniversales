"use client";

import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import Divider from "../../_components/Divider";
import FormField from "../../_components/FormField";

type LoginForm = {
  login: string;
};

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = (formValues: LoginForm) => {
    router.push("/dashboard");
    console.log("Form values", formValues);
  };

  const initialValues: LoginForm = {
    login: ""
  };
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <FormField label="Login" help="Introduzca su cedula de identidad">
          {({ className }) => <Field name="login" className={className} />}
        </FormField>

        <Divider />

        <Buttons>
          <Button type="submit" label="Login" color="info" isGrouped />
        </Buttons>
      </Form>
    </Formik>
  );
}
