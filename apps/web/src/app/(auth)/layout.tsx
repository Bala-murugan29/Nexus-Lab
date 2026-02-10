import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Authentication | NEXUS',
    description: 'Login or create an account to access NEXUS',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
