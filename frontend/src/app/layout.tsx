import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // <-- IMPORT
import { AuthProvider } from './context/AuthContext';
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI StudyMate",
  description: "Your personalized AI-powered learning assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* <-- WRAP everything */}
          <main className="container mx-auto max-w-4xl p-4 md:p-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold ...">AI StudyMate</h1>
            </div>
            <Navbar />
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}