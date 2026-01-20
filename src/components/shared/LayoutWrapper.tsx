'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/navigation/navbar';
import Footer from '@/components/ui/navigation/footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Paths where header and footer should be hidden
  const hideLayoutPaths = ['/tutor', '/learner/dashboard'];

  const shouldHideLayout = hideLayoutPaths.some((path) =>
    pathname?.startsWith(path)
  );

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main className={`flex-grow ${!shouldHideLayout ? 'pt-20' : ''}`}>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}
