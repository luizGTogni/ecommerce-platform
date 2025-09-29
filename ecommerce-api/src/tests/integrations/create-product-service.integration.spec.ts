import { prisma } from "@/configs/prisma.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";
import { PrismaProductsRepository } from "@/models/repositories/prisma/products-repository.prisma.js";
import { CreateProductService } from "@/services/products/create.service.js";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from "vitest";

let productsRepository: IProductsRepository;
let sut: CreateProductService;
let spyCreate: MockInstance;

describe("Create Product Service (Integration)", () => {
  beforeEach(() => {
    productsRepository = new PrismaProductsRepository();

    sut = new CreateProductService(productsRepository);
    spyCreate = vi.spyOn(productsRepository, "create");
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
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
