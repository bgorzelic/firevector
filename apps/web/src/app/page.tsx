import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to login until auth is wired
  redirect('/login');
}
