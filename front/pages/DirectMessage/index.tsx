import { Container } from '@pages/Channel/styles';
import fetcher from '@utils/fetcher';
import React from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router';
import gravatar from 'gravatar';
import { Header } from './styles';

const DirectMessage = () => {
  const { workspace, id } = useParams();

  //TODO: 워크스페이스 멤버 데이터 가져오기
  //? GET/workspaces/:workspace/members/:id
  const { data: userData } = useSWR(`/api/users`, fetcher);
  const { data: memberData } = useSWR(`/api/workspaces/${workspace}/members/${id}`, fetcher);
  console.log('memberData', memberData);
  //TODO: 유저데이터(나)

  // 값이 없으면 로딩중이거나 에러(SWR 2버전에서는 두개를 구분하는 state 제공)
  if (!userData) return null;
  if (!memberData) return <div>loading...</div>;

  return (
    <Container>
      <Header>
        <img src={gravatar.url(memberData.email, { s: '25px', d: 'retro' })} alt={memberData.nickname} />
      </Header>
    </Container>
    // <ChatLists/>
    // <ChatBox/>
  );
};

export default DirectMessage;
