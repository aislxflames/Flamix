import express, {} from "express";
import authRoute from "./routes/auth.route";
const app = express();
app.use("/auth", authRoute);
export default app;
//# sourceMappingURL=server.js.map