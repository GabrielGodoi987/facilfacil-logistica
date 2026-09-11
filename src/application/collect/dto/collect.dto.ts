import * as yup from "yup";
import {
  Collect,
  CollectPriority,
  CollectStatus,
} from "../../../domain/collect/entities/collect";

export interface CreateCollectDto {
  name: string;
  address: string;
  packages: string;
  priority: CollectPriority;
  status?: CollectStatus;
}

export interface UpdateCollectDto {
  name?: string;
  address?: string;
  packages?: string;
  priority?: CollectPriority;
  status?: CollectStatus;
}

export interface SearchCollectDto {
  id: string;
}

export interface PaginationDto {
  page: number;
  limit: number;
}

export interface CollectResponseDto extends Collect {}

export interface CollectPaginationResponseDto {
  items: CollectResponseDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DeleteCollectResponseDto {
  deleted: boolean;
}

const priorityValues = Object.values(CollectPriority);
const statusValues = Object.values(CollectStatus);

export const createCollectSchema: yup.ObjectSchema<CreateCollectDto> = yup
  .object({
    name: yup.string().trim().required("Nome e obrigatorio.").max(100),
    address: yup.string().trim().required("Endereco e obrigatorio."),
    packages: yup.string().trim().required("Pacotes e obrigatorio."),
    priority: yup
      .mixed<CollectPriority>()
      .oneOf(priorityValues, "Prioridade invalida.")
      .required("Prioridade e obrigatoria."),
    status: yup
      .mixed<CollectStatus>()
      .oneOf(statusValues, "Status invalido.")
      .optional(),
  })
  .required();

export const updateCollectSchema: yup.ObjectSchema<UpdateCollectDto> = yup
  .object({
    name: yup.string().trim().max(100).optional(),
    address: yup.string().trim().optional(),
    packages: yup.string().trim().optional(),
    priority: yup
      .mixed<CollectPriority>()
      .oneOf(priorityValues, "Prioridade invalida.")
      .optional(),
    status: yup
      .mixed<CollectStatus>()
      .oneOf(statusValues, "Status invalido.")
      .optional(),
  })
  .test("has-fields", "Informe ao menos um campo para atualizar.", (value) =>
    Boolean(value && Object.keys(value).length > 0),
  )
  .required();

export const searchCollectSchema: yup.ObjectSchema<SearchCollectDto> = yup
  .object({
    id: yup.string().trim().uuid("Id da coleta invalido.").required(),
  })
  .required();

export const paginationSchema: yup.ObjectSchema<PaginationDto> = yup
  .object({
    page: yup.number().integer().min(1).default(1).required(),
    limit: yup.number().integer().min(1).max(100).default(10).required(),
  })
  .required();

export const collectResponseSchema: yup.ObjectSchema<CollectResponseDto> = yup
  .object({
    id: yup.string().uuid().required(),
    name: yup.string().required(),
    address: yup.string().required(),
    packages: yup.string().required(),
    priority: yup.mixed<CollectPriority>().oneOf(priorityValues).required(),
    status: yup.mixed<CollectStatus>().oneOf(statusValues).required(),
    createdAt: yup.date().required(),
  })
  .required();

export const collectPaginationResponseSchema: yup.ObjectSchema<CollectPaginationResponseDto> =
  yup
    .object({
      items: yup.array().of(collectResponseSchema).required(),
      page: yup.number().integer().min(1).required(),
      limit: yup.number().integer().min(1).required(),
      total: yup.number().integer().min(0).required(),
      totalPages: yup.number().integer().min(0).required(),
    })
    .required();

export const deleteCollectResponseSchema: yup.ObjectSchema<DeleteCollectResponseDto> =
  yup
    .object({
      deleted: yup.boolean().required(),
    })
    .required();
