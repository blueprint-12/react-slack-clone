import React, { useCallback, useState } from 'react';
import { Button, Error, Header, Input, Label, LinkContainer, Success, Form } from './style';
import useInput from '@hooks/useInput';

const SignUp = () => {
  const [nickname, onChangeNickname] = useInput<string>('');
  const [email, onChangeEmail] = useInput<string>('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  //TODO: password mismatch
  const [mismatchError, setMismatchError] = useState(false);

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck], //참고로 외부에서 갖다쓰는 애들만 의존성 배열에 추가해주면된다.
  );

  const onChangePasswordCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      //TODO: 패스워드 mismatchError가 있으면,
      if (!mismatchError) {
        console.log('서버로 회원가입하기');
      }
    },
    [password, email, nickname, passwordCheck],
  );

  const content = (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
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
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {/* {signUpError && <Error>이미 가입된 이메일입니다.</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>} */}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <a href="/login">로그인 하러가기</a>
      </LinkContainer>
    </div>
  );

  return content;
};

export default SignUp;
