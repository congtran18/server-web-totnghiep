// import { StakingSchema } from "../../schemas/staking.schema";
var isodate = require("isodate");

export const loginStub = () => {
    return {
        _id: "61ce9eb5ea6132236c28f699",
        username: "String",
        password: "String",
        fullName: "String",
        uid : "String",
        createdAt: isodate("2011-08-20T19:39:52Z"),
        updatedAt: isodate("2011-08-20T19:39:52Z"),
        __v: 0
    };
};