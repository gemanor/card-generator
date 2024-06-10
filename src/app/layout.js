import "./globals.css";

export const metadata = {
  title: "Ultimate Check: A Developer Quest",
  description:
    "An application to generate custom playing cards for the Ultimate Check game.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
