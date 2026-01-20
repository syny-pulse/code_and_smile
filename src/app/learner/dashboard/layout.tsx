import React from 'react';

export default function LearnerDashboardLayout({ children }: { children: React.ReactNode }) {
  // Hide header and footer by rendering children only
  return <>{children}</>;
}
