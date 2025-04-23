import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import CommonForm from "@/components/common/form";
import { useRegisterFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
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
import { UserPlus2 } from "lucide-react";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const AuthRegister = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { locale } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      dispatch(registerUser(formData)).then((data) => {
        if (data.meta.requestStatus === "fulfilled") {
          toast.success("Đăng ký thành công");
          navigate(`/${locale}/auth/login`);
        } else {
          toast.error(data.payload?.message || "Register failed");
        }
      });
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
              <UserPlus2 className="w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary tracking-tight">
            {t("register.h1")}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {t("register.redirect")}
            <Link
              to={`/${locale}/auth/login`}
              className="font-medium ml-1 text-primary hover:underline"
            >
              {t("login.h1")}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CommonForm
            formControls={useRegisterFormControls()}
            buttonText={t("register.h1")}
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

export default AuthRegister;
