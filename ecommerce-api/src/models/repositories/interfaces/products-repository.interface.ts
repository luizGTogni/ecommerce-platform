import { ProductCreate } from "@/models/entities/dto/product-create.dto.js";
import { Product } from "@/models/entities/product.entity.js";

export interface IProductsRepository {
  create(data: ProductCreate): Promise<Product>;
}
