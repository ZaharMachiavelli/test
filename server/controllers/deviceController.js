const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../errors/ApiError");
const uuid = require("uuid");
const path = require("path");

class DeviceController {
    async create(req, res, next) {
        try {
            const { name, price, brandId, typeId, info } = req.body;

            // не забудь поставить библиотеку express-fileupload
            const { img } = req.files;
            let fileName = uuid.v4() + ".jpg";
            // переместим файл
            img.mv(path.resolve(__dirname, "..", "static", fileName));
            const device = await Device.create({
                name,
                price,
                brandId,
                typeId,
                img: fileName,
            });

            if (info) {
                // в formdata приходят в формате json
                info = JSON.parse(info);
                info.forEach((i) =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id,
                    })
                );
            }

            return res.status(201).json(device);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        let { brandId, typeId, limit, page } = req.query;
        page = page || 1;
        limit = limit || 10;
        let offset = page * limit - limit;
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({ limit, offset });
        }

        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({
                where: { brandId },
                limit,
                offset,
            });
        }

        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({
                where: { typeId },
                limit,
                offset,
            });
        }

        if (brandId && typeId) {
            devices = await Device.findAndCountAll({
                where: { typeId, brandId },
                limit,
                offset,
            });
        }

        return res.json(devices);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const device = await Device.findOne({
            where: {id},
            // foreignkey - к которому привязываются не имеет инфы о том, кто к нему привязан, но привязанные элементы имеют инфу о том, к кому привязаны
            include: [{model: DeviceInfo, as: 'info'}]
        })
        return res.json(device);
    }
}

module.exports = new DeviceController();
