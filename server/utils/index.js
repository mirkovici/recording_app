const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const inputAudio1 = `${__dirname}/mock/input1.mp3`;
const inputAudio2 = `${__dirname}/mock/input2.mp3`;
const outputAudio = `${__dirname}/mock/output.mp3`;

export const mergeAudios = () => {
  ffmpeg()
    .input(inputAudio1)
    .input(inputAudio2)
    .complexFilter(["[0:a][1:a]amerge=inputs=2[a]"])
    .outputOptions(["-map", "[a]", "-ac", "2"])
    .on("end", function () {
      console.log("Files have been merged successfully");
    })
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
    })
    .save(outputAudio);
  s;
};
