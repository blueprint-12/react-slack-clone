import { Link, useLocation, useMatch } from 'react-router-dom';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

interface EachChannelProps {
  channel: IChannel;
}

const EachChannel = ({ channel }: EachChannelProps) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const date = localStorage.getItem(`${workspace}-${channel.name}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/channels/${channel.name}/unreads?after=${date}` : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspaces/${workspace}/channels/${channel.name}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, channel]);

  const match = useMatch(`/workspaces/${workspace}/channels/${channel.name}`);
  console.log('match', match);

  return (
    <Link
      key={channel.name}
      to={`/workspaces/${workspace}/channels/${channel.name}`}
      className={match ? 'selected' : undefined}
    >
      <span className={count !== undefined && count > 0 ? 'bold' : undefined}># {channel.name}</span>
      {count !== undefined && count > 0 && <span className="count">{count}</span>}
    </Link>
  );
};

export default EachChannel;
