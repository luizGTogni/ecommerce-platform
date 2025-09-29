import { randomUUID } from "node:crypto";
import { IProductsRepository } from "../interfaces/products-repository.interface.js";
import { ProductCreate } from "@/models/entities/dto/product-create.dto.js";
import { Product } from "@/models/entities/product.entity.js";

export class InMemoryProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  async create(data: ProductCreate) {
    const productCreated: Product = {
      id: randomUUID(),
      ...data,
    };

    this.products.push(productCreated);

    return productCreated;
  }

  async save(productId: string, productData: Product) {
    const productIndex = this.products.findIndex(
      (product) => product.id === productId,
    );
    this.products[productIndex] = productData;
  }

  async findById(id: string) {
    return this.products.find((product) => product.id === id) || null;
  }
}
