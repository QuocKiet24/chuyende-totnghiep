import api from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "/review/addReview",
  async (formdata) => {
    const response = await api.post("/shop/review/add", formdata);
    return response.data;
  }
);

export const getReviews = createAsyncThunk("/review/getReviews", async (id) => {
  const response = await api.get(`/shop/review/${id}`);
  console.log("GET reviews response", response.data); // ✅ log ra dữ liệu
  return response.data;
});

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
