import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-fit m-auto p-12 flex items-center justify-center bg-gray-100">
      <div className="space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
