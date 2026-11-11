import { ProductI } from '@/app/interfaces';
import { log } from 'console';

import {
  Card,

  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React from 'react'
import Image from 'next/image';
import { Params } from 'next/dist/server/request/params';
import { HeartIcon, ShoppingCartIcon, StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Slider from '@/components/productSlider/Slider';
import AddToCart from '@/components/AddProduct/AddToCart';




export default async function ProdectDetails({params}:{params:Params}) {

let {productId} = await  params;





const response =await fetch('https://ecommerce.routemisr.com/api/v1/products/'+productId);
const {data: product}:{data:ProductI}=await response.json()
console.log(product)








  return <>
  <Card className=' grid grid-cols-3 items-center'>
    <div className=" col-span-1">

<Slider images={product?.images||[]} altContent={product?.title||''}/>





    </div>
 <div className='md:col-span-2 space-y-4 p-4'>
.brand.name
 <CardHeader>
  <CardDescription>{product.brand.name}</CardDescription>
    <CardTitle className='text-2xl' >{product.title}</CardTitle>
    <CardDescription>{product.description}</CardDescription>
   
  </CardHeader>
  <CardContent>
    <CardDescription>{product.category.name}</CardDescription>
   <div className="flex gap-6 items-center justify-between">
 <p className='flex g-1 mt-3'> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-yellow-500">
  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
</svg>
 
 <span>{product.ratingsAverage}</span></p>
    <p className='flex g-1 mt-3'>Remaining:
 <span> {product.ratingsQuantity}</span></p>



   </div>
   <div className="flex gap-6 items-center mt-3 justify-between">

    <p className='flex g-2 '>Quantity:
 <span> {product.quantity}</span></p>
 <p className='flex g-1 items-center '> EGP
 
 <span className='text-xl font-semibold'>{product.price}</span></p>


   </div>
  </CardContent>

<AddToCart productId={product._id}/>








 </div>
</Card>
  
  
  
  
  
  
  
  
  
  
  
  
  
  </>
}
