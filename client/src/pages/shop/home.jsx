import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ProductGrid from "@/components/shopping/productgrid";
import { useNavigate, useParams } from "react-router-dom";
import ProductDetailsDialog from "./product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { getFeatureImages } from "@/store/common-slice";
import { useTranslation } from "react-i18next";

const categoriesWithIcon = [
  { id: "men", label: "men", icon: ShirtIcon },
  { id: "women", label: "women", icon: CloudLightning },
  { id: "kids", label: "kids", icon: BabyIcon },
  { id: "accessories", label: "accessories", icon: WatchIcon },
  { id: "footwear", label: "footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ShoppingHome = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { locale } = useParams();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { cartItems } = useSelector((state) => state.shopCart);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const handleNavigateToListingPage = (item, section) => {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem("filters", JSON.stringify({ [section]: [item.id] }));
    navigate(`/${locale}/shop/listing`);
  };

  const handleGetProductDetails = (id) => {
    dispatch(fetchProductDetails(id));
  };

  const handleAddToCart = (id, getTotalStock) => {
    if (!user?._id) {
      toast.error("Đăng nhập để thêm giỏ hàng");
      navigate(`/${locale}/auth/login`);
      return;
    }

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === id
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Chỉ còn ${getQuantity} sản phẩm này. quá số lượng tồn kho`
          );

          return;
        }
      }
    }
    dispatch(addToCart({ userId: user._id, productId: id, quantity: 1 })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user._id));
          toast.success("Đã thêm vào giỏ hàng");
        }
      }
    );
  };

  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Slider */}
      <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <div
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute inset-0 transition-opacity duration-1000`}
              >
                <img
                  src={slide?.image}
                  alt={`Slide ${index}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))
          : null}

        {/* Navigation Buttons */}
        {featureImageList.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) =>
                    (prevSlide - 1 + featureImageList.length) %
                    featureImageList.length
                )
              }
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 z-10"
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) => (prevSlide + 1) % featureImageList.length
                )
              }
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 z-10"
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </>
        )}
      </div>
      {/* Categories Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
            {t("homePage.shopbycategory")}
          </h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categoriesWithIcon.map((item) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={item.id}
                className="w-full"
              >
                <Card
                  onClick={() => handleNavigateToListingPage(item, "category")}
                  className="cursor-pointer transition-shadow h-full"
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                    <item.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-4 text-primary" />
                    <span className="text-sm sm:text-base font-medium sm:font-bold text-center">
                      {t(`menuitems.${item.label}`)}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
            {t("homePage.shopbybrand")}
          </h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {brandsWithIcon.map((brand) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={brand.id}
                className="w-full"
              >
                <Card
                  onClick={() => handleNavigateToListingPage(brand, "brand")}
                  className="cursor-pointer transition-shadow h-full"
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                    <brand.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-4 text-primary" />
                    <span className="text-sm sm:text-base font-medium sm:font-bold text-center">
                      {brand.label}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
            {t("homePage.featuredProduct")}
          </h2>
          <motion.div
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {productList.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.03 }}
                className="w-full"
              >
                <ProductGrid
                  product={product}
                  handleAddToCart={handleAddToCart}
                  handleGetProductDetails={handleGetProductDetails}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default ShoppingHome;
