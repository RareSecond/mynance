import { Button } from "@mantine/core";
import { useApi } from "./hooks/useApi";

function App() {
  const { data: currentUser } = useApi("currentUser", "auth/me");
  console.log("currentUser :", currentUser);
  const { data: testing } = useApi("testing", "testing");
  console.log("testing :", testing);

  const handleGoogleLogin = () => {
    const loginUrl = `${import.meta.env.VITE_API_URL}/auth/google/login?state=${
      window.location.href
    }`;
    window.location.href = loginUrl;
  };

  return (
    <>
      <Button>Testing</Button>
      <Button onClick={handleGoogleLogin}>Log in with Google</Button>
    </>
  );
}

export default App;
