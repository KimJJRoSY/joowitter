import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { styled } from "styled-components";
import { auth } from "../fbase";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

const Title = styled.h1`
  font-size: 42px;
`;

const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  // 만약 type이 submit이라면 커서를 pointer로 변경
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //화면이 새로고침되지 않도록 해줌
    e.preventDefault();
    // 만약 로딩중이거나 name, email, password가 비어져있으면 걍 리턴함
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setIsLoading(true);
      //1. 계정생성 = 사용자를 생성한 다음에 바로 우리한테 정보 돌려줌
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      //사용자 프로필 업데이트
      await updateProfile(credentials.user, {
        displayName: name,
      });
      // 사용자가 프로필을 업데이트 한 뒤 홈페이지로 이동함
      navigate("/");
      //2. 사용자 프로필의 이름 지정
      //3. 홈페이지로 리디렉션
    } catch (e) {
      //setError
    } finally {
      setIsLoading(false);
    }

    // console.log(name, email, password);
  };
  return (
    <Wrapper>
      <Title>JoinX</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          name="password"
          value={password}
          placeholder="passsword"
          type="password"
          required
        />
        <Input
          onChange={onChange}
          type="submit"
          value={isLoading ? "Loading" : "Create Account"}
        />
      </Form>
      {/* 만약 에러가 빈 문자열과 같지 않다면 에러메세지 보여줌 */}
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
}
