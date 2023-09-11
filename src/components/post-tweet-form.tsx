import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../fbase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  //  텍스트를 입력할 때 변함
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  // 트윗 저장
  const [tweet, setTweet] = useState("");
  // 파일 저장
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    // 만약 files가 존재하고, files의 길이가 1이면 ,파일의 첫번째 자식을 파일의 값으로 저장
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    // 로그인 상태인지, 로딩 중인지, 트윗이 비었는지, 트윗의 길이가 180자보다 많은 지 확인 => 있다면 함수 조기 종료
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setIsLoading(true);
      // 새로운 document 생성 ==
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      // 유저가 파일을 첨부하지 않았을 수도 있으니까 파일 첨부했는지 확인
      if (file) {
        // tweets 폴더 안에 트윗을 보내는 유저들마다 하나씩 폴더 생성함
        // tweets 안에 있는 폴더명은 firebase가 제공하는 유저ID
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        // 파일을 어디에 저장하고 싶은지 알려줘야 됨
        const result = await uploadBytes(locationRef, file);
        //이 함수는 result의 퍼블릭 URL을 반환
        const url = await getDownloadURL(result.ref);
        //어떤 문서를 업데이트하고 싶은지 그 문서에 대한 참조 넘겨줌
        await updateDoc(doc, { photo: url });
      }
      // 트윗과 사진이 성공적으로 업로드 되었다면 => 리셋해줘야됨
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      {/* 유저가 트윗을 작성할 textArea */}
      <TextArea
        required
        //  글자수랑 줄 제한
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="What is happening?"
      />
      {/*AttachFileButton: 유저가 피일 첨부 가능할 수 있도록 클릭 
      => 이 버튼을 누르는 것은 input을 누르는 것과 마찬가지임*/}
      {/* file이라는 id를 가진 input을 위한 label */}
      <AttachFileButton htmlFor="file">
        {file ? "Photo added" : "Add photo"}
      </AttachFileButton>
      {/* image/*===이미지 파일이기만 하면 어떤 확장자라도 상관 없음 */}
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn type="submit" value={isLoading ? "Posting" : "Post Tweet"} />
    </Form>
  );
}

// input 꾸미는 거 어려움 => 그래서 id와 htmlFor이 필요함
// why? 같은 id를 가지고 있다면, label을 눌렀을 때 file 버튼을 클릭하는 것과 같게 동작함
// => SO, 둘중에 하나만 눌러도 되니까 한 놈은 숨김..?

// text area에는 크기 조정 컨트롤과 같은 게 있음  =>   width: 100%; resize: none; 으로 못 움직이게 고정함
