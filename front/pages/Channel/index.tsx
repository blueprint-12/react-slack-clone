import React, { FormEvent, useCallback } from 'react';
import { Container, Header } from './styles';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';

const Channel = () => {
  const [chat, onChangeChat] = useInput('');
  const onSubmitForm = useCallback((e: FormEvent) => {
    e.preventDefault();
  }, []);
  return (
    <Container>
      <Header>채널 헤더</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
