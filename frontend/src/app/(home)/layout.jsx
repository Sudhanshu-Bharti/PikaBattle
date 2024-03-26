import { Inter } from "next/font/google";
import "../../app/globals.css"
export default function RootLayout({ children }) {
  return (
        <div>
            {children}
        </div>
  );
}
