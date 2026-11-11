"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Heart, Loader2 } from "lucide-react";
import { WishContext } from "../Context/wishContext";
import { Button } from "../ui/button";
import { addWishlistItemAction } from "@/app/actions/storeActions";

export default function AddToWishList({ productId }: { productId: string }) {
  const { getWishList } = useContext(WishContext);
  const { status } = useSession();
  const router = useRouter();
  const [isWished, setIsWished] = useState(false);
  const [isWishing, setIsWishing] = useState(false);

  async function addProductToWishList() {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setIsWishing(true);
    try {
      const data = await addWishlistItemAction(productId);
      if (data.status !== "success") {
        throw new Error(data.message || "Could not update your wishlist");
      }
      setIsWished(true);
      toast.success(data.message || "Added to your favorites");
      await getWishList();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsWishing(false);
    }
  }

  return (
    <Button type="button" onClick={addProductToWishList} disabled={isWishing} aria-label="Add to wishlist">
      {isWishing ? <Loader2 className="size-5 animate-spin" /> : <Heart className={`size-5 ${isWished ? "fill-red-500 text-red-500" : ""}`} />}
    </Button>
  );
}
