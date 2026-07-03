import "./globals.css";

export const metadata = {
  title: "La Polla Periquitos · Fase Final 2026",
  description: "Tablero de puntajes de la polla del Mundial 2026",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
