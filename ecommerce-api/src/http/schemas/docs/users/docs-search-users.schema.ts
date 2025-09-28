import {
  searchUsersQuerySchema,
  searchUsersResponseSuccessSchema,
} from "../../http/users/http-search-users.schema.js";

export const searchUsersSchema = {
  tags: ["users"],
  description: "Fetch users list",
  security: [{ bearerAuth: [] }],
  query: searchUsersQuerySchema,
  response: {
    200: searchUsersResponseSuccessSchema,
  },
};
