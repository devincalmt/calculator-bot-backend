"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const user_1 = require("../models/user");
const faker_1 = require("@faker-js/faker");
describe("POST /api/login", () => {
    it("Should return 200 for existing or not existing user", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const email = faker_1.faker.internet.email().toLowerCase();
        const res = yield (0, supertest_1.default)(index_1.default).post("/api/login").send({
            email: email,
        });
        const user = yield user_1.UserModel.findOne({ email });
        expect((_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString()).toEqual(res.body.data);
    }));
});
