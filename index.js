import {app} from "./src/app.js";
import http from "http";

const server = http.createServer(app);
const PORT = 3000;

server.listen(PORT, (err, res) => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
