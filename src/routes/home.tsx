import { styled } from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import { auth } from "../fbase";

const Wrapper = styled.div``;

export default function Home() {
  const logOut = () => {
    auth.signOut();
  };
  return (
    <Wrapper>
      <PostTweetForm />
      <h1>
        <button onClick={logOut}> Log out</button>
      </h1>
    </Wrapper>
  );
}
