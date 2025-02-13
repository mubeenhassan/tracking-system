import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { UserNav } from "@/components/UserNav";
import { SessionProvider } from "@/components/SessionProvider";


export const metadata = {
  title: "My App",
  description: "",
};

async function getUser() {
  const cookieStore = cookies();
  const userCookie = await cookieStore.get("user");
  if (userCookie) {
    try {
      return JSON.parse(userCookie.value);
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      return null;
    }
  }
  return null;
}

export default async function RootLayout({ children }) {
  const user = await getUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        <SessionProvider>
          <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-white font-bold">
                Welcome
              </Link>
              <div>
                {user ? (
                  <UserNav user={user} />
                ) : (
                  <Link href="/login" className="text-white">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </nav>
          {children}
        </SessionProvider>
        <footer className="bg-gray-900 text-white py-4">
          <div className="container mx-auto text-center">
            <p>
              Created by Mubeen. Visit{" "}
              <Link
                href="https://mubeenhassan.com"
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                mubeenhassan.com
              </Link>{" "}
              for more info.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
