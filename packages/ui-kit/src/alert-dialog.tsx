import { AlertDialog as RadixAlertDialog, Button, Flex } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type AlertDialogProps = ComponentProps<typeof RadixAlertDialog.Root>;

export function AlertDialog(_props: AlertDialogProps) {
  return (
    <RadixAlertDialog.Root>
      <RadixAlertDialog.Trigger>
        <Button>Open</Button>
      </RadixAlertDialog.Trigger>
      <RadixAlertDialog.Content maxWidth="450px">
        <RadixAlertDialog.Title>Confirm</RadixAlertDialog.Title>
        <RadixAlertDialog.Description size="2">Are you sure?</RadixAlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <RadixAlertDialog.Cancel><Button variant="soft" color="gray">Cancel</Button></RadixAlertDialog.Cancel>
          <RadixAlertDialog.Action><Button>Confirm</Button></RadixAlertDialog.Action>
        </Flex>
      </RadixAlertDialog.Content>
    </RadixAlertDialog.Root>
  );
}
