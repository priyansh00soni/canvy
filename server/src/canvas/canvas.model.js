import mongoose, { Schema } from 'mongoose'

const elementSchema = new Schema(
    {
        id: { type: String, required: true },
        type: {
            type: String,
            enum: ['rect', 'circle', 'text', 'ellipse', 'triangle', 'star', 'pen'],
            required: true,
        },
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        rotation: { type: Number, default: 0 },
        fill: { type: String, default: '#4f46e5' },

        // rect, text
        width: { type: Number },
        height: { type: Number },

        // circle, triangle
        radius: { type: Number },

        // ellipse
        radiusX: { type: Number },
        radiusY: { type: Number },

        // star
        innerRadius: { type: Number },
        outerRadius: { type: Number },
        numPoints: { type: Number, default: 5 },

        // pen (free draw)
        points: { type: [Number] },
        stroke: { type: String },
        strokeWidth: { type: Number },

        // text
        text: { type: String },
        fontSize: { type: Number, default: 20 },
    },
    { _id: false }
)

const canvasSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        width: { type: Number, default: 800, min: 1 },
        height: { type: Number, default: 600, min: 1 },
        elements: { type: [elementSchema], default: [] },
    },
    { timestamps: true }
)

export const Canvas = mongoose.model('Canvas', canvasSchema)