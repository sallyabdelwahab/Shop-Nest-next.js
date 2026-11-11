"use client";

import { WishResponse } from "@/app/interfaces/getWish";
import { getWishlistAction } from "@/app/actions/storeActions";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useCallback, useEffect, useState } from "react";

interface WishContextValue {
  wishData: WishResponse | null;
  setWishData: (value: WishResponse | null) => void;
  wishing: boolean;
  setWishing: (value: boolean) => void;
  getWishList: () => Promise<void>;
}

export const WishContext = createContext<WishContextValue>({
  wishData: null, setWishData: () => {}, wishing: false,
  setWishing: () => {}, getWishList: async () => {},
});

export default function WishContextProvider({ children }: { children: ReactNode }) {
  const [wishData, setWishData] = useState<WishResponse | null>(null);
  const [wishing, setWishing] = useState(true);
  const { status } = useSession();

  const getWishList = useCallback(async () => {
    if (status !== "authenticated") {
      setWishData(null);
      setWishing(false);
      return;
    }

    setWishing(true);
    try {
      const data = (await getWishlistAction()) as WishResponse;
      if (data.status !== "success") {
        throw new Error(data.message || "Could not load your wishlist");
      }
      setWishData(data);
    } catch (error) {
      console.error("Wishlist request failed:", error);
      setWishData(null);
    } finally {
      setWishing(false);
    }
  }, [status]);

  useEffect(() => { void getWishList(); }, [getWishList]);

  return (
    <WishContext.Provider value={{ wishData, setWishData, getWishList, wishing, setWishing }}>
      {children}
    </WishContext.Provider>
  );
}
