import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CREA | Formalización gastronómica en Perú",
  description: "Orientación para formalizar restaurantes, cafeterías y servicios afines en Perú.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
