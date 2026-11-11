
"use client";

import { CartResponse } from "@/app/interfaces";
import { getCartAction } from "@/app/actions/storeActions";
import { useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

interface CartContextValue {
  cartData: CartResponse | null;
  setCartData: (value: CartResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  getCart: (options?: { silent?: boolean }) => Promise<void>;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue>({
  cartData: null,
  setCartData: () => {},
  isLoading: false,
  setIsLoading: () => {},
  getCart: async () => {},
  clearCart: () => {},
});

export default function CartContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { status } = useSession();

  const getCart = useCallback(
    async (options: { silent?: boolean } = {}) => {
      if (status !== "authenticated") {
        setCartData(null);
        setIsLoading(false);
        return;
      }

      if (!options.silent) setIsLoading(true);

      try {
        const data = (await getCartAction()) as CartResponse;

        if (data.status !== "success") {
          throw new Error(data.message || "Could not load your cart");
        }

        setCartData(data);

        if (data.data?.cartOwner && typeof window !== "undefined") {
          localStorage.setItem("userId", data.data.cartOwner);
        }
      } catch (error) {
        console.error("Cart request failed:", error);

        if (!options.silent) {
          setCartData(null);
        }
      } finally {
        if (!options.silent) {
          setIsLoading(false);
        }
      }
    },
    [status]
  );

  const clearCart = useCallback(() => {
    setCartData(null);
  }, []);

  useEffect(() => {
    void getCart();
  }, [getCart]);

  return (
    <CartContext.Provider
      value={{
        cartData,
        setCartData,
        isLoading,
        setIsLoading,
        getCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
