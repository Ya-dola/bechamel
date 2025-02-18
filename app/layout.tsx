import type { Metadata } from 'next';
import '@mantine/core/styles.css';
import '@/styles/globals.css';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { ClientProviders } from '@/providers/client_providers';

const metadata: Metadata = {
  title: 'Bechamel',
  description: 'The only recipe book you need!',
};

const themeMode = 'dark';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en'
      {...mantineHtmlProps}
    >
      <head>
        <ColorSchemeScript defaultColorScheme={themeMode} />
      </head>
      <body>
        <ClientProviders defaultColorScheme={themeMode}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

export { metadata };
export default RootLayout;
