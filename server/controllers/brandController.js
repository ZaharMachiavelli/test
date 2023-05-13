const {Brand} = require('../models/models')

class BrandController {
    async create(req, res) {
        const {name} = req.body;
        const brand = await Brand.create({name});
        return res.status(201).json(brand )
    }

    async getAll(req, res) {
        const types = await Brand.findAll();
        return res.status(200).json(types)
    }

}

module.exports = new BrandController();
