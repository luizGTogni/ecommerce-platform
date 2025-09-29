import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { Product } from "@/models/entities/product.entity.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";

type EditProductRequest = {
  productId: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  quantity: number;
  is_active: boolean;
};

type EditProductResponse = {
  product: Product;
};

export class EditProductService {
  constructor(private readonly productsRepository: IProductsRepository) {}

  async execute({
    productId,
    title,
    description,
    category,
    price,
    quantity,
    is_active,
  }: EditProductRequest): Promise<EditProductResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new ResourceNotFoundError();
    }

    product.title = title;
    product.description = description;
    product.category = category;
    product.price = price;
    product.quantity = quantity;
    product.is_active = is_active;

    await this.productsRepository.save(productId, product);

    return { product };
  }
}
