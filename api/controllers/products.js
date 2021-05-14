const Product = require('../../models/Product');

module.exports = {
    getAll: async (req, res) => {
        try {
            const products = await Product.find({});
            res.status(200).json({ products });
        } catch (error) {
            res.status(500).json({ error });   
        }
    },
    addProduct: async (req, res) => {
        try {
            const { name, price, description } = req.body;
            const newProduct = new Product({
                name,
                price,
                description
            })
            await newProduct.save();

            res.status(201).json({ newProduct });
        } catch (error) {
            res.status(500).json({ error });
        }
    },
    getProductById: async (req,res) => {
        try {
            const id = req.params.id;
            const product = await Product.findById(id);
            res.status(200).json({ product });
        } catch (error) {
            res.status(500).json({ error });
        }
    }
}