// import { StakingSchema } from "../../schemas/staking.schema";
var isodate = require("isodate");

export const authStub = () => {
    return {
        _id: "61ce9eb5ea6132236c28f699",
        tid: "String",
        uid: "String",
        accessToken: "String",
        duration : "String",
        createdAt: isodate("2011-08-20T19:39:52Z"),
        updatedAt: isodate("2011-08-20T19:39:52Z"),
        __v: 0
    };
};