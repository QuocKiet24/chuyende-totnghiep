import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { formatVnd } from "@/utils/formatVnd";
import { useTranslation } from "react-i18next";

function OrdersAdmin() {
  const { t } = useTranslation();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">
          {t("admin.order.h1")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] sm:w-[120px] px-3 py-2 sm:px-4 sm:py-3">
                ID
              </TableHead>
              <TableHead className="px-3 py-2 sm:px-4 sm:py-3">
                {t("admin.order.date")}
              </TableHead>
              <TableHead className="px-3 py-2 sm:px-4 sm:py-3">
                {t("admin.order.status")}
              </TableHead>
              <TableHead className="px-3 py-2 sm:px-4 sm:py-3">
                {t("admin.order.price")}
              </TableHead>
              <TableHead className="px-3 py-2 sm:px-4 sm:py-3 text-right">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem?._id} className="hover:bg-gray-50/50">
                  <TableCell className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-sm sm:text-base truncate max-w-[100px] sm:max-w-[120px]">
                    {orderItem?._id}
                  </TableCell>
                  <TableCell className="px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base">
                    {new Date(orderItem?.orderDate).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="px-3 py-2 sm:px-4 sm:py-3">
                    <Badge
                      className={`py-1 px-2 sm:px-3 text-xs sm:text-sm ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500 hover:bg-green-600"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base">
                    {formatVnd(orderItem?.totalAmount)}
                  </TableCell>
                  <TableCell className="px-3 py-2 sm:px-4 sm:py-3 text-right">
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        {t("admin.order.view")}
                      </Button>
                      <AdminOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm sm:text-base text-muted-foreground"
                >
                  {t("noorders")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default OrdersAdmin;
