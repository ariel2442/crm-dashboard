import { api } from "./client.js";

export async function listProducts() {
  const data = await api.get("products-list");
  return data.products || [];
}

export async function saveProduct(product) {
  const data = await api.post("product-save", product);
  return data.product;
}

export async function deleteProduct(id) {
  return api.post("product-delete", { id });
}
