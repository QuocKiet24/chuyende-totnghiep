import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import CommonForm from "@/components/common/form";
import { useLoginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { locale } = useParams();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await dispatch(loginUser(formData));
      if (data.meta.requestStatus === "fulfilled") {
        toast.success("Login successful");
        navigate(`/${locale}/auth/verify-email`);
      } else {
        toast.error(data.payload?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-md px-4 pt-10"
    >
      <Card className="shadow-xl rounded-2xl border border-muted-foreground/10 backdrop-blur-lg bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-900/60 dark:to-slate-800/40">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full text-primary shadow-sm">
              <LockKeyhole className="w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary tracking-tight">
            {t("login.h1")}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {t("login.redirect")}{" "}
            <Link
              to={`/${locale}/auth/register`}
              className="text-primary hover:underline font-medium"
            >
              {t("register.h1")}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CommonForm
            formControls={useLoginFormControls()}
            buttonText={"Sign In"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuthLogin;
