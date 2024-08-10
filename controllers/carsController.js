const CarModel = require('../models/car');

exports.getByBrandName = async (brandName) => {
    const cars = await CarModel.find({ brand: brandName });
    if (cars) {
        return cars;
    }
}

exports.getAllCars = async () => {
    const cars = await CarModel.find({});
    if (cars) {
        return cars;
    }
}