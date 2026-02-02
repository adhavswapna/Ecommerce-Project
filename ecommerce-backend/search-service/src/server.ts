import dotenv from "dotenv";
dotenv.config();


import app from "./app";


const PORT = process.env.PORT || 3012;


app.listen(PORT, () => {
console.log(`🔍 Search Service running on port ${PORT}`);
});
