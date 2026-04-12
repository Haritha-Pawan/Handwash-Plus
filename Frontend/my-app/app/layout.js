import { Suspense } from "react";
import "./globals.css";

import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import { ReactQueryProvider } from "./src/modules/super-admin/provider/ReactQueryProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Suspense fallback={<div className="h-16 border-b" />}>
            <Navbar />
          </Suspense>

          {children}
        </ReactQueryProvider>

        <Footer />
      </body>
    </html>
  );
}