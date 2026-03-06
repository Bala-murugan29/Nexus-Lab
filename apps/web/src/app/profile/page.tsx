import { UserProfileCard } from '@/components/workspace/UserProfileCard';
import { ProfileHeader } from '@/components/workspace/ProfileHeader';
import { SocialLogin } from '@/components/workspace/SocialLogin';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back & Logout */}
      <ProfileHeader />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Social Login Section */}
        <SocialLogin />

        {/* Profile Card */}
        <UserProfileCard />
      </div>
    </div>
  );
}
