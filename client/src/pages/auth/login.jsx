import CommonForm from "@/components/common/form";
import { useLoginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error(data.payload?.message || "Login failed");
      }
    });
  };

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
