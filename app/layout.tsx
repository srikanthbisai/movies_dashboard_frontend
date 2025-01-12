// app/layout.tsx
import { Inter } from 'next/font/google'
import { AuthProvider } from './providers'
import Toast from './components/Toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toast />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
