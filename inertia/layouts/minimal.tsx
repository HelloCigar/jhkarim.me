import { ReactElement } from 'react'
import { Logo } from '~/components/logo'
import { ThemeSwitcher } from '~/components/theme_switcher'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import { useFlashToasts } from '~/hooks/use_flash'

export default function MinimalLayout({ children }: { children: ReactElement }) {
  useFlashToasts()

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10 sm:px-5">
      <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
        <ThemeSwitcher />
      </div>
      <div className="mb-8">
        <Logo className="h-8 w-auto sm:h-9" />
      </div>
      <ToastProvider position="top-center">
        <AnchoredToastProvider>{children}</AnchoredToastProvider>
      </ToastProvider>
    </div>
  )
}
