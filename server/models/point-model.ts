import { model, Schema } from 'mongoose';

const pointSchema = new Schema({ 
    name: { type: String, required: true },
    city: { type: String, required: true },
    category: { type: Schema.Types.Mixed, required: false }, // Can be a string or an array of strings
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    img: { type: String, required: false },
    url: { type: String, required: false },
    content: { type: String, required: false },
    rating: { type: Number },
    isFavorite: { type: Boolean },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    createdBy: {type: String, required: true}
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

export default model('mpoints', pointSchema);