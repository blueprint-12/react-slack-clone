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
} from './styles';

import axios from 'axios';
import { Navigate, Outlet } from 'react-router';

import gravatar from 'gravatar';
import Menu from '@components/Menu';

const WorkSpace = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const {
    data: userData,
    error,
    isLoading,
    mutate,
  } = useSWR('http://localhost:3095/api/users', fetcher, { suspense: true });
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

  // replace: true means REDIRECT
  if (userData === false) return <Navigate to="/login" replace={true} />;

  return (
    <div>
      <Header>test</Header>
      <RightMenu onClick={onClickUserProfile}>
        <span>
          <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
              프로필 메뉴
            </Menu>
          )}
        </span>
      </RightMenu>
      <button onClick={onLogout}>저눈 workspace의 버툰입니당</button>
      <WorkspaceWrapper>
        <Workspaces>안녕</Workspaces>
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
