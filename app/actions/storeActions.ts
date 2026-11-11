"use server";

import { getUserToken } from "@/lib/Helpers/getUserToken";

const API_BASE = "https://ecommerce.routemisr.com/api/v1";

async function requestApi(path: string, init: RequestInit = {}) {
  const token = await getUserToken();
  if (!token) return { status: "fail", message: "Your session expired. Please sign in again." };

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        ...(init.headers || {}),
        token,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok && !data.status) {
      return { status: "fail", message: data.message || "The request could not be completed." };
    }
    return data;
  } catch (error) {
    console.error(`ShopNest API request failed (${path}):`, error);
    return { status: "fail", message: "A network error occurred. Please try again." };
  }
}

export async function getCartAction() {
  return requestApi("/cart", { method: "GET" });
}

export async function addCartItemAction(productId: string) {
  return requestApi("/cart", { method: "POST", body: JSON.stringify({ productId }) });
}

export async function updateCartItemAction(productId: string, count: number) {
  return requestApi(`/cart/${productId}`, { method: "PUT", body: JSON.stringify({ count }) });
}

export async function removeCartItemAction(productId: string) {
  return requestApi(`/cart/${productId}`, { method: "DELETE" });
}

export async function clearCartAction() {
  return requestApi("/cart", { method: "DELETE" });
}

export async function getWishlistAction() {
  return requestApi("/wishlist", { method: "GET" });
}

export async function addWishlistItemAction(productId: string) {
  return requestApi("/wishlist", { method: "POST", body: JSON.stringify({ productId }) });
}

export async function removeWishlistItemAction(productId: string) {
  return requestApi(`/wishlist/${productId}`, { method: "DELETE" });
}

export async function checkoutOrderAction(
  cartId: string,
  shippingAddress: { details: string; city: string; phone: string },
  payment: "cash" | "visa",
  siteUrl: string
) {
  const path = payment === "visa"
    ? `/orders/checkout-session/${cartId}?url=${encodeURIComponent(siteUrl)}`
    : `/orders/${cartId}`;
  return requestApi(path, { method: "POST", body: JSON.stringify({ shippingAddress }) });
}
