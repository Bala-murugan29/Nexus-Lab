import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to login page - users must authenticate first
  redirect('/login');
}
