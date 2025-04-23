import { Input } from "@/components/ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import ProductDetailsDialog from "./product-details";
import ProductGrid from "@/components/shopping/productgrid";
import { useTranslation } from "react-i18next";

const SearchProduct = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const timeoutRef = useRef(null);

  // Selectors
  const { searchResults, isLoading, error } = useSelector(
    (state) => state.shopSearch
  );
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  // Debounced search effect
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (keyword.trim().length > 0) {
      timeoutRef.current = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 500); // Reduced debounce time
    } else {
      setSearchParams(new URLSearchParams());
      dispatch(resetSearchResults());
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [keyword, dispatch, setSearchParams]);

  // Handle add to cart with memoization
  const handleAddtoCart = useCallback(
    (getCurrentProductId, getTotalStock) => {
      const existingItem = cartItems.items?.find(
        (item) => item.productId === getCurrentProductId
      );

      if (existingItem && existingItem.quantity + 1 > getTotalStock) {
        toast.error(
          `Only ${existingItem.quantity} quantity can be added for this item`
        );
        return;
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
          toast.success("Product added to cart");
        }
      });
    },
    [dispatch, user?._id, cartItems.items]
  );

  // Handle product details with memoization
  const handleGetProductDetails = useCallback(
    (getCurrentProductId) => {
      dispatch(fetchProductDetails(getCurrentProductId));
    },
    [dispatch]
  );

  // Open details dialog when product details are loaded
  useEffect(() => {
    if (productDetails) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Search Input */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-2xl">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="py-6 text-lg"
            placeholder={t("search.placeholder")}
            aria-label="Search products"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-700">
              Failed to load search results: {error}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && searchResults?.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {t("search.ptag")}
          </h3>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && searchResults?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <ProductGrid
              key={product._id}
              handleAddtoCart={handleAddtoCart}
              product={product}
              handleGetProductDetails={handleGetProductDetails}
            />
          ))}
        </div>
      )}

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddtoCart={handleAddtoCart}
      />
    </div>
  );
};

export default React.memo(SearchProduct);
