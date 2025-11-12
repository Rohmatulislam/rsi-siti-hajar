import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <SignIn 
        appearance={{
          elements: {
            card: 'shadow-xl rounded-xl border border-gray-200 max-w-md w-full',
            headerTitle: 'text-2xl font-bold text-emerald-700',
            headerSubtitle: 'text-gray-600',
            formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700',
            footerActionText: 'text-gray-600',
            footerActionLink: 'text-emerald-600 hover:text-emerald-800',
            socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
            formFieldInput: 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500',
          }
        }}
      
      />
    </div>
  );
}