import styled from "styled-components";
import { auth, storage } from "../fbase";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

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

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const onAvatarChange = async(e.React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e.target;
    if(!user) return;
    if(files && files.length === 1){
      const file = files [0];
      //avatars라는 폴더에 유저 ID로 사진 업로드 =>유저가 유저 이미지를 변경해도 동일한 파일 이름으로 업로드가 되어 덮어쓰기 
      const locationRef = ref(storage, `avatars/${user?.uid}`); 
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {photoURL: avatarUrl});
    }
  };
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
      <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />
      <Name>
        {/* 만약 유저가 닉네임을 갖고 있다면 닉네임을 보여줄거고 만약 없으면 익명으로 보여줌*/}
        {user?.displayName ?? "Anonymous"}
      </Name>
    </Wrapper>
  );
}
