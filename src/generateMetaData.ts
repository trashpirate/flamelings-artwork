import fs from "fs";
import process from "process";
import { readdir } from "fs/promises";

const url = "ipfs://bafybeiaf6ppnztlf3k5edqrgq3zae5ih2y6vhf255hekkqn6vjwazhq36q/";

interface metaData {
  name: string;
  description: string;
  image: string;
  attributes: any[];
}

function shuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

async function getFileList(dirName: string) {
  let files: string[] = [];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`))];
    } else {
      files.push(`${dirName}/${item.name}`);
    }
  }

  return files;
}

async function readDir(dirName: string) {
  let files: string[] = [];
  const fileList = await getFileList(dirName);
  for (let index = 0; index < fileList.length; index++) {
    const file = fileList[index];
    const relPath = file.replace(dirName + "/", "");
    files.push(relPath);
  }
  return files;
}

async function main() {
  const imageList = await readDir("images");

  // write logs
  fs.writeFile("./logs.txt", "", function (err) {});

  const randomizedList = shuffle(imageList);
  let index = 0;

  for (let index = 0; index < randomizedList.length; index++) {
    const file = randomizedList[index];
    const [color, name] = file.split("/");

    // write logs
    fs.appendFileSync("./logs.txt", index + ": " + file + "\n");

    // write metadata file
    let json: metaData;
    json = {
      name: "Flameling #" + index,
      description:
        "Meet the adorable Flameling, a playful embodiment of warmth and energy born from fire, captured in this unique digital collectible.",
      image: url + color + "/" + name,
      attributes: [
        {
          trait_type: "Color",
          value: color,
        },
      ],
    };

    fs.writeFileSync("./metadata/" + index, JSON.stringify(json));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
