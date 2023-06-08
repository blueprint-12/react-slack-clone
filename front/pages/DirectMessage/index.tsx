import { Container } from '@pages/Channel/styles';
import fetcher from '@utils/fetcher';
import React, { FormEvent, useCallback } from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router';
import gravatar from 'gravatar';
import { Header } from './styles';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';

const DirectMessage = () => {
  const { workspace, id } = useParams();

  //TODO: 워크스페이스 멤버 데이터 가져오기
  //? GET/workspaces/:workspace/members/:id
  const { data: userData } = useSWR(`/api/users`, fetcher);
  const { data: memberData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  // 값이 없으면 로딩중이거나 에러(SWR 2버전에서는 두개를 구분하는 state 제공)

  const onSubmitForm = useCallback((e: FormEvent) => {
    e.preventDefault();
    console.log('submit');
    setChat('');
  }, []);

  if (!userData || !memberData) return null;

  return (
    <Container>
      <Header>
        <img src={gravatar.url(memberData.email, { s: '25px', d: 'retro' })} alt={memberData.nickname} />
        <span>{memberData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
