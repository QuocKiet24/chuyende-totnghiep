import { useTranslation } from "react-i18next";

export const useRegisterFormControls = () => {
  const { t } = useTranslation();

  return [
    {
      name: "userName",
      label: t("register.labelUserName"),
      placeholder: t("register.placeholderUserName"),
      componentType: "input",
      type: "text",
    },
    {
      name: "email",
      label: t("register.labelEmail"),
      placeholder: t("register.placeholderEmail"),
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: t("register.labelPassword"),
      placeholder: t("register.placeholderPassword"),
      componentType: "input",
      type: "password",
    },
  ];
};

export const useLoginFormControls = () => {
  const { t } = useTranslation();

  return [
    {
      name: "email",
      label: t("login.labelEmail"),
      placeholder: t("login.placeholderEmail"),
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: t("login.labelPassword"),
      placeholder: t("login.placeholderPassword"),
      componentType: "input",
      type: "password",
    },
  ];
};
