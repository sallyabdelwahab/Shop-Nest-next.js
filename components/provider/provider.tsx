"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar/Navbar";
import CartContextProvider from "@/components/Context/CartContext";
import WishContextProvider from "@/components/Context/wishContext";
import Footer from "../Footer/Footer";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartContextProvider>
        <WishContextProvider>
          <Navbar />
          <Toaster position="top-right" />
          <div className="mx-auto min-h-[65vh] max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
          <Footer />
        </WishContextProvider>
      </CartContextProvider>
    </SessionProvider>
  );
}
