import { Navigate } from "react-router-dom";
import { auth } from "../fbase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // 유저가 로그인했는지 여부 알려줌 ==> const user: User | null
  const user = auth.currentUser;
  console.log(user);
  // 유저가 아니라면 로그인페이지로 이동함
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
  //return <Home/>
}
