import { prisma } from "@/configs/prisma.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";
import { PrismaProductsRepository } from "@/models/repositories/prisma/products-repository.prisma.js";
import { EditProductService } from "@/services/products/edit-product.service.js";
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
let sut: EditProductService;
let spyFindById: MockInstance;

describe("Edit Product Service (Integration)", () => {
  beforeEach(() => {
    productsRepository = new PrismaProductsRepository();
    sut = new EditProductService(productsRepository);
    spyFindById = vi.spyOn(productsRepository, "findById");
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
  });

  it("should be able to edit a product", async () => {
    const productCreated = await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 2,
      is_active: true,
    });

    const response = await sut.execute({
      productId: productCreated.id,
      title: "Product 2",
      description: null,
      category: "Product Category 2",
      price: 58.95,
      quantity: 2,
      is_active: false,
    });

    expect(response.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "Product 2",
        description: null,
        category: "Product Category 2",
        price: 58.95,
        quantity: 2,
        is_active: false,
      }),
    );

    expect(spyFindById).toHaveBeenCalledWith(productCreated.id);
  });

  it("should not be able to edit a product if product not exists", async () => {
    await expect(() =>
      sut.execute({
        productId: "product_not_exists",
        title: "Product 2",
        description: null,
        category: "Product Category 2",
        price: 58.95,
        quantity: 2,
        is_active: false,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
