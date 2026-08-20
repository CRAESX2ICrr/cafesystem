import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CafeMS",
  description: "Cafe Management System",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full text-white">
        <AuthProvider>
          <CartProvider>
            <div className="relative isolate flex min-h-screen flex-col overflow-hidden">

              {/* Light coffee background image */}
              <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    "url('https://wallpapers.com/images/hd/simple-latte-color-hd-background-r139b82y1a2n78dv.jpg')",
                }}
              />

              {/* Light overlay */}
              <div className="pointer-events-none fixed inset-0 z-[1] bg-[#2a1810]/30" />

              {/* Actual app */}
              <div className="relative z-10 flex min-h-screen flex-col">
                <Header />

                <main className="flex-1">
                  {children}
                </main>
              </div>

            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}