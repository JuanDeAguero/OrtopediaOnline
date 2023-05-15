const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");

const app = express();
app.use(cors());

const sendData = async (data) => {
    const response = await axios.post("https://ortopediagomezdeaguero.es/_functions/updateInventory", data);
    console.log(response.data);
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    fs.readFile("/Users/juan/Desktop/proxy-server/inventario.csv", "utf8", (err, data) => {
        let splitData = data.split(";");
        jsonData = {};
        for (let i = 9; i < splitData.length; i += 8) {
            if (parseInt(splitData[i]) > 0) {
                jsonData[splitData[i]] = splitData[i + 1];
            }
        }
        sendData(jsonData);
    });
});