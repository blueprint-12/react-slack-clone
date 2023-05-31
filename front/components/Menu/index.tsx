import React, { CSSProperties, ReactNode, useCallback } from 'react';

interface MenuProps {
  children: ReactNode;
  show: boolean;
  onCloseModal: () => void;
  style: CSSProperties;
  closeButton?: boolean;
}
const Menu = ({ children, show, onCloseModal, style, closeButton = true }: MenuProps) => {
  if (!show) return null;

  return <div>{children}</div>;
};

export default Menu;
