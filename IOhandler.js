/*
 * Project:
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */


const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  // check if pathIn exists
  pathIn = path.join(pathIn);
  pathOut = path.join(pathOut);
  return new Promise((res, rej) => {
    if (fs.existsSync(pathIn)) {
      fs.createReadStream(pathIn).pipe(unzipper.Extract({
          path: pathOut
        })
        .on("close", (() => {
          return res("Extraction operation complete");
        }))
        .on("error", (() => {
          return rej("Error during extraction operation");
        }))
      );
    } else {
      return rej("Input file does not exist");
    }
  })
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */



const readDir = (dir) => {
  let files = [];
  let imageFiles = [];
  return new Promise((res, rej) => {
    fs.readdir(dir, ((err, files) => {
      if (err) {
        return rej("no such directory");
      } else {
        files.forEach((file) => {
          if (!(file.startsWith("__", 0)) || (file.startsWith(".", 0))) {
            imageFiles.push(file);
          }
        });
        return res(imageFiles);
      }
    }));
  });
}

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  pathIn = path.join(pathIn);
  const filename = path.basename(pathIn);
  return new Promise((res, rej) => {

    fs.createReadStream(pathIn)
      .pipe(
        new PNG({
          filterType: 4,
        })
      )
      .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;

            // // invert color
            // this.data[idx] = 255 - this.data[idx];
            // this.data[idx + 1] = 255 - this.data[idx + 1];
            // this.data[idx + 2] = 255 - this.data[idx + 2];

            // gray scale
            let avgColor = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
            this.data[idx] = avgColor;
            this.data[idx + 1] = avgColor;
            this.data[idx + 2] = avgColor;

            // // and reduce opacity
            // this.data[idx + 3] = this.data[idx + 3] >> 1;
          }
        }

        const newPath = path.join(pathOut + '/' + filename);
        this.pack().pipe(fs.createWriteStream(newPath));
        return res("the image has converted to gray scale")
      });
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};