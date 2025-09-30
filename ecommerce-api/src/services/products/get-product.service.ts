import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { Product } from "@/models/entities/product.entity.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";

type GetProductRequest = {
  productId: string;
  hasViewerPermission: boolean;
};

type GetProductResponse = {
  product: Product;
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

    return { product };
  }
}
