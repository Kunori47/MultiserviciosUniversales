import type { Metadata } from "next";
import "../css/main.css";
import StoreProvider from "./_stores/StoreProvider";
import Script from "next/script";

const title = `Multiservicios Universal`;



export const metadata: Metadata = {
  title,
  openGraph: {
    title,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en" className="style-basic">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=UA-130795909-1"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-130795909-1');
          `}
        </Script>
        <body
          className={`bg-gray-50 dark:bg-slate-800 dark:text-slate-100 antialiased`}
        >
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
