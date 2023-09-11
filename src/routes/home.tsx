import { styled } from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import { auth } from "../fbase";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  //트윗 작성 양식은 그대로 고정되어 있는 상태에서, 트윗들을 스크롤 할 수 있게 함
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;

export default function Home() {
  const logOut = () => {
    auth.signOut();
  };
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
      <h1>
        <button onClick={logOut}> Log out</button>
      </h1>
    </Wrapper>
  );
}
