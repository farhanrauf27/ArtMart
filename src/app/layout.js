import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../../providers"; // Import the Providers component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Antique Collection - Timeless Treasures",
  description: "Discover exquisite antique treasures with guaranteed authenticity",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}