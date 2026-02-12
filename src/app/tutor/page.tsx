import { redirect } from 'next/navigation';

export default function TutorPage() {
  // Redirect /tutor to /tutor/dashboard
  redirect('/tutor/dashboard');
}