import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useEffect, VFC } from 'react';
import { useParams } from 'react-router';
import { Link, useLocation, useMatch } from 'react-router-dom';
import useSWR from 'swr';

interface EachDMProps {
  member: IUser;
  isOnline: boolean;
}
const EachDM = ({ member, isOnline }: EachDMProps) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}` : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspaces/${workspace}/dm/${member.id}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, member]);

  const match = useMatch(`/workspaces/${workspace}/dm/${member.id}`);

  return (
    <Link key={member.id} to={`/workspaces/${workspace}/dm/${member.id}`} className={match ? 'selected' : undefined}>
      <i
        className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
          match && isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
        }`}
        aria-hidden="true"
        data-qa="presence_indicator"
        data-qa-presence-self="false"
        data-qa-presence-active="false"
        data-qa-presence-dnd="false"
      />
      <span className={count && count > 0 ? 'bold' : undefined}>{member.nickname}</span>
      {member.id === userData?.id && <span> (나)</span>}
      {(count && count > 0 && <span className="count">{count}</span>) || null}
    </Link>
  );
};

export default EachDM;
