import express, {} from "express";
const route = express();
route.post("/login", (req, res) => {
    const body = req.body;
    res.json(body);
});
const authRoute = route;
export default authRoute;
//# sourceMappingURL=auth.route.js.map