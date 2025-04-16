import CommonForm from "@/components/common/form";
import { useRegisterFormControls } from "@/config";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const AuthRegister = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialState);

  const onSubmit = () => {};

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("register.h1")}
        </h1>
        <p className="mt-2">
          {t("register.redirect")}
          <Link
            className="font-medium ml-2 text-blue-500 hover:underline"
            to="/auth/login"
          >
            {t("login.h1")}
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={useRegisterFormControls()}
        buttonText={t("register.h1")}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthRegister;
