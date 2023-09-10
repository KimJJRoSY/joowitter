import { useState } from "react";
import { styled } from "styled-components";
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
  return (
    <Form>
      {/* 유저가 트윗을 작성할 textArea */}
      <TextArea
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
