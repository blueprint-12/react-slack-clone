import useInput from '@hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
  // ? data, error가 바뀌는 순간 `리렌더링`
  // mutate는 서버에 api콜을 보내는게 아니라 데이터 수정을 해준다.
  const { data: userData, error, isLoading, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  console.log('data', userData);

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail, setEmail] = useInput('');
  const [password, onChangePassword, setPassword] = useInput('');

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      setLogInError(false);
      // !input에 클릭만해도 라우팅되는 문제 이전 state가 초기화가 안되서 그런 것 + focus 문제
      setEmail('');
      setPassword('');
      axios
        .post(
          'http://localhost:3095/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then((res) => {
          // update the local data immediately and revalidate (refetch)
          //! revalidate는 서버에 다시 api콜을 하는 것
          //! mutate는 요청을 보내지않고 data값에 새로운 값을 넣어 갱신

          mutate(res.data);
        })
        .catch((error) => {
          console.dir(error);
          setLogInError(error.response?.status === 401);
        });
    },
    [email, password, mutate],
  );

  // ? content return은 hooks아래에 존재해야 한다.
  if (userData) return <Navigate to="/workspace/channel" replace={true} />;

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit" disabled={!email || !password}>
          로그인
        </Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
