"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { checkoutOrderAction } from "@/app/actions/storeActions";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

export default function Checkout({ cartId }: { cartId: string }) {
  const detailsInput = useRef<HTMLInputElement | null>(null);
  const cityInput = useRef<HTMLInputElement | null>(null);
  const phoneInput = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState<"cash" | "visa" | null>(null);

  function getShippingAddress() {
    const details = detailsInput.current?.value.trim();
    const city = cityInput.current?.value.trim();
    const phone = phoneInput.current?.value.trim();
    if (!details || !city || !phone) {
      toast.error("Please complete your shipping address");
      return null;
    }
    return { details, city, phone };
  }

  async function checkoutSession(payment: "cash" | "visa") {
    const shippingAddress = getShippingAddress();
    if (!shippingAddress) return;

    setLoading(payment);
    try {
      const data = await checkoutOrderAction(cartId, shippingAddress, payment, window.location.origin);
      if (data.status !== "success") {
        throw new Error(data.message || "Checkout could not be completed");
      }

      if (payment === "visa" && data.session?.url) {
        window.location.href = data.session.url;
      } else {
        toast.success("Your order has been placed successfully");
        window.location.href = "/allorders";
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full bg-violet-700 text-white hover:bg-violet-800">Proceed to checkout</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shipping address</DialogTitle>
          <DialogDescription>Please enter the address for your order.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2"><Label htmlFor="city">City</Label><Input ref={cityInput} id="city" placeholder="Your city" /></div>
          <div className="grid gap-2"><Label htmlFor="details">Address details</Label><Input ref={detailsInput} id="details" placeholder="Street, building, apartment" /></div>
          <div className="grid gap-2"><Label htmlFor="phone">Phone</Label><Input ref={phoneInput} id="phone" type="tel" placeholder="Phone number" /></div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
          <Button type="button" variant="outline" disabled={loading !== null} onClick={() => checkoutSession("cash")}>{loading === "cash" && <Loader2 className="size-4 animate-spin" />} Cash</Button>
          <Button type="button" disabled={loading !== null} onClick={() => checkoutSession("visa")}>{loading === "visa" && <Loader2 className="size-4 animate-spin" />} Visa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
