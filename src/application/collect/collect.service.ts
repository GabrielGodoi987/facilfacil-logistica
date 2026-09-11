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
    const collect = await this.collectRepository.create(validData);

    return collectResponseSchema.validate(collect, {
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
    const collect = await this.collectRepository.update(
      validSearch.id,
      validData,
    );

    if (!collect) {
      return null;
    }

    return collectResponseSchema.validate(collect, {
      abortEarly: false,
    });
  }

  async delete(data: SearchCollectDto): Promise<DeleteCollectResponseDto> {
    const validData = await searchCollectSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
    const response = {
      deleted: await this.collectRepository.delete(validData.id),
    };

    return deleteCollectResponseSchema.validate(response, {
      abortEarly: false,
    });
  }
}
