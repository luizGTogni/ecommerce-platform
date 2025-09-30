import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import type { ProductRead } from "@/models/entities/dto/product-read.dto.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";

type GetProductRequest = {
  productId: string;
  hasViewerPermission: boolean;
};

type GetProductResponse = {
  product: ProductRead;
};

export class GetProductService {
  constructor(private readonly productsRepository: IProductsRepository) {}

  async execute({
    productId,
    hasViewerPermission,
  }: GetProductRequest): Promise<GetProductResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new ResourceNotFoundError();
    }

    if (!product.is_active && !hasViewerPermission) {
      throw new ResourceNotFoundError();
    }

    return {
      product: {
        ...product,
        price: product.price.toNumber(),
      },
    };
  }
}
