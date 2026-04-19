"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Benchmark_1 = require("./Benchmark");
let Submission = class Submission {
};
exports.Submission = Submission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Submission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Submission.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Submission.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["queued", "running", "completed", "failed"], default: "queued" }),
    __metadata("design:type", String)
], Submission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { nullable: true }),
    __metadata("design:type", Object)
], Submission.prototype, "detectedComplexity", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { nullable: true }),
    __metadata("design:type", Object)
], Submission.prototype, "confidence", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Submission.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.submissions),
    __metadata("design:type", User_1.User)
], Submission.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Benchmark_1.Benchmark, (result) => result.submission),
    __metadata("design:type", Array)
], Submission.prototype, "benchmarks", void 0);
exports.Submission = Submission = __decorate([
    (0, typeorm_1.Entity)("submissions")
], Submission);
//# sourceMappingURL=Submission.js.map