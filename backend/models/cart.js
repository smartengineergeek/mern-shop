const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        image: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
