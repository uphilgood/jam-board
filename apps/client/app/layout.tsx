import "./globals.css";

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
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
