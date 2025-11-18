import { object, string } from "yup";

export default object({
  params: object({
    id: string().required("Field is required.").meta({
      example: "343182",
      description: "Cron job ID",
    }),
  }),
  response: object({
    200: object({
      status: string().meta({
        example: "ok",
      }),
    }).meta({
      description: "Cron job deleted successfully",
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
  summary: "Delete cron job",
  description: "Delete an existing cron job",
});
