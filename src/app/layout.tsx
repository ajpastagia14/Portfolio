import "./globals.css";
import RefreshRedirect from '@/components/RefreshRedirect'

export const metadata = {
  title: "Akshar Pastagia | Data, Business & Financial Analyst",
  description:
    "Portfolio of Akshar Pastagia, a Toronto-based analyst specializing in data analysis, financial reporting, business intelligence, forecasting, SQL, Excel, Power BI, and Tableau.",
  keywords: [
    "Akshar Pastagia",
    "Data Analyst",
    "Business Analyst",
    "Financial Analyst",
    "Business Intelligence Analyst",
    "Toronto",
    "Power BI",
    "Tableau",
    "SQL",
    "Financial Reporting",
  ],
  authors: [{ name: "Akshar Pastagia" }],
  openGraph: {
    title: "Akshar Pastagia | Data, Business & Financial Analyst",
    description:
      "Portfolio of Akshar Pastagia, a Toronto-based analyst specializing in data analysis, financial reporting, business intelligence, forecasting, SQL, Excel, Power BI, and Tableau.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RefreshRedirect />
        {children}
        </body>
    </html>
  );
}