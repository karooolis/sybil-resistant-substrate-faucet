import { useSession, signIn, signOut } from "next-auth/react";
import Button from "./button";

export default function LoginButton() {
  const { data: session } = useSession();

  console.log("session", session);

  if (session?.user) {
    return (
      // <div className="text-center">
        <button
          className="mt-3 text-blue-500 underline"
          onClick={() => signOut()}
        >
          Sign out {session.user.email}
        </button>
      // </div>
    );
  }

  return (
    <div className="mt-2">
      <Button onClick={() => signIn()}>Sign in</Button>
    </div>
  );
}
