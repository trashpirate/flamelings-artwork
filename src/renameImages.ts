import fs from "fs";
import process from "process";
import { readdir } from "fs/promises";

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
  const folders = ["WHITE", "BLUE", "YELLOW", "RED", "NOVA"];

  for (const folder of folders) {
    const filePath = "images/" + folder;
    const imageList = await readDir(filePath);
    console.log(imageList);
    let index = 0;
    for (const image of imageList) {
      // Rename the file
      fs.renameSync(
        filePath + "/" + image,
        filePath + "/flameling_" + folder.toLowerCase() + "_" + index + ".png"
      );

      index++;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
