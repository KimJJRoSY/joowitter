import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../fbase";
import Tweet from "./tweet";

//트윗 데이터가 어떻게 생겼는지 TS로 정의
export interface ITweet {
  id: string;
  //photo가 필수는 아님
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  //useState<ITweet[]>([]) : 이건 트윗 배열 + 기본값은 빈 배열
  const [tweets, setTweets] = useState<ITweet[]>([]);
  // 트윗을 불러옴
  const fetchTweets = async () => {
    const tweetQuery = query(
      // collection은 firestore 인스턴스를 매개변수로 넘겨줘야 됨
      collection(db, "tweets"),
      // 가장 최신 순으로 정렬 =내림차순
      orderBy("createdAt", "desc")
    );
    // 쿼리 생기고 이제 문서 가져옴
    const snapshot = await getDocs(tweetQuery);
    // forEach를 사용해서 각 문서에 접근하고 걍 문서 데이터 출력
    // snapshot.docs.forEach((doc) => console.log(doc.data()));
    // map은 map 내의 함수에서 반환한 항목을 가지고 배열을 만들어줌
    //=> 트윗 배열 안에 모든 문서의 저장
    const tweets = snapshot.docs.map((doc) => {
      // 트윗에서 ITweet을 만족하는 모든 데이터를 추출
      const { tweet, createdAt, userId, username, photo } = doc.data();
      // ITweet에 부합하는 트윗 객체를 반환
      return { tweet, createdAt, userId, username, photo, id: doc.id };
    });
    setTweets(tweets);
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  return (
    <Wrapper>
      {/* 트윗마다 Tweet 컴포넌ㅌ트를 렌더링할건데 key는 트윗의 ID가 됨 */}
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
