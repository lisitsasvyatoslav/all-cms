"use client";

import { Button, Card, Illustration } from "@next-app/ui-kit";

export function AuthStartPoint() {
  return (
    <Card
      description="Чтобы использовать каталог нужно войти или зарегистрироваться"
      title="Вход в систему"
      variant="surface"
    >
      <Illustration alt="Вход в систему" src="/figma-to-code/pass-x80.png" />
      <Button variant="primary">Вход в систему</Button>
      <Button variant="ghost">Зарегистрироваться</Button>
    </Card>
  );
}
