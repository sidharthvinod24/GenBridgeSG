import { z } from "zod";

const proficiencyLevelSchema = z.enum(["beginner", "intermediate", "advanced", "expert"]);

export const profileSchema = z.object({
  full_name: z.string().trim().max(100, "Name must be less than 100 characters").optional().nullable(),
  bio: z.string().trim().max(1000, "Bio must be less than 1000 characters").optional().nullable(),
  location: z.string().trim().max(100, "Location must be less than 100 characters").optional().nullable(),
  age_group: z.string().optional().nullable(),
  skills_offered: z.array(z.string().trim().max(50, "Skill name too long")).max(20, "Maximum 20 skills").optional(),
  skills_wanted: z.array(z.string().trim().max(50, "Skill name too long")).max(20, "Maximum 20 skills").optional(),
  skills_proficiency: z.record(z.string(), proficiencyLevelSchema).optional(),
});

export const messageSchema = z.object({
  content: z.string().trim().min(1, "Message cannot be empty").max(5000, "Message too long"),
});

export const validateProfile = (data: unknown) => {
  return profileSchema.safeParse(data);
};

export const validateMessage = (content: string) => {
  return messageSchema.safeParse({ content });
};
