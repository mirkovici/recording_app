<script setup lang="ts">
import { ref, type Ref } from "vue";
import { type IRecord } from "@/types";
import RecordAudio from "../components/RecordAudio.vue";

const recordList: Ref<IRecord[]> = ref([
  { title: "Record 1", blob: null },
  { title: "Record 2", blob: null },
  { title: "Record 3", blob: null },
]);

const blob = ref(null);

const save = (blob: any, index: any) => {
  // @ts-ignore
  recordList.value[index].blob = blob;
};

function add() {
  // @ts-ignore
  const { recordList } = this;
  recordList.push({
    title: `Record ${
      !recordList.length
        ? 1
        : parseInt(recordList[recordList.length - 1].title?.split(" ")?.[1]) + 1
    }`,
    blob: null,
  });
}
</script>

<template>
  <div class="greetings">
    <button @click="add()">Add Record</button>
    <div class="record_list_container">
      <div class="record_list_item" v-for="(record, index) in recordList">
        <RecordAudio
          :record="record"
          :index="index"
          @delete="recordList.splice(recordList.indexOf(record), 1)"
          @save="save"
        />
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
</style>
