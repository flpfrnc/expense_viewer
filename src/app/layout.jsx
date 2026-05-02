import './globals.css';
import { LocaleProvider } from '@/components/LocaleProvider';

export const metadata = {
  title: 'Expense Viewer',
  description: 'Personal Finance Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800">
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
