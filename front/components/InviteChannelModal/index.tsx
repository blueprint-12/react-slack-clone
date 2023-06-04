import React, { useCallback } from 'react';
import Modal from '@components/Modal';
import { Label, Input, Button } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import { IUser, IChannel } from '@typings/db';
import useSWR from 'swr';
import { useParams } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';

//? 인터페이스
interface InviteChannelProps {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal = ({ show, onCloseModal, setShowInviteChannelModal }: InviteChannelProps) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { mutate: mutateMember } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );
  console.log('onClick show', show);

  const onInviteMember = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios
        .post(`/api/workspaces/${workspace}/members`, {
          email: newMember,
        })
        .then(() => {
          mutateMember();
          setShowInviteChannelModal(false);
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember, channel, mutateMember, setShowInviteChannelModal, setNewMember],
  );
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
