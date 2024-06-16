const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
ffmpeg.setFfmpegPath(ffmpegPath);

const directory = "./utils/recordings";

function mergeAudioFiles(inputFiles, callback) {
  let outputAudio = `${directory}/output_${new Date().getTime()}.mp3`;

  const command = ffmpeg();

  inputFiles.forEach((inputFile) => {
    command.input(inputFile);
  });

  const inputsCount = inputFiles.length;
  const filter = [
    `[0:a]${inputFiles
      .slice(1)
      .map((_, i) => `[${i + 1}:a]`)
      .join("")}amerge=inputs=${inputsCount}[a]`,
  ];

  command
    .complexFilter(filter)
    .outputOptions(["-map", "[a]", "-ac", "2"])
    .on("end", function () {
      let formattedOutputAudioPath = outputAudio.substring(1);
      formattedOutputAudioPath =
        "/api/output/" + formattedOutputAudioPath?.split("/")?.[3];
      callback({ status: "success", output: formattedOutputAudioPath });
      console.log("Files have been merged successfully");
    })
    .on("error", function (err) {
      callback({ status: "error", msg: err.message });
      console.log("An error occurred: " + err.message);
    })
    .save(outputAudio);
}

const generateFiles = async (files, callback) => {
  let paths = [];
  try {
    if (!fs.existsSync(`${directory}`)) {
      fs.mkdirSync(`${directory}`);
    }
    for (let [key, value] of Object.entries(files)) {
      const audioFileData = fs.readFileSync(value?.path);
      let path = `${directory}/${key}_${new Date().getTime()}.mp3`;
      fs.writeFileSync(path, audioFileData);
      paths.push(path);
    }
    mergeAudioFiles(paths, callback);
  } catch (err) {
    callback({ status: "error", msg: err.message });
    console.error("Error:", err);
  }
};

module.exports = { generateFiles };
