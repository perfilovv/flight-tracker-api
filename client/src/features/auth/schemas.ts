import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

export const registerSchema = z.object({
  email: z.email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
