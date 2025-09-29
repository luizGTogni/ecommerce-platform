import { InMemoryProductsRepository } from "@/models/repositories/in-memory/products-repository.in-memory.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";
import { CreateProductService } from "@/services/products/create.service.js";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

let productsRepository: IProductsRepository;
let sut: CreateProductService;
let spyCreate: MockInstance;

describe("Create Product Service (Unit)", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();

    sut = new CreateProductService(productsRepository);
    spyCreate = vi.spyOn(productsRepository, "create");
  });

  it("should be able to create a product", async () => {
    const response = await sut.execute({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 2,
      is_active: true,
    });

    expect(response.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "Product 1",
        description: null,
        category: "Product Category 1",
        price: 58.95,
        quantity: 2,
        is_active: true,
      }),
    );

    expect(spyCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Product 1",
        description: null,
        category: "Product Category 1",
        price: 58.95,
        quantity: 2,
        is_active: true,
      }),
    );
  });
});
