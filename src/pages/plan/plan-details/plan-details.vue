<template>
  <template v-if="!isRefreshing">
    <BackgroundImage
      :url="plan?.coverUrl"
      :urls="[plan?.coverUrl]"
    ></BackgroundImage>
    <BackButton></BackButton>
    <view class="background">
      <template v-if="isInited">
        <Cards :plan="plan"></Cards>
      </template>
      <view style="height: 20vw"></view>
    </view>
    <template v-if="showHelp && isInited">
      <view class="overlay">
        <view class="pull-up-container">
          <view class="pull-up-header">
            <!-- Header content goes here -->
            <view class="title">目标小鱼干：{{ plan?.maxFish }}</view>
            <view class="subtitle"
              >距离完成目标还剩{{ plan?.maxFish - plan?.nowFish }}小鱼干</view
            >
          </view>
          <view class="my-balance">我的余额</view>
          <view class="counter">
            <view class="now-fish"></view>
            <button class="counter-button decrement" @click="decrement">
              -
            </button>
            <span class="count-display">{{ count }}</span>
            <button class="counter-button increment" @click="increment">
              +
            </button>
          </view>
        </view>
      </view>
    </template>
  </template>
  <BottomBar></BottomBar>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from "vue";
import Cards from "@/pages/plan/plan-details/Cards.vue";
import BottomBar from "@/pages/plan/plan-details/BottomBar.vue";
import BackButton from "@/components/BackButton.vue";
import { GetPlanDetailReq } from "@/apis/plan/plan-interfaces";
import { Plan } from "@/apis/schemas";
import { getPlanDetail } from "@/apis/plan/plan";
import BackgroundImage from "@/components/BackgroundImage.vue";
import { onPullDownRefresh } from "@dcloudio/uni-app";

const count = ref<number>(10); // Initialize the count value

const showHelp = ref<boolean>(true);

function increment() {
  count.value++; // Increment count
}

function decrement() {
  if (count.value > 0) {
    count.value--; // Decrement count
  }
}

const props = defineProps<{
  id: string;
}>();

const getPlanDetailReq = reactive<GetPlanDetailReq>({
  planId: props.id
});
const plan = ref<Plan>();

let isInited = ref<boolean>(false);

const getData = async () => {
  plan.value = (await getPlanDetail(getPlanDetailReq)).plan;
  isInited.value = true;
};

const isRefreshing = ref(false);
function pageRefresh() {
  isRefreshing.value = true;
  nextTick(() => {
    isRefreshing.value = false;
  });
}
onPullDownRefresh(() => {
  pageRefresh();
  uni.stopPullDownRefresh();
});

getData();
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

.overlay {
  position: fixed;
  bottom: 20vw;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
}

.pull-up-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.counter {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.counter-button {
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  margin: 0 10px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 16px;
  background-color: #f7f7f7;
  color: #333;
  font-size: 18px;
}

.count-display {
  font-size: 24px;
  min-width: 60px;
  text-align: center;
}

.confirm-button {
  width: 100%;
  padding: 10px 0;
  color: white;
  font-size: 18px;
  background-color: #1a73e8;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.confirm-button:active {
  background-color: #1558b3;
}
</style>
