import { Product } from "@/models/entities/product.entity.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";

type SearchProductsRequest = {
  query: string;
  includeInactive?: boolean;
  page: number;
};

type SearchProductsResponse = {
  products: Product[];
};

export class SearchProductsService {
  constructor(private readonly productsRepository: IProductsRepository) {}

  async execute({
    query,
    includeInactive = false,
    page,
  }: SearchProductsRequest): Promise<SearchProductsResponse> {
    const products = await this.productsRepository.searchMany(
      query,
      includeInactive ? includeInactive : false,
      page,
    );

    return { products };
  }
}
