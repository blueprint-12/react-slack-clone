import React, { FormEvent, KeyboardEventHandler, useCallback, useEffect, useRef } from 'react';
import { ChatArea, Form, MentionsTextarea, Toolbox, SendButton } from './styles';
import { IUser } from '@typings/db';
import autosize from 'autosize';

interface ChatBoxProps {
  onSubmitForm: (e: FormEvent) => void;
  chat?: string;
  onChangeChat: (e: any) => void;
  placeholder?: string;
  //   data?: IUser[];
}

//TODO: 여러 곳에서 재활용되는 로직은 상위 컴포넌트로 올려버려서 사용

const ChatBox = ({ chat, onSubmitForm, onChangeChat, placeholder }: ChatBoxProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  const onKeyDownChat: KeyboardEventHandler = useCallback((e) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e);
      }
    }
  }, []);
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeyDownChat}
          placeholder={placeholder}
          ref={textareaRef}
        />
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
