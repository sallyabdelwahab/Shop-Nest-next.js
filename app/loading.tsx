'use client'
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
     <DotLottieReact
  src="/animations/Running Cat.lottie"
  loop
  autoplay
  style={{ width: 300, height: 300 }}
/>

    </div>
  );
}
