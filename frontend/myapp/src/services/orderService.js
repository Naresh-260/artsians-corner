import axiosInstance from "./axiosInstance";

export const createOrder = (data, token) => {
  return axiosInstance.post("/orders", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMyOrders = (token) => {
  return axiosInstance.get("/orders/my-orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getVendorOrders = (token) => {
  return axiosInstance.get("/orders/vendor-orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateOrderStatus = (orderId, status, token) => {
  return axiosInstance.put(
    `/orders/${orderId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};