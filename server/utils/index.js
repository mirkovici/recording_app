const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
ffmpeg.setFfmpegPath(ffmpegPath);

const directory = "./utils/recordings";

function mergeAudioFiles(inputFiles, callback) {
  outputAudio = `${directory}/output_${new Date().getTime()}.mp3`;
  if (inputFiles.length < 2) {
    console.error("You need at least two input audio files to merge");
    return;
  }

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
      let formattedOutputAudio = outputAudio.substring(1);
      formattedOutputAudio =
        "/api/output/" + formattedOutputAudio?.split("/")?.[3];
      callback(formattedOutputAudio);
      console.log("Files have been merged successfully");
    })
    .on("error", function (err) {
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
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = { generateFiles };
