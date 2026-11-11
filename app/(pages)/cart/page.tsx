
'use client'

import { CartResponse } from '@/app/interfaces'
import Loading from '@/app/loading'
import Checkout from '@/components/Checkout/Checkout'
import { CartContext } from '@/components/Context/CartContext'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/Helpers/formatPrice'
import { removeCartItemAction, updateCartItemAction } from '@/app/actions/storeActions'
import { Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'

export default function Cart() {
  const {
    cartData,
    isLoading,
    getCart,
    clearCart: clearCartState,
  } = useContext(CartContext)

  const [removingId, setRemovingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [isClearing, setIsClearing] = useState(false)

  async function removeCartItem(productId: string) {
    setRemovingId(productId)

    try {
      const data = await removeCartItemAction(productId) as CartResponse

      if (data.status !== 'success') {
        throw new Error(data.message || 'Could not remove this product')
      }

      toast.success('Product removed successfully')
      await getCart({ silent: true })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not remove this product. Please try again.'
      )
    } finally {
      setRemovingId(null)
    }
  }

  async function clearCart() {
    const products = cartData?.data?.products ?? []

    if (!products.length) return

    setIsClearing(true)

    try {
      for (const item of products) {
        const productId =
          typeof item.product === 'object' && item.product !== null
            ? item.product._id
            : typeof item.product === 'string'
              ? item.product
              : null

        if (!productId) {
          throw new Error('Could not identify one of the cart products')
        }

        const data = await removeCartItemAction(productId) as CartResponse

        if (data.status !== 'success') {
          throw new Error(data.message || 'Could not clear your cart')
        }
      }

      clearCartState()
      toast.success('Your cart has been cleared')
    } catch (error) {
      await getCart({ silent: true })

      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not clear your cart. Please try again.'
      )
    } finally {
      setIsClearing(false)
    }
  }

  async function updateCartItem(productId: string, count: number) {
    if (count < 1) return

    setUpdatingId(productId)

    try {
      const data = await updateCartItemAction(productId, count) as CartResponse

      if (data.status !== 'success') {
        throw new Error(data.message || 'Could not update the quantity')
      }

      await getCart({ silent: true })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not update the quantity. Please try again.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) return <Loading />

  const products = cartData?.data?.products ?? []

  const itemCount = products.reduce(
    (total, item) => total + (item.count || 0),
    0
  )

  if (!products.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-violet-50 text-violet-700">
          <Trash2 size={28} />
        </div>

        <h2 className="mb-2 text-2xl font-semibold">
          Your Cart Is Empty
        </h2>

        <p className="mb-5 text-sm text-slate-500">
          Looks like you haven’t added anything yet.
        </p>

        <Button asChild className="rounded-xl bg-violet-700 hover:bg-violet-800">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shopping Cart
          </h1>

          <p className="mt-1 text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm font-semibold text-violet-700 hover:text-violet-900"
        >
          Continue shopping
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <div className="space-y-4 lg:col-span-2">
          {products.map((item) => {
            const product =
              typeof item.product === 'object' && item.product !== null
                ? item.product
                : null

            const productId = product?._id

            const busy =
              updatingId === productId || removingId === productId

            return (
              <div
                key={item._id}
                className="flex gap-4 rounded-xl border bg-card p-4 shadow-sm"
              >
                <img
                  src={product?.imageCover || '/file.svg'}
                  alt={product?.title || 'Product'}
                  className="size-24 rounded-lg object-cover md:size-28"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-base font-semibold md:text-lg">
                        {product?.title || 'Product details unavailable'}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {product
                          ? `${product.brand?.name || ''} ${product.category?.name || ''}`
                          : ''}
                      </p>
                    </div>

                    <div className="shrink-0 text-right font-semibold">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label="Decrease quantity"
                        disabled={!productId || item.count <= 1 || busy || isClearing}
                        onClick={() =>
                          productId && updateCartItem(productId, item.count - 1)
                        }
                        className="size-8 rounded-lg border hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        −
                      </button>

                      <span className="w-7 text-center font-medium">
                        {updatingId === productId ? (
                          <Loader2 className="mx-auto size-4 animate-spin" />
                        ) : (
                          item.count
                        )}
                      </span>

                      <button
                        aria-label="Increase quantity"
                        disabled={!productId || busy || isClearing}
                        onClick={() =>
                          productId && updateCartItem(productId, item.count + 1)
                        }
                        className="size-8 rounded-lg border hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => productId && removeCartItem(productId)}
                      aria-label="Remove product"
                      disabled={!productId || busy || isClearing}
                      className="flex items-center gap-1 text-sm text-destructive hover:underline disabled:opacity-50"
                    >
                      {removingId === productId && (
                        <Loader2 className="size-3 animate-spin" />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-xl border p-5 shadow-sm">
            <h2 className="text-lg font-semibold">
              Order Summary
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({itemCount} items)
                </span>

                <span className="font-semibold">
                  {formatCurrency(cartData?.data?.totalCartPrice ?? 0)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>

              <div className="border-t pt-3">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-semibold">Total</span>

                  <span className="text-lg font-bold">
                    {formatCurrency(cartData?.data?.totalCartPrice ?? 0)}
                  </span>
                </div>

                <Checkout cartId={cartData?.cartId || ''} />

                <Button
                  asChild
                  variant="outline"
                  className="mt-3 w-full rounded-xl"
                >
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={clearCart}
            disabled={isClearing}
            variant="outline"
            className="mt-3 flex w-full gap-2 text-destructive hover:text-destructive"
          >
            {isClearing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}

            {isClearing ? 'Clearing...' : 'Clear Cart'}
          </Button>
        </aside>
      </div>
    </div>
  )
}

