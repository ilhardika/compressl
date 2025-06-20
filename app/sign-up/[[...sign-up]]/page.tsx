import { SignUp } from "@clerk/nextjs";
import { cn } from "@/app/lib/utils";

export default function SignUpPage() {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center",
        "py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white"
      )}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-gray-600">
            Join Compressly to optimize your images
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                footerActionLink: "text-blue-600 hover:text-blue-700",
              },
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            redirectUrl="/compress" {/* Ubah dari /dashboard ke /compress */}
          />
        </div>
      </div>
    </div>
  );
}
