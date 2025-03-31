"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { useSidebar } from "@/components/ui/sidebar";

interface SwipeSidebarProviderProps {
  children: React.ReactNode;
}

export function SwipeSidebarProvider({ children }: SwipeSidebarProviderProps) {
  const { setOpenMobile, isMobile } = useSidebar();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent | TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent | TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchEndX.current - touchStartX.current;
    const isLeftSwipe = distance < -minSwipeDistance;
    const isRightSwipe = distance > minSwipeDistance;

    if (isMobile) {
      if (isRightSwipe) {
        setOpenMobile(true);
      } else if (isLeftSwipe) {
        setOpenMobile(false);
      }
    }

    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    // Add event listeners to document for capturing swipes anywhere on the screen
    if (isMobile) {
      document.addEventListener("touchstart", onTouchStart);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onTouchEnd);

      return () => {
        document.removeEventListener("touchstart", onTouchStart);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
      };
    }
  }, [isMobile]);

  return <>{children}</>;
}
