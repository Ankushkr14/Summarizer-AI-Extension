const { z } = require('zod');

const registerValidators = z.object({
    email: z.string().email({
        message: "Invalid email format.",
    }),
    password: z.string().min(8,{
        message: "Password must be at least 8 characters."
    })
})

const loginVaidators = z.object({
    email: z.string().email({
        message: "Invalid email address."
    }),
    password: z.string().min(8,{
        message: 'Password must be at least 8 characters.'
    })
})

module.exports = { registerValidators, loginVaidators };