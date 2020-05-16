const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        creator: {
            type: String,
            default: 'avinash'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
