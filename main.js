/*
 * Project:
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */


// Don't worry about these 4 lines below

const IOhandler = require("./IOhandler"),
  zipFilePath = `${__dirname}/zip/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;

(async () => {
  // test async 
  let a = await IOhandler.unzip(zipFilePath, pathUnzipped);
  console.log(a);
  let b = await IOhandler.readDir(pathUnzipped);
  console.log(b);
  let c = await IOhandler.grayScale(pathUnzipped + "/in2.png", pathProcessed);
  console.log(c);
  let c1 = await IOhandler.grayScale(pathUnzipped + "/in1.png", pathProcessed);
  console.log(c1);
  let c2 = await IOhandler.grayScale(pathUnzipped + "/in2.png", pathProcessed);
  console.log(c2);
})()