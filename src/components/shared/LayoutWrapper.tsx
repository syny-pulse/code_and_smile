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
  // console.log('Current path:', pathname); // Debug log

  // Paths where header and footer should be hidden
  const hideLayoutPaths = ['/admin', '/tutor', '/learner', '/auth'];

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
