import { Button } from "@/components/ui/button";
import { FcGoogle } from 'react-icons/fc'; // Make sure to install react-icons: npm install react-icons
import Image from 'next/image';
import { authWithOAuth2 } from '@/lib/pocketbase';

export default function Auth({ onAuthSuccess }) {
    const handleGoogleSignIn = async () => {
        try {
            const authData = await authWithOAuth2('google');
            onAuthSuccess(authData);
        } catch (error) {
            console.error('Google sign in error:', error);
        }
    };

    return (
        <div className="flex h-full">
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
                <h1 className="text-3xl font-bold mb-6 text-[#265AFF] text-center">Welcome to DrawEase</h1>
                <p className="text-lg text-center mb-8 max-w-md text-gray-600">
                    Unleash your creativity and start drawing with ease. Sign in with your Google account to begin your artistic journey.
                </p>
                <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full max-w-xs flex items-center justify-center gap-2 bg-white text-[#265AFF] border border-[#265AFF] hover:bg-[#265AFF] hover:text-white transition-colors py-6"
                >
                    <FcGoogle className="w-6 h-6" />
                    <span className="text-lg font-semibold">Sign in with Google</span>
                </Button>
            </div>
            <div className="hidden lg:block lg:w-1/2 relative">
                <Image
                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                    alt="Colorful abstract art"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-l-[5rem]"
                />
            </div>
        </div>
    );
}