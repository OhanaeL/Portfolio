import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import Reveal from "@/components/Reveal";
import Spotlight from "@/components/Spotlight";
import SideNav from "@/components/SideNav";
import { site } from "@/lib/site";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} | ${site.role}`,
    description: site.description,
    type: "website",
    url: site.url,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        {/* replay a saved theme choice before first paint so there is no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}}catch(e){}",
          }}
        />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteHeader />

        <main id="main">{children}</main>

        <footer>
          <div className="container footer-inner">
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
            <nav className="footer-links" aria-label="Contact">
              <a href={`mailto:${site.email}`}>Email</a>
              <a href={site.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </nav>
          </div>
        </footer>
        <SideNav />
        <Reveal />
        <Spotlight />
      </body>
    </html>
  );
}
