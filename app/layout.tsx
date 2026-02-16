import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JACUNA eventos | Fotos en vivo',
  description: 'Comparte fotos en vivo en tus eventos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header style={headerStyles.header}>
          <a href="/" style={headerStyles.logoLink}>
            <img
              src="/logo-jacuna.png"
              alt="JACUNA eventos"
              style={headerStyles.logo}
            />
          </a>
        </header>
        {children}
      </body>
    </html>
  );
}

const headerStyles: Record<string, React.CSSProperties> = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(15, 15, 20, 0.92)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--border)',
    padding: '0.75rem 1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLink: {
    display: 'block',
    textDecoration: 'none',
  },
  logo: {
    height: 40,
    width: 'auto',
    display: 'block',
  },
};
