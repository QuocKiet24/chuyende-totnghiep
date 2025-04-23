import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { filterOptions } from "@/config";
import React, { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ProductFilter = ({ filters, handleFilter, onResetFilters }) => {
  const { t } = useTranslation();

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);
  }, [filters]);

  const isFilterActive = (keyItem, optionId) => {
    return filters?.[keyItem]?.includes(optionId) ?? false;
  };

  return (
    <div className="bg-background rounded-lg shadow-sm sticky top-4">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t("filters")}</h2>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-primary hover:text-primary/80"
          >
            <X className="h-4 w-4 mr-1" />
            {t("reset")} ({activeFilterCount})
          </Button>
        )}
      </div>
      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold mb-2">{t(`${keyItem}`)}</h3>
              <div className="space-y-2">
                {filterOptions[keyItem].map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${keyItem}-${option.id}`}
                      checked={isFilterActive(keyItem, option.id)}
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    <Label
                      htmlFor={`${keyItem}-${option.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {t(`${option.label}`)}
                      {option.count && (
                        <span className="text-muted-foreground ml-1">
                          ({option.count})
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
