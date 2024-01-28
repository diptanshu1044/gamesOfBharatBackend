import { z } from 'zod'
import { usernameRegex } from '../constants.js'

const UserValidator = z.object({
  username: z
    .string()
    .toLowerCase()
    .trim()
    .min(3)
    .max(25)
    .refine(value => usernameRegex.test(value), {
      message: "Username should not contain any special characters other than '_'"}),
  email: z
    .string()
    .toLowerCase()
    .email(),
  fullName: z
    .string()
    .trim(),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Password should be 6 characters long'}),
  // phoneNumber: z
  //   .string()
  //   .length(10),
})

export { UserValidator };