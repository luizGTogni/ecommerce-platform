import { InMemoryProductsRepository } from "@/models/repositories/in-memory/products-repository.in-memory.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";
import { SearchProductsService } from "@/services/products/search-products.service.js";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

let productsRepository: IProductsRepository;
let sut: SearchProductsService;
let spySearchMany: MockInstance;

describe("Search Product Service (Unit)", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new SearchProductsService(productsRepository);
    spySearchMany = vi.spyOn(productsRepository, "searchMany");
  });

  it("should be able to search for products", async () => {
    await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 2,
      is_active: true,
    });

    await productsRepository.create({
      title: "Product 2",
      description: "Product Description 2",
      category: "Product Category 2",
      price: 28.0,
      quantity: 10,
      is_active: false,
    });

    await productsRepository.create({
      title: "Product 3",
      description: null,
      category: "Product Category 3",
      price: 43.95,
      quantity: 0,
      is_active: true,
    });

    const response = await sut.execute({ query: "Product", page: 1 });

    expect(spySearchMany).toBeCalledWith("Product", false, 1);
    expect(response.products).toHaveLength(2);
    expect(response.products).toEqual([
      expect.objectContaining({ title: "Product 1" }),
      expect.objectContaining({ title: "Product 3" }),
    ]);
  });

  it("should be able to fetch paginated products search", async () => {
    for (let i = 1; i <= 22; i++) {
      await productsRepository.create({
        title: `Product ${i}`,
        description: null,
        category: `Product Category ${i}`,
        price: 58.95,
        quantity: 2,
        is_active: true,
      });
    }

    const response = await sut.execute({ query: "Product", page: 2 });

    expect(response.products).toHaveLength(2);
    expect(response.products).toEqual([
      expect.objectContaining({ title: "Product 21" }),
      expect.objectContaining({ title: "Product 22" }),
    ]);
  });

  it("should be able to search for products by include inactive", async () => {
    await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 2,
      is_active: true,
    });

    await productsRepository.create({
      title: "Product 2",
      description: "Product Description 2",
      category: "Product Category 2",
      price: 28.0,
      quantity: 10,
      is_active: false,
    });

    await productsRepository.create({
      title: "Product 3",
      description: null,
      category: "Product Category 3",
      price: 43.95,
      quantity: 0,
      is_active: true,
    });

    const response = await sut.execute({
      query: "",
      page: 1,
      includeInactive: true,
    });

    expect(spySearchMany).toBeCalledWith("", true, 1);
    expect(response.products).toHaveLength(3);
    expect(response.products).toEqual([
      expect.objectContaining({ title: "Product 1" }),
      expect.objectContaining({ title: "Product 2" }),
      expect.objectContaining({ title: "Product 3" }),
    ]);
  });
});
