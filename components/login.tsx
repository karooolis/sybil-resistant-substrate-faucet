import { useSession, signIn, signOut } from "next-auth/react";
import Button from "./button";

const Login = () => {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <button
        data-testid="signout-btn"
        className="block mt-4 -mb-1 mx-auto text-blue-500 underline"
        onClick={() => signOut()}
      >
        Sign out {session.user.email || session.user.name}
      </button>
    );
  }

  return (
    <div className="mt-2">
      <Button data-testid="twitter-login-btn" onClick={() => signIn("twitter")}>
        Sign in with Twitter
      </Button>
      <Button data-testid="github-login-btn" onClick={() => signIn("github")}>
        Sign in with GitHub
      </Button>
    </div>
  );
};

export default Login;
