import { createInterface } from "readline/promises";
import * as yup from "yup";
import { CollectPriority } from "../../domain/collect/enum/collect-priority.enum";
import { CollectStatus } from "../../domain/collect/enum/collect-status.enum";

export type Terminal = ReturnType<typeof createInterface>;

const prioritySchema = yup
  .mixed<CollectPriority>()
  .oneOf(Object.values(CollectPriority), "Prioridade invalida.")
  .required("Prioridade e obrigatoria.");

const statusSchema = yup
  .mixed<CollectStatus>()
  .oneOf(Object.values(CollectStatus), "Status invalido.")
  .required("Status e obrigatorio.");

export const ask = async (terminal: Terminal, label: string): Promise<string> =>
  (await terminal.question(label)).trim();

export const pause = async (terminal: Terminal): Promise<void> => {
  await terminal.question("\nPressione Enter para voltar ao menu.");
};

export const askPriority = async (terminal: Terminal): Promise<CollectPriority> => {
  console.log("\nPrioridades: low, medium, high");
  const value = await ask(terminal, "Prioridade: ");
  return prioritySchema.validate(value);
};

export const askStatus = async (
  terminal: Terminal,
  defaultValue?: CollectStatus,
): Promise<CollectStatus> => {
  console.log("\nStatus: pending, in_progress, completed, canceled");
  const value = await ask(
    terminal,
    `Status${defaultValue ? ` [${defaultValue}]` : ""}: `,
  );
  return statusSchema.validate(value || defaultValue);
};

export const askId = async (terminal: Terminal): Promise<string> =>
  ask(terminal, "ID da coleta: ");

export const askPriorityOptional = async (
  terminal: Terminal,
  value: string,
): Promise<CollectPriority | undefined> => {
  if (!value) return undefined;
  return prioritySchema.validate(value);
};

export const askStatusOptional = async (
  terminal: Terminal,
  value: string,
): Promise<CollectStatus | undefined> => {
  if (!value) return undefined;
  return statusSchema.validate(value);
};

export { prioritySchema, statusSchema };
