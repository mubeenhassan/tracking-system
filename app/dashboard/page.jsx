import { redirect } from "next/navigation";
import { checkSession } from "../action/auth";

export default async function DashboardPage() {
  const user = await checkSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <div className="m-auto rounded-md max-w-5xl w-full p-12 flex items-center justify-center bg-gray-100">
        <div className="space-y-8 w-full">
          <h1 className="text-2xl font-bold text-center">Welcome</h1>
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h2 className="text-lg text-center font-semibold mb-2">
              {user.message || "No message available."}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
