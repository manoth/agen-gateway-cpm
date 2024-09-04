'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import { Request } from '../models/request';
import { Trigger } from '../models/trigger';
const router = express.Router();
const request = new Request();
const trigger = new Trigger();

router.post('/his/api/gateway', async (req, res, next) => {
    try {
        const decoded = req.decoded;
        const hospcode = req.hospcode;
        const db = req.conn.mysql();
        const vn = req.body.vn;
        const fileSync = path.join(__dirname, '../../datasending.json');
        let data;
        if (!fs.existsSync(fileSync)) { fs.writeFileSync(fileSync, JSON.stringify({ vn: [] })); }
        try { data = JSON.parse(fs.readFileSync(fileSync, 'utf-8')); } catch (error) { data = { vn: [] }; }
        data.vn.push(vn);
        data.vn = [...new Set(data.vn)];
        request.getData(decoded.gatewayUri, decoded.token, hospcode, data).then(async (rs) => {
            if (rs.ok) {
                const payload = await trigger.getData(db, rs.query).then();
                const response = await request.postData(decoded.gatewayUri, decoded.token, hospcode, payload).then();
                await fs.writeFileSync(fileSync, JSON.stringify({ vn: [] }, null, 2));
                res.json(rs);
            } else {
                await fs.writeFileSync(fileSync, JSON.stringify(data, null, 2));
                res.json(rs);
            }
        }).catch((err) => {
            console.log('Error: ' + err.message);
            fs.writeFileSync(fileSync, JSON.stringify(data, null, 2));
            res.json({ ok: false, message: err.message });
        });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

export default router;