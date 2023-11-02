<template>
  <PlanEntry></PlanEntry>
  <PlanEntry v-for="(plan, index) in plans" :plan="plan"></PlanEntry>
</template>

<script lang="ts" setup>
import { getPlanPreviews } from "@/apis/plan/plan";
import { GetPlanPreviewsReq } from "@/apis/plan/plan-interfaces";
import { Plan } from "@/apis/schemas";
import PlanEntry from "@/pages/plan/PlanEntry.vue";
import { ref, reactive } from "vue";
import { onReachBottom } from "@dcloudio/uni-app";
const getPlanPreviewsReq = reactive<GetPlanPreviewsReq>({
  page: 0,
  catId: "",
  onlyUserId: "",
  limit: 0,
  lastToken: "",
  backward: 0,
})

let allPreviewsLoaded = false;
let isPreviewsLoaded = true;

const plans = ref<Plan[]>([]);

const localGetPlanPreviews = async () => {
  let res = await getPlanPreviews(getPlanPreviewsReq)
  isPreviewsLoaded = false;
  for (let i = 0; i < res.data?.length; i++) {
    plans.value.push(res.data[i]);
  }
  isPreviewsLoaded = true;
  getPlanPreviewsReq.page += 1;
  if (res.data?.length < 10) allPreviewsLoaded = true;
}

onReachBottom(() => {
  if (isPreviewsLoaded && !allPreviewsLoaded) {
    localGetPlanPreviews();
  }
});

</script>

<style scoped lang="scss"></style>
