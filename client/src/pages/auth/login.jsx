import CommonForm from "@/components/common/form";
import { useLoginFormControls } from "@/config";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialState);

  const onSubmit = () => {};

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("login.h1")}
        </h1>
        <p className="mt-2">
          {t("login.redirect")}
          <Link
            className="font-medium ml-2 text-blue-500 hover:underline"
            to="/auth/register"
          >
            {t("register.h1")}
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={useLoginFormControls()}
        buttonText={t("login.h1")}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthLogin;
