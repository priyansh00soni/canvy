import { z } from 'zod'

const hexColor = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Must be a hex color like #ff0000')

const rectangleSchema = z.object({
    id: z.string(),
    type: z.literal('rect'),
    x: z.number(),
    y: z.number(),
    rotation: z.number().default(0),
    fill: hexColor.optional(),
    width: z.number().positive(),
    height: z.number().positive(),
})

const circleSchema = z.object({
    id: z.string(),
    type: z.literal('circle'),
    x: z.number(),
    y: z.number(),
    rotation: z.number().default(0),
    fill: hexColor.optional(),
    radius: z.number().positive(),
})

const textSchema = z.object({
    id: z.string(),
    type: z.literal('text'),
    x: z.number(),
    y: z.number(),
    rotation: z.number().default(0),
    fill: hexColor.optional(),
    text: z.string().min(1).max(500),
    fontSize: z.number().positive().optional(),
    width: z.number().positive().optional(),
})

const ellipseSchema = z.object({
    id: z.string(),
    type: z.literal('ellipse'),
    x: z.number(),
    y: z.number(),
    rotation: z.number().default(0),
    fill: hexColor.optional(),
    radiusX: z.number().positive(),
    radiusY: z.number().positive(),
})

const triangleSchema = z.object({
    id: z.string(),
    type: z.literal('triangle'),
    x: z.number(),
    y: z.number(),
    rotation: z.number().default(0),
    fill: hexColor.optional(),
    radius: z.number().positive(),
})

const starSchema = z.object({
    id: z.string(),
    type: z.literal('star'),
    x: z.number(),
    y: z.number(),
    rotation: z.number().default(0),
    fill: hexColor.optional(),
    innerRadius: z.number().positive(),
    outerRadius: z.number().positive(),
    numPoints: z.number().int().min(3).max(20).optional(),
})

const penSchema = z.object({
    id: z.string(),
    type: z.literal('pen'),
    x: z.number(),
    y: z.number(),
    rotation: z.number().default(0),
    points: z.array(z.number()).min(4),
    stroke: hexColor.optional(),
    strokeWidth: z.number().positive().optional(),
})

const shapeSchema = z.union([
    rectangleSchema,
    circleSchema,
    textSchema,
    ellipseSchema,
    triangleSchema,
    starSchema,
    penSchema,
])

export const createCanvasSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    width: z.number().int().min(100).max(5000).default(800),
    height: z.number().int().min(100).max(5000).default(600),
    elements: z.array(shapeSchema).max(500).default([]),
})

export const updateCanvasSchema = z.object({
        name: z.string().trim().min(1).max(100),
        width: z.number().int().min(100).max(5000),
        height: z.number().int().min(100).max(5000),
        elements: z.array(shapeSchema).max(500),
    }).partial()
    .refine((data) => Object.keys(data).length > 0, { message: 'Send at least one field to update' })
