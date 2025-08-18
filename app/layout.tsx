import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster as SonnerToaster } from 'sonner'
import { SupportButton } from '@/components/ui/support-button'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
// import { InstallPrompt } from '@/components/pwa/install-prompt' // Removed - install options are in home page and hamburger menu
import { DebugInstall } from '@/components/pwa/debug-install' // Re-enabled for troubleshooting
import { OfferTracker } from '@/components/marketing/offer-tracker'

// Reason: Auth cookie sync is a client-only effect; import dynamically with SSR disabled
const AuthCookieSync = dynamic(() => import('@/components/providers/auth-cookie-sync').then(m => m.AuthCookieSync), { ssr: false })
// import { ClearInstallCache } from '@/components/pwa/clear-install-cache' // Combined into DebugInstall
// import { DebugToggle } from '@/components/pwa/debug-toggle' // Removed - using individual minimize buttons
import { ServiceWorkerRegistration } from '@/components/pwa/service-worker-registration'
import { VerificationBanner } from '@/components/account/verification-banner'
import { LaunchSplash } from '@/components/pwa/launch-splash'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'MyDataDay — Make YOUR goals OUR problem.',
    template: '%s | MyDataDay'
  },
  description: 'Make YOUR goals OUR problem. One clear step each day, real proof, and support you can count on.',
  keywords: ['goal achievement', 'social accountability', 'habit tracking', 'AI coaching', 'emergency support team', 'personal goals'],
  authors: [{ name: 'MyDataday Team' }],
  creator: 'MyDataday',
  publisher: 'MyDataday LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mydataday.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'MyDataDay — Make YOUR goals OUR problem.',
    description: 'Make YOUR goals OUR problem. One clear step each day, real proof, and support you can count on.',
    siteName: 'MyDataday',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MyDataday - Your Life Progress System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyDataDay — Make YOUR goals OUR problem.',
    description: 'Make YOUR goals OUR problem. One clear step each day, real proof, and support you can count on.',
    images: ['/og-image.png'],
    creator: '@mydataday',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json?v=14',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#000000' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* Preloader CSS + Script to avoid flash and small→large jump */}
        <style
          id="md-preloader-css"
          dangerouslySetInnerHTML={{
            __html: `html:not([data-booted]) body > div#__next { visibility: hidden; }
#md-launch-preloader{ position:fixed; inset:0; background:#000; display:flex; align-items:center; justify-content:center; z-index:2147483647; }
#md-launch-preloader img{ width:280px; height:280px; animation: splashZoom 1.05s ease-out forwards; }
@keyframes splashZoom { 0%{ transform:scale(0.86); opacity:0;} 35%{opacity:1;} 100%{ transform:scale(1.08); opacity:1; } }`
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try {
              var isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || (navigator.standalone === true);
              if (!isStandalone) return;
              if (sessionStorage.getItem('launch-splash-shown') === '1') return;
              var make = function(){
                var pre = document.getElementById('md-launch-preloader');
                if (!pre) {
                  pre = document.createElement('div');
                  pre.id = 'md-launch-preloader';
                  var img = document.createElement('img');
                  img.src = '/icons/app-icon-512-any.png';
                  img.alt = ''; img.setAttribute('aria-hidden','true'); img.setAttribute('role','presentation');
                  pre.appendChild(img);
                  document.body.appendChild(pre);
                }
              };
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', make);
              } else {
                make();
              }
              // Fallback: ensure removal in case React side doesn't
              setTimeout(function(){
                var pre = document.getElementById('md-launch-preloader');
                if (pre && pre.parentNode) {
                  pre.parentNode.removeChild(pre);
                  document.documentElement.setAttribute('data-booted', '1');
                  sessionStorage.setItem('launch-splash-shown', '1');
                }
              }, 2000);
            } catch(e){} })();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className
        )}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <OfferTracker />
            <LaunchSplash />
            <VerificationBanner />
            {/* Reason: Ensure server cookies reflect client auth state so middleware sees session */}
            <AuthCookieSync />
            {children}
            <SonnerToaster
              theme="dark"
              position="top-right"
              richColors
              closeButton={false}
              duration={2000}
              toastOptions={{
                classNames: {
                  toast: 'bg-gray-900/90 border border-gray-700 backdrop-blur-sm',
                  title: 'text-white',
                  description: 'text-gray-300',
                  actionButton: 'bg-blue-600 hover:bg-blue-700',
                  cancelButton: 'bg-transparent text-gray-300 hover:text-white'
                }
              }}
            />
            <SupportButton />
            <DebugInstall />
            <ServiceWorkerRegistration />
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
