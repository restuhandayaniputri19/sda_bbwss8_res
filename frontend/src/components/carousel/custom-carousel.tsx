import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from ".";

import Autoplay from "embla-carousel-autoplay";
import React from "react";

interface CustomCarouselProps {
  items: React.ReactNode[];
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({ items }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="relative overflow-hidden" // Ensures the container is positioned relative
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index}>{item}</CarouselItem>
        ))}
      </CarouselContent>
      {/* Position buttons absolutely within the CarouselContent */}
      <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
      <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
      {/* Lengkungan bawah banner */}
<div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
  <svg
    viewBox="0 0 1440 60"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    className="w-full h-[60px]"
  >
    <path
      d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z"
      fill="white"
    />
  </svg>
</div>
    </Carousel>
  );
};

export default CustomCarousel;
