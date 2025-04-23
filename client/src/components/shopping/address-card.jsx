import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const { t } = useTranslation();
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-[4px]"
          : "border-black"
      }`}
    >
      <CardContent className="grid gap-4">
        <Label>
          {t("address.address")}: {addressInfo?.address}
        </Label>
        <Label>{addressInfo?.province}</Label>
        <Label>{addressInfo?.district}</Label>
        <Label>{addressInfo?.ward}</Label>
        <Label>
          {t("address.phone")}: {addressInfo?.phone}
        </Label>
        <Label>
          {t("address.notes")}: {addressInfo?.notes}
        </Label>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>
          {t("address.edit")}
        </Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>
          {t("address.delete")}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
