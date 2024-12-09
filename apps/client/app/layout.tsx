import { AuthProvider, useAuth } from "./contexts/authContext";
import "./globals.css";
import SideNav from "./components/SideNav";

export const metadata = {
  title: "Jam Board",
  description: "Manage your boards and tasks with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex">
            <SideNav />

            <main className="flex-1 p-4">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
