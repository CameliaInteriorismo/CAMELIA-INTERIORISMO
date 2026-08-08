"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent/store";

/**
 * The whole point of the system: these tags exist in the tree only while the
 * matching consent is granted. Nothing is loaded and then "disabled" — until
 * the user opts in, the script never enters the document at all, so no
 * request to Google or Meta is ever made.
 *
 * IDs come from the environment (see .env.example). With no ID set the block
 * renders nothing, which is why the site is safe to ship before the studio
 * has created either account.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function ConsentScripts() {
  const { granted, ready } = useConsent();

  // Never render on the server or the first client pass: the server can't
  // know the stored decision, and guessing either way would be wrong.
  if (!ready) return null;

  return (
    <>
      {granted.analytics && GA_ID && (
        <>
          <Script
            id="ga-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {granted.marketing && META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
