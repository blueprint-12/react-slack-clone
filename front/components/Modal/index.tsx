import React, { useCallback } from 'react';
import { CreateModal, CloseModalButton } from './styles';
interface ModalProps {
  children: React.ReactNode;
  show: boolean;
  onCloseModal: () => void;
}

// ? 메뉴는 클릭 시, 바로 뜨는 것
// ? 모달은 클릭 시, 전체 팝업창처럼 뜨는 것
const Modal = ({ children, show, onCloseModal }: ModalProps) => {
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
