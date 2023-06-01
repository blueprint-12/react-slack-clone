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
} from './styles';

import axios from 'axios';
import { Navigate, Outlet } from 'react-router';

import gravatar from 'gravatar';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import { IUser } from '@typings/db';

const WorkSpace = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const {
    data: userData,
    error,
    isLoading,
    mutate,
  } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, { suspense: true });
  console.log('data', userData);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
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

  const onClickCreateWorkSpace = useCallback(() => {}, []);

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
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkSpace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>이 내부에 Menu컴포넌트</MenuScroll>
        </Channels>
        <Chats>
          {/* 중첩라우팅 */}
          <Outlet />
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default WorkSpace;
