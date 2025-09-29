import { Product } from "@/models/entities/product.entity.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";

type CreateProductRequest = {
  title: string;
  description: string | null;
  category: string;
  price: number;
  quantity: number;
  is_active: boolean;
};

type CreateProductResponse = {
  product: Product;
};

export class CreateProductService {
  constructor(private readonly productsRepository: IProductsRepository) {}

  async execute(data: CreateProductRequest): Promise<CreateProductResponse> {
    const product = await this.productsRepository.create(data);

    return { product };
  }
}
