// import { StakingSchema } from "../../schemas/staking.schema";
var isodate = require("isodate");
import { Project } from './../../schemas/project.schema';

export const projectStub = () => {
    return {
        _id: "61ce9eb5ea6132236c28f699",
        step: 0,
        fee: "string",
        totalRaise: 0,
        saleType: "Hard",
        tokenAddress: "string",
        tokenName: "string",
        coinDecimals: "string",
        coinSymbol: "string",
        totalSupply: 0,
        softCap: 0,
        hardCap: 0,
        tokensForSale: "string",
        pricePerToken: 0,
        initialLiquidityBnb: "string",
        initialLiquidityToken: "string",
        shortDescription: "string",
        longDescription: "string",
        logoUrl: "string",
        bannerUrl: "string",
        twitterLink: "string",
        telegramLink: "string",
        mediumLink: "string",
        email: "string",
        linkedInLink: "string",
        websiteLink: "string",
        whitepaperLink: "string",
        startStaking: isodate("2011-08-20T19:39:52Z"),
        startSale: isodate("2011-08-20T19:39:52Z"),
        endSale: isodate("2011-08-20T19:39:52Z"),
        athPrices: "string",
        initialMarketCap: 0,
        currentState: "string",
        status: "string",
        statusProject: "string",
        chainId: "string",
        network: "string",
        smartContractAddress: "string",
        kyc: true,
        auditStatus: false,
        athPrice: 2,
        create_at: isodate("2011-08-20T19:39:52Z"),
        update_at: isodate("2011-08-20T19:39:52Z"),
        deposit_at: isodate("2011-08-20T19:39:52Z"),
        // __v: 0
    };
};