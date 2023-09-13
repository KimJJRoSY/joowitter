import styled from "styled-components";
import { auth, db, storage } from "../fbase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

// 버튼처럼 보여야되지만 유저 이미지가 없으면 background처럼 보여야 함
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      //avatars라는 폴더에 유저 ID로 사진 업로드 =>유저가 유저 이미지를 변경해도 동일한 파일 이름으로 업로드가 되어 덮어쓰기
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, { photoURL: avatarUrl });
    }
  };
  const fetchTweets = async () => {
    // where에서 tweets들의 구조들을 참조 할 수 있음 => 유저 ID와 현재 로그인 된 유저 아이다가 같다면,
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    // timeline 만들 때 했던 것과 똑같이 추출
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return { tweet, createdAt, userId, username, photo, id: doc.id };
    });
    setTweets(tweets);
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {/*Boolean으로 유저 이미지 여부 확인   => 만약 유저 이미지 있다면 보여줌, 없으면 아이콘*/}
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"></path>
          </svg>
        )}
      </AvatarUpload>
      {/* input 숨겨놓고 누를 때마다 보여주기 위해서 AvatarUpload랑 연결*/}
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>
        {/* 만약 유저가 닉네임을 갖고 있다면 닉네임을 보여줄거고 만약 없으면 익명으로 보여줌*/}
        {user?.displayName ?? "Anonymous"}
      </Name>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}

// firebase의 데이터베이스인 FireStore => 너무 유연해서 어떤 데이터든지 상관없이 다 받아들임
// so, 필터링 하려고 하더라도 그런 필터가 있다고 fireStore에 알려줘야됨
// => 콘솔 창에 뜬 링크 누르면 firebase로 넘어가는데 거기서 인덱스 설정 가능 => save 버트 누르기
