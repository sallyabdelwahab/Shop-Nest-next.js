import { Card, CardDescription, CardHeader, } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react'
import { CategoryI } from '@/app/interfaces/category';


export default async function Brands() {



  const response = await fetch('https://ecommerce.routemisr.com/api/v1/brands', {
    next: {
      revalidate: 10 * 60
    }
  });


  const { data: brands }: { data: CategoryI[] } = await response.json()

  console.log(brands);















  return <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {
        brands.map((brand) =>
          <div key={brand._id} className=" ">



            <Card className=' ' >
              <Link href={`/products?brandId=${brand._id}`}>
                <Image src={brand.image} alt='' className='w-full' width={100} height={100} />
                <CardHeader className=''>

                  <CardDescription className='text-xl text-black  hover:text-fuchsia-700 pt-3 m-auto'>{brand.name}</CardDescription>

                </CardHeader>

                </Link >
                </Card >
                </div> )

      }
  
 </div >

              </>
}

