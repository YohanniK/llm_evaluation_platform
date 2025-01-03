import { authenticatedQuery } from "./helpers";

export const list = authenticatedQuery({
  handler: async (ctx) => {
    return await ctx.db.query("models").collect();
  },
});
