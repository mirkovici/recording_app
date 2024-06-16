<script setup lang="ts">
import { ref, type Ref } from "vue";
import axios from "axios";
import { type IRecord } from "@/types";
import RecordAudio from "../components/RecordAudio.vue";

const recordList: Ref<IRecord[]> = ref([
  { title: "Record 1", blob: null },
  { title: "Record 2", blob: null },
  { title: "Record 3", blob: null },
]);

const outputFile = ref(null);

const combine = async () => {
  const formData = new FormData();
  let indexForRemoval: number[] = [];
  recordList.value.forEach((record, index) => {
    if (record.blob !== null) {
      formData.append(
        `${record.title.toLocaleLowerCase().replace(" ", "")}`,
        record.blob
      );
    } else {
      indexForRemoval.push(index);
    }
  });

  recordList.value.sort((a: any, b: any) => b - a);

  indexForRemoval.forEach((index: number) => {
    recordList.value.splice(index, 1);
  });

  axios({
    method: "post",
    url: "http://localhost:3000/v1/combine",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((res: any) => {
      outputFile.value = res.data.output;
    })
    .catch((res: any) => {
      alert(`${JSON.stringify(res)}Something went wrong`);
    });
};

const save = (blob: any, index: any) => {
  // @ts-ignore
  recordList.value[index].blob = blob;
};

const add = () => {
  recordList.value.push({
    title: `Record ${
      !recordList.value.length
        ? 1
        : parseInt(
            recordList.value[recordList.value.length - 1].title?.split(" ")?.[1]
          ) + 1
    }`,
    blob: null,
  });
};

const remove = (index: number) => {
  recordList.value.splice(index, 1);
};

const clear = () => {
  recordList.value = [];
  outputFile.value = null;
};
</script>

<template>
  <div class="greetings">
    <div class="record_list_actions">
      <button @click="add()">Add Record</button>
      <button @click="combine()">Combine Records</button>
      <button @click="clear()">Clear all</button>
    </div>
    <div class="record_list_container">
      <div class="record_list_item" v-for="(record, index) in recordList">
        <RecordAudio
          :key="record.title"
          :record="record"
          :index="index"
          @remove="remove(index)"
          @save="save"
        />
      </div>
      <div class="record_list_output" v-if="outputFile">
        <audio :key="outputFile" controls>
          <source
            :src="'http://localhost:3000' + outputFile"
            type="audio/mpeg"
          />
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.record_list_container {
  display: flex;
  flex-direction: column;
  align-items: left;
  height: 300px;
}

.record_list_actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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

.record_list_output {
  margin-top: 20px;
}

.record_list_item_close {
  position: absolute;
  right: 5px;
  cursor: pointer;
  color: black;
  top: 5px;
}
</style>
