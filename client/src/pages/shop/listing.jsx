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
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";

// Utils
const createSearchParams = (filterParams) => {
  return Object.entries(filterParams)
    .filter(([_, value]) => Array.isArray(value) && value.length > 0)
    .map(([key, value]) => `${key}=${encodeURIComponent(value.join(","))}`)
    .join("&");
};

const ShoppingListing = () => {
  // Hooks
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { productList } = useSelector((state) => state.shopProducts);

  // State
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");

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

  // Effects
  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    setFilters(savedFilters);
  }, []);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const queryString = createSearchParams(filters);
      setSearchParams(new URLSearchParams(queryString));
    } else {
      setSearchParams({});
    }
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">{t("all_products")}</h2>

          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              {productList?.length} {t("products")}
            </span>

            <SortDropdown sort={sort} onSortChange={handleSort} t={t} />
          </div>
        </div>

        <ProductList products={productList} />
      </div>
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

const ProductList = ({ products }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
    {products?.length > 0
      ? products.map((product) => (
          <ProductGrid key={product._id} product={product} />
        ))
      : null}
  </div>
);

export default ShoppingListing;
