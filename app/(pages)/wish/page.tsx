'use client'

import React, { useContext, useState } from 'react'

import { WishResponse } from '@/app/interfaces'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { WishContext } from '@/components/Context/wishContext'
import { removeWishlistItemAction } from '@/app/actions/storeActions'

export default function Wish() {
    const { wishData, getWishList } = useContext(WishContext)
    const [removing, setRemoving] = useState<string | null>(null)

    async function removingWishList(productId: string) {
        setRemoving(productId)
        try {
            const data = await removeWishlistItemAction(productId) as WishResponse
            console.log(data)

            if (data.status === "success") {
                await getWishList();
                toast.success("Product removed successfully");

              
            }
        } catch {
            toast.error('Could not remove this favorite. Please try again.');
        } finally {
            setRemoving(null);
        }
        }
       

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
            <p className="text-muted-foreground mt-1">
                {wishData?.count} Favorites found
            </p>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start mt-6">
                <div className="lg:col-span-2 space-y-4">
                    {wishData?.data?.map((wishItem, index) => (
                        <div
                            key={wishItem._id ?? index}
                            className="flex gap-4 rounded-xl border p-4 shadow-sm bg-card"
                        >
                            <img
                                src={wishItem.imageCover}
                                alt={wishItem.title}
                                className="w-24 h-24 rounded-lg object-cover md:w-28 md:h-28"
                            />

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-base md:text-lg line-clamp-2">
                                            {wishItem.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {wishItem.brand?.name || 'No brand'} •{' '}
                                            {wishItem.category?.name || 'No category'}
                                        </p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <div className="font-semibold">{wishItem.price} EGP</div>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-end">
                                    <button
                                        onClick={() => removingWishList(wishItem._id)}
                                        aria-label="remove"
                                        disabled={removing === wishItem._id}
                                        className="text-destructive hover:underline text-sm cursor-pointer flex gap-1 items-center"
                                    >
                                        {removing === wishItem._id && (
                                            <Loader2 className="animate-spin size-3" />
                                        )}
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
