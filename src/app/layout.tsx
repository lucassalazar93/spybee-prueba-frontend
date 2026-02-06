import type { Metadata, Viewport } from "next";
import "@/aplicacion/estilos/globales.css";

export const metadata: Metadata = {
  title: "Spybee | Prueba Frontend",
  description: "Prueba técnica frontend - Lucas",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
