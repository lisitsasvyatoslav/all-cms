"use client";

import { Alert, Button, Card, Illustration, Input, Modal, PasswordInput } from "@next-app/ui-kit";

export function AuthShowModalWindow() {
  return (
    <Card variant="surface">
      <Card
        description="Чтобы использовать каталог нужно войти или зарегистрироваться"
        title="Требуется вход в систему"
        variant="surface"
      >
        <Illustration alt="Требуется вход в систему" src="/figma-to-code/pass-x80.png" />
        <Button variant="primary">Войти</Button>
        <Button variant="ghost">Зарегистрироваться</Button>
      </Card>
      <Modal open showActions={false} showCloseButton title="Войти">
        <Input placeholder="Введите ваш телефон" type="tel" />
        <PasswordInput placeholder="Введите пароль" />
        <Alert alertVariant="info" variant="soft">
          Нажимая «Войти», вы принимаете условия соглашения и политики конфиденциальности и
          подтверждаете, что проинформированы об условиях договора инвестконсультирования и
          регламента брокерского обслуживания
        </Alert>
        <Button type="submit" variant="primary">
          Войти
        </Button>
        <Button variant="ghost">Зарегистрироваться</Button>
      </Modal>
    </Card>
  );
}
