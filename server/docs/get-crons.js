import { object, string, number, array, boolean } from "yup";

export default object({
  query: object({
    page: number().meta({
      example: 0,
      minimum: 0,
    }),
    pageSize: number().meta({
      example: 20,
      minimum: 1,
      maximum: 1000,
    }),
    sort: string().meta({
      example: "created_at:asc",
      pattern: "^[a-zA-Z_]+:(asc|desc)$",
    }),
  }),
  response: object({
    200: object({
      data: array().of(
        object({
          id: string().meta({
            example: "343182",
          }),
          name: string().meta({
            example: "Cron Job 1",
          }),
          expression: string().meta({
            example: "0 0 * * *",
          }),
          active: boolean().meta({
            example: true,
          }),
          content: string().meta({
            example: "This is a cron job",
          }),
        })
      ),
      meta: object({
        page: number().meta({
          example: 0,
        }),
        pageSize: number().meta({
          example: 20,
        }),
        count: number().meta({
          example: 100,
        }),
      }),
    }).meta({
      description: "Login successful",
    }),
    500: object({
      error: string().meta({
        example: "Something went wrong",
      }),
    }).meta({
      description: "Something went wrong",
    }),
  }),
}).meta({
  tags: ["Crons"],
  summary: "Get all cron jobs",
  description: "Retrieve all cron jobs with pagination and sorting",
});
