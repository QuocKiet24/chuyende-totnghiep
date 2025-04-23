import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDownIcon } from "lucide-react";

// Components
import ProductFilter from "./filter";
import ProductGrid from "@/components/shopping/productgrid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Config & Services
import { sortOptions } from "@/config";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ProductDetailsDialog from "./product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import NoData from "@/components/common/nodata";

// Utils
const createSearchParams = (filterParams) => {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
};

const ShoppingListing = () => {
  // Hooks
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const categorySearchParam = searchParams.get("category");
  // State
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Handlers
  const handleSort = (value) => {
    setSort(value);
  };

  const handleFilter = useCallback((sectionId, optionId) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (!newFilters[sectionId]) {
        newFilters[sectionId] = [optionId];
      } else {
        const optionIndex = newFilters[sectionId].indexOf(optionId);
        if (optionIndex === -1) {
          newFilters[sectionId].push(optionId);
        } else {
          newFilters[sectionId].splice(optionIndex, 1);
          if (newFilters[sectionId].length === 0) {
            delete newFilters[sectionId];
          }
        }
      }

      sessionStorage.setItem("filters", JSON.stringify(newFilters));
      return newFilters;
    });
  }, []);

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Chỉ có thể thêm ${getQuantity} cho sản phẩm này`);

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?._id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?._id));
        toast.success("Đã thêm vào giỏ hàng");
      }
    });
  };

  // Effects
  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParams(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">{t("all_products")}</h2>

          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} {t("products")}
            </span>

            <SortDropdown sort={sort} onSortChange={handleSort} t={t} />
          </div>
        </div>

        <ProductList
          products={productList}
          handleGetProductDetails={handleGetProductDetails}
          handleAddToCart={handleAddToCart}
          t={t}
        />
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        filters={filters}
        sort={sort}
      />
    </div>
  );
};

const SortDropdown = ({ sort, onSortChange, t }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <ArrowUpDownIcon className="size-4" />
        <span>{t("sort_by")}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-[200px]">
      <DropdownMenuRadioGroup value={sort} onValueChange={onSortChange}>
        {sortOptions.map((sortItem) => (
          <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
            {t(sortItem.label)}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

const ProductList = ({
  products,
  handleGetProductDetails,
  handleAddToCart,
  t,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    {products?.length > 0 ? (
      products.map((product) => (
        <ProductGrid
          key={product._id}
          product={product}
          handleGetProductDetails={handleGetProductDetails}
          handleAddToCart={handleAddToCart}
        />
      ))
    ) : (
      <NoData text={t("noproduct")} />
    )}
  </div>
);

export default ShoppingListing;
