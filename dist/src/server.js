"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const Errors_1 = require("./Errors");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const connection_1 = require("./models/connection");
// استيراد Swagger
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
// إعداد Swagger: قراءة الملف المولد تلقائياً
// نستخدم try-catch لأن الملف قد لا يكون موجوداً في أول تشغيل قبل تنفيذ سكريبت الـ autogen
let swaggerDocument;
try {
    const swaggerPath = path_1.default.join(process.cwd(), "swagger-output.json");
    if (fs_1.default.existsSync(swaggerPath)) {
        swaggerDocument = JSON.parse(fs_1.default.readFileSync(swaggerPath, "utf8"));
    }
}
catch (error) {
    console.log("⚠️ Swagger output file not found yet.");
}
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// Middlewares
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "20mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "20mb" }));
// Static Files
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use(express_1.default.static(path_1.default.join(process.cwd(), "public")));
app.use("/public", express_1.default.static(path_1.default.join(process.cwd(), "public")));
// Routes
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working! notify token" });
});
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), "public", "index.html"));
});
app.use("/api", routes_1.default);
// Error Handling
app.use((req, res, next) => {
    if (!req.path.startsWith("/api") && req.method === "GET") {
        return res.status(404).sendFile(path_1.default.join(process.cwd(), "public", "404.html"));
    }
    throw new Errors_1.NotFound("Route not found");
});
app.use(errorHandler_1.errorHandler);
// تشغيل السيرفر والاتصال بقاعدة البيانات
httpServer.listen(3000, async () => {
    await (0, connection_1.connectDB)(); // فحص الاتصال عند التشغيل
    console.log("🚀 Server is running on http://localhost:3000");
    console.log("📖 Swagger docs available at http://localhost:3000/docs");
});
