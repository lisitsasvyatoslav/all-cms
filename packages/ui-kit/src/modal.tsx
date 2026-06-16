import { Button, Card, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

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
}

export function Modal({
  preview,
  open,
  title,
  description,
  children,
  trigger,
}: ModalProps) {
  const actions = (
    <Flex gap="3" mt="4" justify="end">
      <Button variant="soft" color="gray">
        Отмена
      </Button>
      <Button>Подтвердить</Button>
    </Flex>
  );

  if (preview) {
    return (
      <Card size="3" style={{ width: "100%", maxWidth: 420 }}>
        <Heading size="5" mb="2">
          {title}
        </Heading>
        {description ? (
          <Text as="p" size="2" color="gray" mb="3">
            {description}
          </Text>
        ) : null}
        {children}
        {actions}
      </Card>
    );
  }

  return (
    <Dialog.Root open={open}>
      {trigger ? <Dialog.Trigger>{trigger}</Dialog.Trigger> : null}
      <Dialog.Content maxWidth="420px">
        <Dialog.Title>{title}</Dialog.Title>
        {description ? <Dialog.Description size="2">{description}</Dialog.Description> : null}
        {children}
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
      </Dialog.Content>
    </Dialog.Root>
  );
}
