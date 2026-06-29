import { Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

import { IconButton } from "./icon-button";

export interface ModalProps {
  /** Только панель контента — для скриншотов каталога (без overlay). */
  preview?: boolean;
  /** Открыть диалог без триггера — для превью и Storybook. */
  open?: boolean;
  /** Заголовок модального окна. */
  title: ReactNode;
  /** Поясняющий текст под заголовком. */
  description?: ReactNode;
  /** Дополнительное содержимое между описанием и кнопками. */
  children?: ReactNode;
  /** Элемент, по клику открывающий modal (обычно кнопка). */
  trigger?: ReactNode;
  /** Кнопка закрытия (×) в шапке — как dismiss в макете. */
  showCloseButton?: boolean;
  /** Стандартные кнопки «Отмена» / «Подтвердить» внизу (по умолчанию true). */
  showActions?: boolean;
  /** Колбэк при закрытии диалога. */
  onClose?: () => void;
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path d="M3 3L12 12M12 3L3 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ModalHeader({
  title,
  description,
  showCloseButton,
}: Pick<ModalProps, "title" | "description" | "showCloseButton">) {
  return (
    <Flex direction="column" gap="1" mb="3">
      <Flex align="start" justify="between" gap="3">
        <Heading size="5" style={{ flex: 1 }}>
          {title}
        </Heading>
        {showCloseButton ? (
          <Dialog.Close>
            <IconButton type="button" variant="ghost" size="sm" label="Закрыть">
              <CloseIcon />
            </IconButton>
          </Dialog.Close>
        ) : null}
      </Flex>
      {description ? (
        <Text as="p" size="2" color="gray">
          {description}
        </Text>
      ) : null}
    </Flex>
  );
}

function ModalActions() {
  return (
    <Flex gap="3" mt="4" justify="end">
      <Dialog.Close>
        <Button variant="soft" color="gray">
          Отмена
        </Button>
      </Dialog.Close>
      <Dialog.Close>
        <Button>Подтвердить</Button>
      </Dialog.Close>
    </Flex>
  );
}

export function Modal({
  preview,
  open,
  title,
  description,
  children,
  trigger,
  showCloseButton = false,
  showActions = true,
  onClose,
}: ModalProps) {
  if (preview) {
    return (
      <Flex
        direction="column"
        p="5"
        style={{
          width: "100%",
          maxWidth: 456,
          background: "var(--color-panel-solid)",
          borderRadius: "var(--radius-4)",
          boxShadow: "var(--shadow-5)",
        }}
      >
        <ModalHeader title={title} description={description} showCloseButton={showCloseButton} />
        {children}
        {showActions ? <ModalActions /> : null}
      </Flex>
    );
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose?.();
      }}
    >
      {trigger ? <Dialog.Trigger>{trigger}</Dialog.Trigger> : null}
      <Dialog.Content maxWidth="456px">
        {showCloseButton ? (
          <>
            <Flex align="start" justify="between" gap="3" mb="3">
              <Dialog.Title size="5" style={{ flex: 1, margin: 0 }}>
                {title}
              </Dialog.Title>
              <Dialog.Close>
                <IconButton type="button" variant="ghost" size="sm" label="Закрыть">
                  <CloseIcon />
                </IconButton>
              </Dialog.Close>
            </Flex>
            {description ? (
              <Dialog.Description size="2" mb="3">
                {description}
              </Dialog.Description>
            ) : null}
            {children}
            {showActions ? <ModalActions /> : null}
          </>
        ) : (
          <>
            <Dialog.Title>{title}</Dialog.Title>
            {description ? <Dialog.Description size="2">{description}</Dialog.Description> : null}
            {children}
            {showActions ? <ModalActions /> : null}
          </>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
