// This script uses Node.js and the Express framework to create a simple proxy server.
// Its purpose is to read an inventory CSV file, format the data into a JSON object,
// and then send that data to a remote API via a POST request. The server also uses
// the CORS middleware to allow cross-origin requests, increasing its compatibility
// with various client-side applications.

const express = require("express");
const cors    = require("cors");
const axios   = require("axios");
const fs      = require("fs");

const app = express();
app.use(cors());

const sendData = async (data) => {
    const response = await axios.post(UPDATE_INVENTORY_URL, data);
    console.log(response.data);
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

    // read inventory data from a CSV file on the local machine
    fs.readFile("/Users/juan/Desktop/proxy-server/inventario.csv", "utf8", (err, data) => {
        
        // split CSV data by semi-colon
        let splitData = data.split(";");
        jsonData = {};

        // iterate over splitData array, step size of 8, starting from the 10th element
        for (let i = 9; i < splitData.length; i += 8) {

            // if the inventory count is greater than 0, add the product to jsonData
            if (parseInt(splitData[i]) > 0) {
                jsonData[splitData[i]] = splitData[i + 1];
            }
        }

        // send jsonData to the UPDATE_INVENTORY_URL via POST request
        sendData(jsonData);
    });
});