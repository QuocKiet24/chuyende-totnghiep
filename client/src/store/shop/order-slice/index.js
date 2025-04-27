import api from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  redirectUrl: null, // Thêm trường mới cho redirect URL khi COD
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post("/shop/order/create", orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/shop/order/capture", {
        paymentId,
        payerId,
        orderId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const confirmCodOrder = createAsyncThunk(
  "/order/confirmCodOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/shop/order/cod/${orderId}/confirm`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/order/list/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/order/details/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    resetOrderState: (state) => {
      state.approvalURL = null;
      state.orderId = null;
      state.redirectUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Tạo đơn hàng mới
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;

        // Xử lý khác nhau cho PayPal và COD
        if (action.payload.approvalURL) {
          // Trường hợp PayPal
          state.approvalURL = action.payload.approvalURL;
          state.orderId = action.payload.orderId;
        } else {
          // Trường hợp COD
          state.redirectUrl = action.payload.redirectUrl;
          state.orderId = action.payload.orderId;
        }

        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
        state.redirectUrl = null;
      })

      // Xác nhận thanh toán PayPal
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(capturePayment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(capturePayment.rejected, (state) => {
        state.isLoading = false;
      })

      // Xác nhận đơn hàng COD
      .addCase(confirmCodOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmCodOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        // Cập nhật thông tin đơn hàng nếu cần
        if (
          state.orderDetails &&
          state.orderDetails._id === action.payload.data._id
        ) {
          state.orderDetails = action.payload.data;
        }
      })
      .addCase(confirmCodOrder.rejected, (state) => {
        state.isLoading = false;
      })

      // Lấy danh sách đơn hàng
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })

      // Lấy chi tiết đơn hàng
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails, resetOrderState } =
  shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
