import { randomUUID } from "node:crypto";
import { IProductsRepository } from "../interfaces/products-repository.interface.js";
import { ProductCreate } from "@/models/entities/dto/product-create.dto.js";
import { Product } from "@/models/entities/product.entity.js";

export class InMemoryProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  private NUMBERS_BY_PAGE = 20;

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

  async searchMany(query: string, includeInactive: boolean, page: number) {
    const initialIndex = (page - 1) * this.NUMBERS_BY_PAGE;
    const untilIndex = page * this.NUMBERS_BY_PAGE;

    return this.products
      .filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description
            ?.toLocaleLowerCase()
            .includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()),
      )
      .filter((product) => {
        if (
          (includeInactive === undefined || includeInactive === false) &&
          product.is_active === true
        ) {
          return product;
        }

        if (includeInactive === true) {
          return product;
        }
      })
      .slice(initialIndex, untilIndex);
  }
}
