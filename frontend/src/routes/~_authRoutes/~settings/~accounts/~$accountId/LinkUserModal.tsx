import { Button, TextInput } from "@mantine/core";
import { useState } from "react";
import { ConfirmLink } from "./ConfirmLink";

export function LinkUserModal({ accountId }: { accountId: string }) {
  const [email, setEmail] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <>
      <TextInput
        label="Email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setIsConfirming(false);
        }}
      />
      <Button
        className="mt-4 w-full"
        color="primary"
        onClick={() => {
          setIsConfirming(true);
        }}
        disabled={isConfirming}
      >
        Look up user
      </Button>
      {isConfirming && (
        <div className="mt-8">
          <ConfirmLink email={email} accountId={accountId} />
        </div>
      )}
    </>
  );
}
