/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const path = require('path');
const fs = require('fs');
const { Contract } = require('fabric-contract-api');

class FabInfo extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const infos = [
            {
                name: 'JaeGeon Yoo',
                age: 25,
                inf: 'Daejeon',
            },
            {
                name: 'Gusick Ham',
                finger: '001',
                age: 26,
                inf: 'Hanbat',
            },
            {
                name: 'DongHwee Im',
                finger: '010',
                age: 18,
                inf: 'Sintanjin',
            },
        ];

        for (let i = 0; i < infos.length; i++) {
            infos[i].docType = 'info';
            await ctx.stub.putState('INFO' + i, Buffer.from(JSON.stringify(infos[i])));
            console.info('Added <--> ', infos[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryInfos(ctx, infoNumber) {
        const infoAsBytes = await ctx.stub.getState(infoNumber); // get the car from chaincode state
        if (!infoAsBytes || infoAsBytes.length === 0) {
            throw new Error(`${infoNumber} does not exist`);
        }
        console.log(infoAsBytes.toString());
        return infoAsBytes.toString();
    }

    async queryFinger(ctx, infoNumber) {
        const infoAsBytes = await ctx.stub.getState(infoNumber); // get the fingerprint from chaincode state
        if (!infoAsBytes || infoAsBytes.length === 0) {
            throw new Error(`${infoNumber} does not exist`);
        }

        const info = JSON.parse(infoAsBytes.toString());
        return JSON.stringify(info.finger);
        
    }

    async queryInfoAge(ctx, infoNumber) {
        const infoAsBytes = await ctx.stub.getState(infoNumber); // get the information from chaincode state
        if (!infoAsBytes || infoAsBytes.length === 0) {
            throw new Error(`${infoNumber} does not exist`);
        }
        
        const info = JSON.parse(infoAsBytes.toString());
        const result = {adultauth: ``};
        if(info.age<20){
            result.adultauth="student";
        }else if(info.age>=20){
            result.adultauth="adult";
        }
        return JSON.stringify(result);
        
    }

    async createInfo(ctx, infoNumber, name, finger, age, inf) {
        console.info('============= START : Create Info ===========');

        const infos= {
            name,
            docType: 'info',
            finger,
            age,
            inf,
        };

        await ctx.stub.putState(infoNumber, Buffer.from(JSON.stringify(infos)));
        console.info('============= END : Create Info ===========');
    }

    // async queryAllCars(ctx) {
    //     const startKey = '';
    //     const endKey = '';
    //     const allResults = [];
    //     for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
    //         const strValue = Buffer.from(value).toString('utf8');
    //         let record;
    //         try {
    //             record = JSON.parse(strValue);
    //         } catch (err) {
    //             console.log(err);
    //             record = strValue;
    //         }
    //         allResults.push({ Key: key, Record: record });
    //     }
    //     console.info(allResults);
    //     return JSON.stringify(allResults);
    // }

    // async changeCarOwner(ctx, carNumber, newOwner) {
    //     console.info('============= START : changeCarOwner ===========');

    //     const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
    //     if (!carAsBytes || carAsBytes.length === 0) {
    //         throw new Error(`${carNumber} does not exist`);
    //     }
    //     const car = JSON.parse(carAsBytes.toString());
    //     car.owner = newOwner;

    //     await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
    //     console.info('============= END : changeCarOwner ===========');
    // }

}

module.exports = FabInfo;