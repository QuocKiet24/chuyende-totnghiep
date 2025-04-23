import { logout, sendOTP, verifyEmail } from "@/store/auth-slice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const EmailVerificationPage = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(59);

  const navigate = useNavigate();
  const { locale } = useParams();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);

  const { isLoading } = useSelector((state) => state.auth);

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    const res = await dispatch(verifyEmail(verificationCode));

    if (verifyEmail.fulfilled.match(res)) {
      toast.success("Email verified successfully");
      navigate(`/${locale}/`);
    } else {
      toast.error(res.payload?.message || "Verification failed");

      setCode(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
    }
  };

  const handleSendOtp = async () => {
    try {
      const res = await dispatch(sendOTP()).unwrap();
      toast.success(res);
      setMinutes(1);
      setSeconds(59);
    } catch (err) {
      console.log(err);
      toast.error("Failed to resend OTP");
    }
  };

  const handleLogout = useCallback(() => {
    dispatch(logout());
    toast.success("You have been logged out successfully.");
    navigate(`/${locale}/auth/login`);
  }, [dispatch, navigate, locale]);

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      } else if (minutes > 0) {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, minutes]);

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-background"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("verifyEmail.title")}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {t("verifyEmail.desc")}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-10 h-12 text-center text-xl font-bold"
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={isLoading || code.some((digit) => !digit)}
              className="w-full"
            >
              {t("verifyEmail.buttonText")}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleLogout}
              className="w-full"
            >
              {t("verifyEmail.backButton")}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <p>
                {t("verifyEmail.timeText")}:{" "}
                <span className="font-semibold">
                  {minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </p>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={minutes > 0 || seconds > 0}
                className={`${
                  minutes > 0 || seconds > 0
                    ? "text-muted-foreground cursor-not-allowed"
                    : "text-foreground underline"
                }`}
              >
                {t("verifyEmail.otpBtn")}:{" "}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmailVerificationPage;
