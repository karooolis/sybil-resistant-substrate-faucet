import { useSession, signIn, signOut } from "next-auth/react";
import Button from "./button";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <button
        className="block mt-4 -mb-1 mx-auto text-blue-500 underline"
        onClick={() => signOut()}
      >
        Sign out {session.user.email || session.user.name}
      </button>
    );
  }

  return (
    <div className="mt-2">
      <Button onClick={() => signIn("twitter")}>Sign in with Twitter</Button>
      <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
    </div>
  );
}
