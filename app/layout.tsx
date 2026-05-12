/**
 * Корневой layout без `<html>` / `<body>`: их даёт либо `(portal)` (портал),
 * либо `(payload)` через Payload `RootLayout` — иначе вложенные `<html>` ломают гидратацию.
 * @see https://nextjs.org/docs/messages/react-hydration-error
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
