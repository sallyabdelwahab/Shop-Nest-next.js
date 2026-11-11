import { ProductI } from '@/app/interfaces/product';
import React from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { HeartIcon, ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import AddToCart from '@/components/AddProduct/AddToCart';

interface ProductsSearchParams {
  categoryId?: string;
  brandId?: string;
}

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}) {
  
  const params = await searchParams;

  const categoryId = params?.categoryId;
  const brandId = params?.brandId;
   
  const url = categoryId
  ? `https://ecommerce.routemisr.com/api/v1/products?category[in]=${categoryId}`
  : brandId
    ? `https://ecommerce.routemisr.com/api/v1/products?brand=${brandId}`
    : 'https://ecommerce.routemisr.com/api/v1/products';

  const response = await fetch(url, {
    next: { revalidate: 10 * 60 }
  });

  const { data: products }: { data: ProductI[] } = await response.json();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {products.map((product) => (
        <Card key={product._id}>
          <Link href={'/products/' + product._id}>
            <Image src={product.imageCover} alt={product.title} className='w-full' width={300} height={300} />
            <CardHeader>
              <CardTitle>{product.title.split(' ', 2).join(' ')}</CardTitle>
              <CardDescription>{product.category.name}</CardDescription>
              <CardAction>{product.brand.name}</CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-yellow-500">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                <p>{product.ratingsAverage}</p>
              </div>
              <p className='pt-2'>Price: <span className='font-bold'>{product.price}</span> EGP</p>
            </CardContent>
          </Link>
          <AddToCart productId={product._id} />
        </Card>
      ))}
    </div>
  );
}
