import { z } from "zod";

const LinkSchema = z.object({
    title: z.string(),
    href: z.string(),
});

export type Link = z.infer<typeof LinkSchema>;

export { LinkSchema };
