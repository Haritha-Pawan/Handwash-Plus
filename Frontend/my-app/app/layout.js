import './globals.css'
<<<<<<< HEAD
import  {Navbar}  from "./components/common/Navbar";
=======
import { Navbar } from "./components/Navbar";
import { ReactQueryProvider } from "./src/modules/super-admin/provider/ReactQueryProvider";

>>>>>>> 2d39c36b4aa3eba0772f20bca0b45fba0829df55
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
