import React from 'react'
import { SidebarProvider as ShadcnSidebarProvider } from '../ui/sidebar';

const SidebarProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
  return (
    <ShadcnSidebarProvider>
        {children}
    </ShadcnSidebarProvider>
  )
}

export default SidebarProvider;