import "./globals.css";

export const metadata = {
  title: "PhishGuard // Email Threat Triage & Security Audit",
  description: "Enterprise email phishing detection, heuristic inspection, and contextual AI analysis platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#090a0f] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
