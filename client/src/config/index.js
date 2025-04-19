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

export const useAddProductFormElements = () => {
  const { t } = useTranslation();

  return [
    {
      label: t("admin.createProduct.titleLabel"),
      name: "title",
      componentType: "input",
      isMultilang: true,
      langs: ["vi", "en"],
      placeholder: t("admin.createProduct.placeholderTitle"),
    },
    {
      label: t("admin.createProduct.descriptionLabel"),
      name: "description",
      componentType: "textarea",
      isMultilang: true,
      langs: ["vi", "en"],
      placeholder: t("admin.createProduct.placeholderDescription"),
    },
    {
      label: t("admin.createProduct.categoryLabel"),
      name: "category",
      componentType: "select",
      options: [
        { id: "men", label: t("admin.createProduct.categoryOptions.men") },
        { id: "women", label: t("admin.createProduct.categoryOptions.women") },
        { id: "kids", label: t("admin.createProduct.categoryOptions.kids") },
        {
          id: "accessories",
          label: t("admin.createProduct.categoryOptions.accessories"),
        },
        {
          id: "footwear",
          label: t("admin.createProduct.categoryOptions.footwear"),
        },
      ],
    },
    {
      label: t("admin.createProduct.brandLabel"),
      name: "brand",
      componentType: "select",
      options: [
        { id: "nike", label: "Nike" },
        { id: "adidas", label: "Adidas" },
        { id: "puma", label: "Puma" },
        { id: "levi", label: "Levi's" },
        { id: "zara", label: "Zara" },
        { id: "h&m", label: "H&M" },
      ],
    },
    {
      label: t("admin.createProduct.priceLabel"),
      name: "price",
      componentType: "input",
      type: "number",
      placeholder: t("admin.createProduct.placeholderPrice"),
    },
    {
      label: t("admin.createProduct.salePriceLabel"),
      name: "salePrice",
      componentType: "input",
      type: "number",
      placeholder: t("admin.createProduct.placeholderSalePrice"),
    },
    {
      label: t("admin.createProduct.stockLabel"),
      name: "totalStock",
      componentType: "input",
      type: "number",
      placeholder: t("admin.createProduct.placeholderStock"),
    },
  ];
};
