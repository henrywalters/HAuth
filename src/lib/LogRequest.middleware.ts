import { NextFunction, Request, Response } from "express";
import DeviceDetector from 'device-detector-js';
import { RequestLog } from "src/entities/requestLog.entity";
import { BotLog } from "src/entities/botLog.entity";
import { DeviceLog } from "src/entities/deviceLog.entity";

export async function LogRequestMiddleware(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"] : req.ip;
    const detector = new DeviceDetector();
    const device = detector.parse(req.headers['user-agent']);
    
    const log = new RequestLog();
    log.ip = ip as string;
    log.url = req.baseUrl;
    await log.save();

    if (device.bot) {
        const bot = new BotLog();
        bot.name = device.bot.name;
        bot.url = device.bot.url;
        bot.category = device.bot.category;
        bot.producerName = device.bot.producer.name;
        bot.producerUrl = device.bot.producer.url;
        bot.requestLog = log;
        await bot.save();
        log.bot = bot;
    }

    if (device.client) {
        const devLog = new DeviceLog();
        devLog.clientType = device.client.type;
        devLog.clientName = device.client.name;
        devLog.clientVersion = device.client.version;
        devLog.osName = device.os.name;
        devLog.osPlatform = device.os.platform;
        devLog.osVersion = device.os.version;
        devLog.deviceType = device.device.type;
        devLog.deviceBrand = device.device.brand;
        devLog.deviceModel = device.device.model;
        devLog.requestLog = log;

        if (devLog.osName === 'GNU/Linux') {
            res.setHeader('easter', 'Thank you for supporting Open Source technology, with love, the Henry Walters Development team.');
        }

        console.log(req.baseUrl);

        await devLog.save();
        log.device = devLog;
    }

    // @ts-ignore
    req.headers["request"] = log;

    next();
}