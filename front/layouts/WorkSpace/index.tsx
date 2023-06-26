import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

import {
  Channels,
  Header,
  ProfileImg,
  RightMenu,
  WorkspaceWrapper,
  Workspaces,
  Chats,
  WorkspaceName,
  MenuScroll,
  ProfileModal,
  LogOutButton,
  WorkspaceButton,
  AddButton,
  WorkspaceModal,
} from './styles';

import axios from 'axios';
import { Navigate, Route, Routes, useParams } from 'react-router';

import gravatar from 'gravatar';
import Menu from '@components/Menu';
import Modal from '@components/Modal';
import { Link } from 'react-router-dom';
import { IChannel, IUser } from '@typings/db';
import { Input, Label, Button } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import { toast } from 'react-toastify';
import CreateChannelModal from '@components/CreateChannelModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';
import useSocket from '@hooks/useSocket';

//TODO: 중첩라우트
const Channel = React.lazy(() => import('@pages/Channel'));
const DirectMessage = React.lazy(() => import('@pages/DirectMessage'));

const WorkSpace = () => {
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);

  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, mutate } = useSWR<IUser | false>('/api/users', fetcher, {
    suspense: true,
    dedupingInterval: 3000,
  });

  // TODO: SWR 3항연산자를 통해 userData가 있는 경우(로그인 상태)에만 api요청을 보낸다. (조건부 요청지원)
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);
  const [socket, disconnect] = useSocket(workspace);

  useEffect(() => {
    if(channelData && userData && socket){
      socket.emit('login', {id: userData.id, channels: channelData.map((v)=> v.id)})
    }
  }, [socket, channelData, userData]);

  const onClickUserProfile = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // TODO: 이벤트 버블링 막기
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  // TODO: 열린 모든 모달 닫기
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteChannelModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        //data , mutate? (boolean)
        mutate(false);
      })
      .catch((err) => {
        console.log('err', err.response);
      });
  }, []);

  const onClickCreateWorkSpace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // if(!newWorkspace || !newUrl) return;은 공백이 포함되도 응답이감
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          '/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          { withCredentials: true },
        )
        .then((res) => {
          mutate();
          // ! 다음 요청 시, 초기화해주지 않으면 데이터 남아있음
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((err) => {
          console.dir(err);
          toast.error(err.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

  // replace: true means REDIRECT
  if (userData === false) return <Navigate to="/login" replace={true} />;

  if (!userData) return <>Loading.. userData...</>;

  return (
    <div>
      <Header>test</Header>
      <RightMenu onClick={onClickUserProfile}>
        <span>
          <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
              <ProfileModal>
                <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                <div>
                  <span id="profile-name">{userData.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>
          )}
        </span>
      </RightMenu>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspaces/${ws.url}/channels/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkSpace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>
            {userData?.Workspaces.find((v) => v.url === workspace)?.name}
          </WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스 초대하기</button>
                <button onClick={onClickAddChannel}>채널만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            <ChannelList />
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          {/* 중첩라우팅 */}
          <Routes>
            <Route path="/channels/:channel" element={<Channel />} />
            <Route path="/dm/:id" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </div>
  );
};

export default WorkSpace;
