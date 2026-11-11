'use client'

import React, { useContext, useState } from 'react'
import { CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { Loader2, ShoppingCartIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { CartContext } from '../Context/CartContext'
import AddToWishList from '../WishList/AddToWishList'

import { useSession } from 'next-auth/react'

import { addCartItemAction } from '@/app/actions/storeActions'
import { useRouter } from 'next/navigation'




export default function AddToCart({ productId }: { productId: string }) {
  const [isloading, setIsLoadind] = useState(false)
  const { getCart } = useContext(CartContext)
 const session=useSession()

  let router=useRouter()




  async function addProductTOcarat() {
   
    if (session.status !== 'authenticated') {
      router.push('/login')
      return
    }

    setIsLoadind(true)
    try {
      const data = await addCartItemAction(productId)
      if (data.status === 'success') {
        // The POST response may contain only product IDs. Fetch the populated cart
        // so the cart page receives complete product details.
        await getCart({ silent: true })
        toast.success(data.message || 'Added to cart')
      } else {
        toast.error(data.message || 'Could not add this product')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoadind(false)
    }
   

  }

  




  return <>

    <CardFooter className='gap-1'>
      <Button disabled={isloading} onClick={addProductTOcarat} className='grow'> {isloading ? <Loader2 className='animate-spin' /> : <ShoppingCartIcon />}   Add TO Cart</Button>

      <AddToWishList productId={productId} />


    </CardFooter>








  </>
}







