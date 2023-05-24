import React, { useCallback, useState } from 'react';
import { Button, Error, Header, Input, Label, LinkContainer, Success, Form } from './style';
import useInput from '@hooks/useInput';
import axios from 'axios';
// 리액트 라우터를 쓸 때에는 a태그보단 Link 태그 활용
import { Link } from 'react-router-dom';

const SignUp = () => {
  //TODO: 화면에 표시하는 데이터들은 무조건 state로 만들어주기
  const [nickname, onChangeNickname, setNickname] = useInput<string>('');
  const [email, onChangeEmail, setEmail] = useInput<string>('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  //TODO: password mismatch
  const [mismatchError, setMismatchError] = useState(false);
  //TODO: sighUp Error
  const [signUpErrorMsg, setSignUpErrorMsg] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setMismatchError(passwordCheck !== passwordCheck);
    },
    [passwordCheck, password], //참고로 외부에서 갖다쓰는 애들만 의존성 배열에 추가해주면된다.
  );

  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setMismatchError(password !== e.target.value);
    },
    [password, passwordCheck],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      //TODO: 비동기 요청에서 state를 변경해야하는 경우가 있다면 사용 직전에 한번 초기화시켜주는 것이 좋다. 각 요청별로 다른 결과를 보여줘야 하는데 이전 요청의 값때문에 원치않는 에러가 날 수 있기 때문이다.

      // 비동기 요청 로딩 단계
      setSignUpErrorMsg('');
      setSignUpSuccess(false);
      if (!mismatchError && nickname) {
        console.log('서버로 회원가입하기');
        axios
          .post('http://localhost:3095/api/users', {
            email,
            nickname,
            password,
          })
          .then((res) => {
            // 비동기 성공 단계
            setEmail('');
            setNickname('');
            setPassword('');
            setPasswordCheck('');
            setSignUpSuccess(true);
          })
          .catch((err) => {
            // 비동기 실패 단계
            if (err.response) {
              setSignUpErrorMsg(err.response.data);
            }
          })
          .finally(() => {});
      }
    },
    [password, email, nickname, passwordCheck, mismatchError],
  );

  const content = (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} required />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} required />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChangePassword}
              required
              autoComplete="new-password"
            />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
              required
              autoComplete="new-password"
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpErrorMsg && <Error>{signUpErrorMsg}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );

  return content;
};

export default SignUp;
