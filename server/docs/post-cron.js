import { object, string } from "yup";

export default object({
  body: object({
    name: string().required("Field is required.").meta({
      example: "Weekly Report Generator",
    }),
    expression: string().required("Field is required.").meta({
      example: "0 0 * * *",
      description: "Cron expression (e.g., * * * * * for every minute)",
    }),
    content: string().meta({
      description: "JavaScript code to execute",
      example:
        "console.info('Generating weekly report...'); // Generate report logic here",
    }),
  }),
  response: object({
    200: object({
      status: string().meta({
        example: "ok",
      }),
    }).meta({
      description: "Cron job created successfully",
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
  summary: "Create cron job",
  description: "Create a new cron job",
});
