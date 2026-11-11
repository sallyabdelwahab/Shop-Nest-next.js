'use client'
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
export default function Slider({images,altContent}:{images:string[],altContent:string}) {
  return <>
  
  <Carousel opts={{loop: true}} plugins={[
        Autoplay({
          delay: 1000,
        }),
      ]}>
  <CarouselContent>
    {images.map((img,index)=> <CarouselItem key={index}><Image src={img} alt={altContent} width={700} height={700}/></CarouselItem>)}
   
  </CarouselContent>
  
</Carousel>
  
  
  
  
  
  
  </>
}
