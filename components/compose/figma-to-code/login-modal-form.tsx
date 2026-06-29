"use client";

import { Alert, Button, Input, Modal, PasswordInput } from "@next-app/ui-kit";

export function LoginModalForm() {
  return (
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
  );
}
