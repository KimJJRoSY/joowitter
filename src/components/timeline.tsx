import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../fbase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

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

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline() {
  //useState<ITweet[]>([]) : 이건 트윗 배열 + 기본값은 빈 배열
  const [tweets, setTweets] = useState<ITweet[]>([]);
  // 트윗을 불러옴
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetQuery = query(
        // collection은 firestore 인스턴스를 매개변수로 넘겨줘야 됨
        collection(db, "tweets"),
        // 가장 최신 순으로 정렬 =내림차순
        orderBy("createdAt", "desc"),
        // 첫 25개만 불러옴
        limit(25)
      );
      // 쿼리 생기고 이제 문서 가져옴
      // const snapshot = await getDocs(tweetQuery);
      // // forEach를 사용해서 각 문서에 접근하고 걍 문서 데이터 출력
      // // snapshot.docs.forEach((doc) => console.log(doc.data()));
      // // map은 map 내의 함수에서 반환한 항목을 가지고 배열을 만들어줌
      // //=> 트윗 배열 안에 모든 문서의 저장
      // const tweets = snapshot.docs.map((doc) => {
      //   // 트윗에서 ITweet을 만족하는 모든 데이터를 추출
      //   const { tweet, createdAt, userId, username, photo } = doc.data();
      //   // ITweet에 부합하는 트윗 객체를 반환
      //   return { tweet, createdAt, userId, username, photo, id: doc.id };
      // });

      // 데이터베이스 및  쿼리와 실시간 연결을 생성-> 해당 쿼리에 새 요소가 생성 or 요소 삭제 or 업데이트 됐을 떄 쿼리 알려줌
      // onSnapshot 함수는 unsubscribe(구독취소)함수를 반환
      unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
        // 실시간으로 해당 쿼리에 대한 모든 문서를 반환 => 만약 누군가 쿼리에서 뭔가를 삭제하면, 그 정보를 문서형식으로 받게 됨
        // 즉, 문서를 한 번만 가져오는 대신 쿼리에 리스너 추가
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          // 우리가 필요한 데이터 추출
          return { tweet, createdAt, userId, username, photo, id: doc.id };
        });
        // 트윗 객체를 생성하고 트윗 객체 배열을 tweets 변수에 넣은 다음에 setTweets(tweets); 저장
        setTweets(tweets);
      });
    };
    fetchTweets();
    // useEffet에서 값을 반환할 떄, unsubscribe 호출
    return () => {
      // unsubscribe가 참 일때 unsubscribe 호출 ==> 더이상 타이라인 컴포넌트가 사용되지 않을 때
      unsubscribe && unsubscribe();
    };
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

// useEffect는 유저가 화면을 보지 않을 때 값을 반환하면서 cleanup 실시
// ex) 유저가 프로필 페이지로 이동하면 타임라인의 이벤트를 계속 들을 필요 없음
