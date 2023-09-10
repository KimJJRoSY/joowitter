import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/laylout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./fbase";
import { styled } from "styled-components";
import ProtectedRoute from "./components/protected-route";
// import { createGlobalStyle } from "styled-components";

const router = createBrowserRouter([
  {
    //모든 경로와 맞아떨어지게 되어있음 => /profile 치면 layout 이랑 profile이랑 같이 뜸
    path: "/",
    element: (
      // layout이 Home과 Profile을 감싸고 있기 때문에 layout 보호하면 home,profile도 보호
      <ProtectedRoute>
        {" "}
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  //chilren안에 포함되지 않음 => layout은 로그인한 사용자만 사용가능
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
]);

// const GlobalStyles = createGlobalStyle`
//   ${reset};
//   * {
//   box-sizing: border-box;
// }
// body {
//   background-color: black;
//   color:white;
//   font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
// }
// `;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    //firebase가 쿠키와 토큰을 읽고 백엔드와 소통해서 로그인 여를 확인하는 동안 기리겠다는 뜻
    await auth.authStateReady();

    //wait for firebase
    // setTimeout(() => setIsLoading(false), 2000);
    setIsLoading(false);
  };
  useEffect(() => {
    init(), [];
  });
  return (
    <Wrapper>
      {/* <GlobalStyles /> */}
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;

//layout의 Outlet은 페이지 바뀔 때마다 바뀜
//프로필 페이지와 홈페이지는 모두 ProtectedRoute의 children으로 보내짐
