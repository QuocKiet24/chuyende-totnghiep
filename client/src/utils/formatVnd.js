export const formatVnd = (value) => {
  if (typeof value !== "number") return "";
  return value.toLocaleString("vi-VN") + "đ";
};
