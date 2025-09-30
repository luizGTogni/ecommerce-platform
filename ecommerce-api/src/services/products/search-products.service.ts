import type { ProductRead } from "@/models/entities/dto/product-read.dto.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";

type SearchProductsRequest = {
  query: string;
  includeInactive?: boolean;
  page: number;
};

type SearchProductsResponse = {
  products: ProductRead[];
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

    const productsFormatted = products.map((product) => {
      return { ...product, price: product.price.toNumber() };
    });

    return { products: productsFormatted };
  }
}
