import React, { useCallback } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import fetcher from '@utils/fetcher';
import { IUser, IChannel } from '@typings/db';
import useSWR from 'swr';

interface ChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

//? 컴포넌트 만들 떄, jsx 먼저 작성하고 이벤트 리스너 함수 만들기

const CreateChannelModal = ({ show, onCloseModal, setShowCreateChannelModal }: ChannelModalProps) => {
  const { workspace } = useParams<{ workspace: string }>();

  const { data: userData, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, {
    suspense: true,
    dedupingInterval: 3000,
  });

  // TODO: SWR 3항연산자를 통해 userData가 있는 경우(로그인 상태)에만 api요청을 보낸다. (조건부 요청지원)
  const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  //URL 자체가 간이 데이터 저장소가 될 수 있음(프론트가 라우터 설정을 잘 해놔야 함, 아니면 상태관리를 해줘서 저장해놔야 함)

  //config객체로 => 누가 생성하는 지는 서버가 알 수 있음
  //새로 생성할 채널명도 알 수 있음 but 어느 워크스페이스에 생성하는 지 모름
  const onCreateChannel = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      axios
        .post(
          `/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          { withCredentials: true },
        )
        .then((res) => {
          setShowCreateChannelModal(false);
          mutateChannel();
          setNewChannel('');
        })
        .catch((err) => {
          console.dir(err);
          toast.error(err.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>워크스페이스 이름</span>
          <Input id="workspace" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
