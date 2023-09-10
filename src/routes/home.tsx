import { auth } from "../fbase";

export default function Home() {
  const logOut = () => {
    auth.signOut();
  };
  return (
    <h1>
      <button onClick={logOut}> Log out</button>
    </h1>
  );
}
