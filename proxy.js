const axios = require("axios");
const cors = require("cors");
const express = require("express");
const fs = require("fs");

const app = express();
app.use(cors());

const sendData = async (data) => {
    const response = await axios.post(UPDATE_INVENTORY_URL, data);
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