"use client";

import {
  KeyValue,
  KeyValueAdd,
  KeyValueItem,
  KeyValueKeyInput,
  KeyValueList,
  KeyValueRemove,
  KeyValueValueInput,
} from "@/components/ui/key-value";

export default function EnvKeyValue({
  initialEnv = {},
  onChange,
}: {
  initialEnv?: Record<string, string>;
  onChange?: (result: { env: Record<string, string> }) => void;
}) {
  // Convert object → array for KeyValue
  const defaultValue = Object.entries(initialEnv).map(([key, value], i) => ({
    id: `${i + 1}`,
    key,
    value,
  }));

  return (
    <KeyValue
      defaultValue={defaultValue}
      keyPlaceholder="KEY"
      valuePlaceholder="value"
      onValueChange={(rows) => {
        // Convert KeyValue rows → env object
        const envObject = Object.fromEntries(
          rows.map((item) => [item.key, item.value]),
        );

        onChange?.({ env: envObject });
      }}
      allowDuplicateKeys={false}
    >
      <KeyValueList>
        <KeyValueItem>
          <KeyValueKeyInput />
          <KeyValueValueInput />
          <KeyValueRemove />
        </KeyValueItem>
      </KeyValueList>

      <KeyValueAdd />
    </KeyValue>
  );
}
