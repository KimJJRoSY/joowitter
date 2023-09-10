import React, { useState } from "react";
import { styled } from "styled-components";
import { auth } from "../fbase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setIsLoading(true);
      //signInWithEmailAndPassword==> firebase/auth 꺼로 가져와야 됨
      //signInWithEmailAndPassword는 UserCredential을 반환== 로그인한 사용자가 누군지 알려줌
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      //setError
      if (e instanceof FirebaseError) {
        console.log(e.code, e.message);
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Log into</Title>
      <Form onSubmit={onSubmit}>
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
          value={isLoading ? "Loading" : "Log in"}
        />
      </Form>
      {/* 만약 에러가 빈 문자열과 같지 않다면 에러메세지 보여줌 */}
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{""}
        <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
