import { ProductCreate } from "@/models/entities/dto/product-create.dto.js";
import { Product } from "@/models/entities/product.entity.js";

export interface IProductsRepository {
  create(data: ProductCreate): Promise<Product>;
  save(productId: string, productData: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  searchMany(
    query: string,
    includeInactive: boolean,
    page: number,
  ): Promise<Product[]>;
}
