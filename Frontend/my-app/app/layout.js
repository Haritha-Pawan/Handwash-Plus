import './globals.css'
import { Navbar } from "./components/Navbar";
import { ReactQueryProvider } from "./src/modules/super-admin/provider/ReactQueryProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Navbar />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
