import axiosInstance from "./axiosInstance";

/* ==============================
   PUBLIC PRODUCTS
================================ */

export const getAllProducts = () => {
  return axiosInstance.get("/products");
};

export const getProductById = (id) => {
  return axiosInstance.get(`/products/${id}`);
};

/* ==============================
   VENDOR PRODUCTS
================================ */

export const getMyProducts = (token) => {
  return axiosInstance.get("/products/my-products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/* ==============================
   CREATE PRODUCT (FormData)
================================ */

export const createProduct = (formData, token) => {
  return axiosInstance.post("/products", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/* ==============================
   UPDATE PRODUCT (FormData)
================================ */

export const updateProduct = (id, formData, token) => {
  return axiosInstance.put(`/products/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/* ==============================
   DELETE PRODUCT
================================ */

export const deleteProduct = (id, token) => {
  return axiosInstance.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};