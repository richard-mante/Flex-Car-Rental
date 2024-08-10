const CarModel = require('../models/car');

exports.getByBrandName = async (brandName) => {
    const cars = await CarModel.find({ brand: brandName });
    if (cars) {
        return cars;
    }
}