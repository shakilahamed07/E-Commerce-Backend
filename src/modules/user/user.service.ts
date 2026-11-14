import type { Prisma } from "../../generated/prisma/browser.js";
import AppError from "../../middleware/AppError.js";
import prisma from "../../utils/prisma.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config/index.js";
import pickQuery from "../../utils/packQuery.js";
import { Role } from "../../generated/prisma/enums.js";
import calculatePagination from "../../helpers/pagination.helpers.js";

const createUser = async (payload: Prisma.UserCreateInput) => {
  try {
    const isExist = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
      include: {
        verification: {
          select: {
            status: true,
          },
        },
      },
    });

    if (isExist) {
      throw new AppError(
        httpStatus.CONFLICT,
        "User already exists and is verified",
      );
    }

    payload["password"] = await bcrypt.hash(
      payload.password,
      Number(config.salt_rounds) || 10,
    );

    const result = await prisma.user.create({ data: payload });

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus?.BAD_GATEWAY, error?.message);
  }
};

const getUser = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);

  const { searchTerm, ...filtersData } = filters;

  // create pipeline
  const pipeline: Prisma.UserWhereInput = {
    AND: [],
    NOT: {
      role: Role.admin,
    },
  };

  // search condition
  if (searchTerm) {
    pipeline.OR = ["name", "email", "phoneNumber", "status"].map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));
  }

  // filter query condition
  if (Object.keys(filtersData)) {
    const oldAnd = pipeline.AND;
    const oldAndArray = Array.isArray(oldAnd) ? oldAnd : oldAnd ? [oldAnd] : [];

    pipeline.AND = [
      {
        isDeleted: false,
      },

      ...oldAndArray,
      ...Object.entries(filtersData).map(([key, value]) => ({
        [key]: { equals: value },
      })),
    ];
  }

  // sorting condition
  const { page, limit, skip, sort } = calculatePagination(pagination);
  let sortArray: any[] = [];

  if (sort) {
    sortArray = sort.split(",").map((fiend) => {
      const trimmedField = fiend.trim();
      if (trimmedField.startsWith("-")) {
        return { [trimmedField.slice(1)]: "desc" };
      }
      return { [trimmedField]: "asc" };
    });
  }

  const data = await prisma.user.findMany({
    where: pipeline,
    skip,
    take: limit,
    orderBy: sortArray,
    select: {
      id: true,
      name: true,
    }
  });

  const total = await prisma.user.count({
    where: pipeline,
  });

  if (!data) {
    throw new AppError(httpStatus.NOT_FOUND, "User Data Not Found");
  }

  return {
    data,
    meta: { page, limit, total },
  };
};

const getSingleUser = async (id: any) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  return user;
};

const deleteUser = async (id: any) => {
  const Result = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  if (!Result) {
    throw new AppError(
      httpStatus.FAILED_DEPENDENCY,
      "User Delete Unsuccessfull",
    );
  }

  return Result;
};
const updateUser = async (userId: any, updateData: object) => {
  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  if (!updateUser) {
    throw new AppError(
      httpStatus.FAILED_DEPENDENCY,
      "User Update Unsuccessfull",
    );
  }

  return updateUser;
};

const userService = {
  getUser,
  createUser,
  getSingleUser,
  deleteUser,
  updateUser,
};

export default userService;
