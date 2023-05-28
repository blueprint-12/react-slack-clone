import React, { ReactNode, useCallback, useEffect } from 'react';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

import axios from 'axios';
import { Navigate } from 'react-router';

interface WorkspaceProps {
  children: ReactNode;
}
const WorkSpace = ({ children }: WorkspaceProps) => {
  const { data: userData, error, isLoading, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  // swr이 컴포넌트를 넘나들면서 전역데이터스토어가 된다.
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
      <button onClick={onLogout}>저눈 workspace의 버툰입니당</button>
      {children}
    </div>
  );
};

export default WorkSpace;
