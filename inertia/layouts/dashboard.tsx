import { ReactElement } from 'react'
import { useFlashToasts } from '~/hooks/use_flash'
import { AppSidebar } from '~/components/app_sidebar'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'

export default function DashboardLayout({ children }: { children: ReactElement }) {
  useFlashToasts()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ToastProvider position="top-center">
          <AnchoredToastProvider>{children}</AnchoredToastProvider>
        </ToastProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
