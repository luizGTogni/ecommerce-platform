import { prisma } from "@/configs/prisma.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";
import { PrismaProductsRepository } from "@/models/repositories/prisma/products-repository.prisma.js";
import { GetProductService } from "@/services/products/get-product.service.js";
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
let sut: GetProductService;
let spyFindById: MockInstance;

describe("Get Product Service (Integration)", () => {
  beforeEach(() => {
    productsRepository = new PrismaProductsRepository();
    sut = new GetProductService(productsRepository);
    spyFindById = vi.spyOn(productsRepository, "findById");
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
  });

  it("should be able to get a product", async () => {
    const product = await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 2,
      is_active: true,
    });

    const response = await sut.execute({
      productId: product.id,
      hasViewerPermission: false,
    });

    expect(spyFindById).toBeCalledWith(product.id);
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
  });

  it("should not be able to get a product if product not exists", async () => {
    await expect(() =>
      sut.execute({
        productId: "product-not-exists",
        hasViewerPermission: false,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to get a product if product not active and don't viewer permission", async () => {
    const product = await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 2,
      is_active: false,
    });

    await expect(() =>
      sut.execute({
        productId: product.id,
        hasViewerPermission: false,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to get a product if product not active and has viewer permission", async () => {
    const productCreated = await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 2,
      is_active: false,
    });

    const { product } = await sut.execute({
      productId: productCreated.id,
      hasViewerPermission: true,
    });

    expect(product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "Product 1",
        description: null,
        category: "Product Category 1",
        price: 58.95,
        quantity: 2,
        is_active: false,
      }),
    );
  });
});
