import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../fbase";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";

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
    setError("");
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
      //2. 사용자 프로필의 이름 지정 ==사용자 프로필 업데이트
      await updateProfile(credentials.user, {
        displayName: name,
      });
      //3. 홈페이지로 리디렉션 ==사용자가 프로필을 업데이트 한 뒤 홈페이지로 이동함
      navigate("/");
      // 해당 이메일의 사용자가 이미 존재하거나 비밀번호가 너무 약하거나 등으로 작동하지 않을 때
      // catch 블록에서 오류 잡아낼 수 있음
    } catch (e) {
      //setError
      if (e instanceof FirebaseError) {
        console.log(e.code, e.message);
        setError(e.message);
      }
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
      <Switcher>
        Already have an account? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
