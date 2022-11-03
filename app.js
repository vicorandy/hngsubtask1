const cvstojson = require("csvtojson");
const crypto = require("crypto");
const { promises: fss } = require("fs");
const fs = require("fs");
const csvfilepath = "input.csv";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

//  CONVERTING CVS TO JSON
async function cvs2json() {
  const json = await cvstojson().fromFile(csvfilepath);
  fs.writeFile("CHIP-007.json", JSON.stringify(json), "utf-8", (err) => {
    if (err) {
      console.log(err);
    }
  });
  return "CHIP-007.json";
}
//

// CALCULATING THE SHA256 FOR THE JSON FILE
async function sha256(path) {
  const jsonFile = fs.readFileSync(path);
  const hash = crypto.createHash("sha256");
  const finalHex = hash.update(jsonFile).digest("hex");
  return finalHex;
}

// CREATING AN OUTPUT JSON FILE
async function outputJson(finalHex) {
  const json = await cvstojson().fromFile(csvfilepath);
  json.forEach((item) => {
    item.hash = finalHex;
  });

  fs.writeFileSync("output.json", JSON.stringify(json), "utf-8", (err) => {
    if (err) {
      console.log(err);
    }
  });
}

// creating a team csv file
const csvWriter = createCsvWriter({
  path: "./teamsoutput_cvs/bevel_output.csv",
  header: [
    "Series Number",
    "Filename",
    "Description",
    "Gender",
    "UUID",
    "hash",
  ].map((item) => ({
    title: item,
    id: item,
  })),
});

const main = async function () {
  const path = await cvs2json();
  const finalHex = await sha256(path);
  await outputJson(finalHex);
  const file_data = await fs.readFileSync("output.json");
  const parsed_data = await JSON.parse(file_data);
  console.log(parsed_data);

  try {
    await csvWriter.writeRecords(parsed_data);
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

main();
