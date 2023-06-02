import React, { CSSProperties, ReactNode, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface MenuProps {
  children: ReactNode;
  show: boolean;
  onCloseModal: (e: any) => void;
  style: CSSProperties;
}

// FC<Props> interface Props => react 18 deprecated FC
const Menu = ({ children, show, onCloseModal, style }: MenuProps) => {
  // TODO: 자식에서 클릭이벤트 발생시 부모로 이벤트 버블링 막기
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {show && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

export default Menu;
