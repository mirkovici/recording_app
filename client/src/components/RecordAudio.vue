<script setup lang="ts">
import { ref } from "vue";
import type { IRecord } from "@/types";

const props = defineProps<{
  record: IRecord;
  index: any;
}>();

const emit = defineEmits<{
  (e: "remove"): void;
  (e: "save", value: string, index: number): void;
}>();

const recordingStatus = ref("Record Sound");
const recording = ref(false);
const recorder = ref<any>(null);
const blob = ref<any>(null);
const stream = ref<any>(null);

const recordTitle = ref(props.record?.title);
const recordIndex = ref(props.index);

async function record() {
  if (recording.value) {
    stream?.value?.getAudioTracks()[0].stop();
    recorder?.value?.finishRecording();
    recordingStatus.value = "Record Sound";
    recording.value = false;
    return;
  }

  const constraints = {
    audio: true,
    video: false,
  };

  stream.value = await navigator.mediaDevices.getUserMedia(constraints);

  const audioContext = new AudioContext();
  const input = audioContext.createMediaStreamSource(stream.value);

  let configs = {
    workerDir: "/web-audio-recorder/",
  };
  // @ts-ignore
  let recorderTmp = new WebAudioRecorder(input, configs);

  recorderTmp.setOptions({
    timeLimit: 30,
    encodeAfterRecord: true,
    ogg: { quality: 0.5 },
    mp3: { bitRate: 160 },
  });

  recorderTmp.onComplete = (_: any, blobValue: any) => {
    recordingStatus.value = "Record Sound";
    blob.value = blobValue;
    emit(`save`, blob.value, recordIndex.value);
  };

  recorderTmp.startRecording();
  recordingStatus.value = "Stop Recording";
  recording.value = true;
  blob.value = null;
  console.log("ok it worked");
  recorder.value = recorderTmp;
}

const play = () => {
  let player = new window.Audio();
  player.src = window.URL.createObjectURL(blob?.value);
  player.play();
};
</script>

<template>
  <span>{{ recordTitle }}</span>
  <button class="mr-4" @click="record">
    {{ recordingStatus }}
  </button>
  <button class="mr-4" :disabled="!blob" @click="play">Play Sound</button>
  <div @click="emit(`remove`)" class="record_list_item_close">&#215;</div>
</template>

<style scoped>
.record_list_item {
  display: flex;
  justify-content: space-around;
  padding: 5px 20px 5px 0;
  height: 30px;
  width: 400px;
  background-color: white;
  color: black;
  margin-top: 5px;
  line-height: 20px;
  position: relative;
}

.record_list_item_close {
  position: absolute;
  right: 5px;
  cursor: pointer;
  color: black;
  top: 5px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}
</style>
