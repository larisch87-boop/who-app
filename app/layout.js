import "./globals.css";

export const metadata = {
  title: "WHO",
  description: "WHO - Anonymous Chat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
