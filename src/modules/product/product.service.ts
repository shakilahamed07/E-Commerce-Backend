import AppError from "../../middleware/AppError.js";
import prisma from "../../utils/prisma.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config/index.js";
import type { Prisma } from "../../generated/prisma/browser.js";
import pickQuery from "../../utils/packQuery.js";
import calculatePagination from "../../helpers/pagination.helpers.js";

const createProduct = async (Payload: any) => {
  const { images, discount, ...others } = Payload;

  const newProduct = await prisma.products.create({
    data: {
      ...others,

      //save image table
      images:
        images && images.length > 0
          ? {
              create: images.map((url: string) => ({ url })),
            }
          : undefined,

      //save discount table
      discounts: discount
        ? {
            create: {
              discount: parseFloat(discount.discount),
              startDate: new Date(discount.startDate),
              endDate: new Date(discount.endDate),
            },
          }
        : undefined,
    },
    include: {
      images: true,
      category: true,
      subCategory: true,
      brand: true,
      discounts: true,
    },
  });

  if (!newProduct) {
    throw new AppError(
      httpStatus.FAILED_DEPENDENCY,
      "Product creation Unsuccessful",
    );
  }

  return newProduct;
};

const getProducts = async (query: Record<string, unknown>) => {
  const { pagination, filters } = await pickQuery(query);

  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;

  // pipeline object
  const pipeline: Prisma.ProductsWhereInput = {
    AND: [],
    NOT: {
      isDeleted: true,
    },
  };

  // search condition
  if (searchTerm) {
    pipeline.OR = ["name", "description"].map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));
  }

  // 2. Price Range Filter Condition
    if (minPrice !== undefined || maxPrice !== undefined) {
        const oldAnd = pipeline.AND;
        const oldAndArray = Array.isArray(oldAnd) ? oldAnd : oldAnd ? [oldAnd] : [];

        pipeline.AND = [
            ...oldAndArray,
            {
                price: {
                    ...{ gte: Number(minPrice) },
                    ...{ lte: Number(maxPrice) },
                }
            }
        ];
    }

  // filter condition
  if (Object.keys(filtersData).length > 0) {
    const oldAnd = pipeline.AND;
    const oldAndArray = Array.isArray(oldAnd) ? oldAnd : oldAnd ? [oldAnd] : [];

    pipeline.AND = [
      
      ...oldAndArray,

      ...Object.entries(filtersData).map(([key, value]) => ({
        [key]: { equals: value },
      })),
    ];
  }

  // sort condition
  const { page, limit, skip, sort } = calculatePagination(pagination);
  let sortArray: any[] = [];

  if (sort) {
    sortArray = sort.split(",").map((fiend) => {
      const trimmedFiend = fiend.trim();
      if (trimmedFiend.startsWith("-")) {
        return { [trimmedFiend.slice(1)]: "desc" };
      }
      return { [trimmedFiend]: "asc" };
    });
  }

  const products = await prisma.products.findMany({
    where: pipeline,
    skip,
    take: limit,
    orderBy: sortArray,
    include: {
      images: true,
      category: true,
      subCategory: true,
      brand: true,
      discounts: true,
    },
  });

  const total = await prisma.products.count({
    where: pipeline,
  });

  if (!products) {
    throw new AppError(httpStatus.NOT_FOUND, "Products Data Not Found");
  }

  return {
    products,
    meta: { page, limit, total },
  };
};

const deleteProduct = async (id:string) => {
  const Result = await prisma.products.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });

  if (!Result) {
    throw new AppError(
      httpStatus.FAILED_DEPENDENCY,
      "Product Delete Unsuccessfull",
    );
  }

  return {
    id: Result.id,
    email: Result.name,
  };
};

const productService = {
  createProduct,
  getProducts,
  deleteProduct,
};

export default productService;
