import { randomUUID } from "crypto";
import { Collect } from "../../domain/collect/entities/collect";
import { CollectStatus } from "../../domain/collect/enum/collect-status.enum";
import { CollectRepository } from "../../domain/collect/repositories/collect.repository";
import {
  CollectPaginationResponseDto,
  collectPaginationResponseSchema,
  CollectResponseDto,
  collectResponseSchema,
  CreateCollectDto,
  createCollectSchema,
  DeleteCollectResponseDto,
  deleteCollectResponseSchema,
  PaginationDto,
  paginationSchema,
  SearchCollectDto,
  searchCollectSchema,
  UpdateCollectDto,
  updateCollectSchema,
} from "./dto/collect.dto";

export class CollectService {
  constructor(private readonly collectRepository: CollectRepository) {}

  async create(data: CreateCollectDto): Promise<CollectResponseDto> {
    const validData = await createCollectSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    const collect = Collect.create(
      randomUUID(),
      validData.name,
      validData.address,
      validData.packages,
      validData.priority,
      validData.status ?? CollectStatus.PENDING,
    );

    const saved = await this.collectRepository.create({
      id: collect.id,
      name: collect.name,
      address: collect.address,
      packages: collect.packages,
      priority: collect.priority,
      status: collect.status,
      createdAt: collect.createdAt,
    });

    return collectResponseSchema.validate(saved, {
      abortEarly: false,
    });
  }

  async findById(data: SearchCollectDto): Promise<CollectResponseDto | null> {
    const validData = await searchCollectSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
    const collect = await this.collectRepository.findById(validData.id);

    if (!collect) {
      return null;
    }

    return collectResponseSchema.validate(collect, {
      abortEarly: false,
    });
  }

  async findAll(
    pagination: PaginationDto = { page: 1, limit: 10 },
  ): Promise<CollectPaginationResponseDto> {
    const validPagination = await paginationSchema.validate(pagination, {
      abortEarly: false,
      stripUnknown: true,
    });
    const result = await this.collectRepository.findAll(
      validPagination.page,
      validPagination.limit,
    );
    const response = {
      items: result.items,
      page: validPagination.page,
      limit: validPagination.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / validPagination.limit),
    };

    return collectPaginationResponseSchema.validate(response, {
      abortEarly: false,
    });
  }

  async update(
    search: SearchCollectDto,
    data: UpdateCollectDto,
  ): Promise<CollectResponseDto | null> {
    const validSearch = await searchCollectSchema.validate(search, {
      abortEarly: false,
      stripUnknown: true,
    });

    const validData = await updateCollectSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    const existing = await this.collectRepository.findById(validSearch.id);

    if (!existing) {
      return null;
    }

    const updated = await this.collectRepository.update(validSearch.id, validData);

    if (!updated) {
      return null;
    }

    return collectResponseSchema.validate(updated, {
      abortEarly: false,
    });
  }

  async delete(data: SearchCollectDto): Promise<DeleteCollectResponseDto> {
    const validData = await searchCollectSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    const existing = await this.collectRepository.findById(validData.id);

    if (!existing) {
      return deleteCollectResponseSchema.validate(
        { deleted: false },
        { abortEarly: false },
      );
    }

    const deleted = await this.collectRepository.delete(validData.id);

    return deleteCollectResponseSchema.validate(
      { deleted },
      { abortEarly: false },
    );
  }
}
