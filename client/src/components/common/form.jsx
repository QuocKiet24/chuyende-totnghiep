import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isLoading,
}) => {
  const renderInputsByComponentType = (getControlItem) => {
    const value = formData[getControlItem.name] || "";

    // MULTILANG CASE
    if (getControlItem.isMultilang) {
      return (
        <div className="flex flex-col gap-4">
          {getControlItem.langs.map((lang) => (
            <div className="flex-1" key={lang}>
              <Label className="text-xs text-muted-foreground capitalize">
                {lang}
              </Label>
              <Input
                name={`${getControlItem.name}.${lang}`}
                placeholder={`${getControlItem.placeholder} (${lang})`}
                value={value?.[lang] || ""}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: {
                      ...(formData[getControlItem.name] || {}),
                      [lang]: event.target.value,
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      );
    }

    // DEFAULT INPUTS
    switch (getControlItem.componentType) {
      case "input":
        return (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
      case "textarea":
        return (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
      case "select":
        return (
          <Select
            onValueChange={(val) =>
              setFormData({
                ...formData,
                [getControlItem.name]: val,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options?.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <form className="p-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-5 w-full">
        {isLoading ? "Loading..." : buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
