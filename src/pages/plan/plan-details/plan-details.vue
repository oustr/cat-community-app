<template>
  <BackgroundImage :url="plan?.coverUrl" :urls="[plan?.coverUrl]"></BackgroundImage>
  <BackButton></BackButton>
  <view class="background">

    <Cards></Cards>
    <view style="height: 20vw"></view>
  </view>
  <BottomBar></BottomBar>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import TopBar from "@/components/TopBar.vue";
import Cards from "@/pages/plan/plan-details/Cards.vue";
import BottomBar from "@/pages/plan/plan-details/BottomBar.vue";
import BackButton from "@/components/BackButton.vue"
import { GetPlanDetailReq } from "@/apis/plan/plan-interfaces";
import { Plan } from "@/apis/schemas";
import { getPlanDetail } from "@/apis/plan/plan";
import BackgroundImage from "@/components/BackgroundImage.vue";

const props = defineProps<{
  id: string;
}>();

const getPlanDetailReq = reactive<GetPlanDetailReq>({
  planId: props.id
});
const plan = ref<Plan>();

const getData = async () => {
  plan.value = (await getPlanDetail(getPlanDetailReq)).plan;
};

const goBack = () => {
  // eslint-disable-next-line no-undef
  let pages = getCurrentPages(); // 当前页面
  let beforePage = pages[pages.length - 2]; // 上一页
  uni.navigateBack({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    success: function () { }
  });
};
getData()
</script>

<style scoped lang="scss">
.background {
  margin-top: 60vw;
  background-color: #f6f6f6;
  min-height: 80vh;
}

.cat-image {
  position: fixed;
  width: 100vw;
  height: 68vw;
  z-index: -1;
  top: 0;
}
</style>
