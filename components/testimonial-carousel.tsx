"use client";

import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  name: string;
  role: string;
  image: string;
  content: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <div className="slick-dots-custom">
        <ul className="flex justify-center gap-2 mt-8"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <button className="w-2 h-2 rounded-full bg-muted-foreground/30 hover:bg-primary transition-colors" />
    ),
  };

  return (
    <div className="relative">
      <style>{`
        .slick-dots-custom .slick-active button {
          background: oklch(var(--primary)) !important;
          width: 2rem !important;
        }
      `}</style>

      <Slider ref={sliderRef} {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="px-4">
            <div className="relative p-8 md:p-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/50 to-transparent backdrop-blur-sm">
              <div className="absolute top-6 left-6 text-primary/20">
                <Quote className="w-12 h-12" />
              </div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <blockquote className="text-xl md:text-2xl mb-8 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                <div className="flex items-center justify-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    loading="lazy"
                  />
                  <div className="text-left">
                    <cite className="font-medium not-italic block">{testimonial.name}</cite>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => sliderRef.current?.slickPrev()}
          className="rounded-full"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => sliderRef.current?.slickNext()}
          className="rounded-full"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
