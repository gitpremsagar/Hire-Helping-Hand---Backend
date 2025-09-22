import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.get("/", (req, res) => {
    res.send("Hello World");
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}
    Visit http://localhost:${PORT} to see the result`);
});
//# sourceMappingURL=server.js.map