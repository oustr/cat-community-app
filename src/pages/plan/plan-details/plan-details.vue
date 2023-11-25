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
      <view class="shadow" @click="switchState(false)">
        <view class="overlay" @click.stop.prevent>
          <view class="pull-up-container">
            <view class="pull-up-header">
              <!-- Header content goes here -->
              <view class="title">目标小鱼干：{{ plan?.maxFish }}</view>
              <view class="subtitle"
                >距离完成目标还剩{{ plan?.maxFish - plan?.nowFish }}小鱼干</view
              >
            </view>
            <view class="my-balance">我的余额{{ myFish }}</view>
            <view class="counter">
              <view class="now-fish">当前捐赠</view>
              <view>
                <button class="counter-button decrement" @click="decrement">
                  -
                </button>
                <input
                  ref="input"
                  v-model="count"
                  type="number"
                  class="count-display"
                />
                <button class="counter-button increment" @click="increment">
                  +
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>
  </template>
  <template v-if="showToast === 1">
    <ToastBoxWithShadow
      bold-normal-text="助力小鱼干"
      :bold-blue-text="'*' + count"
      grey-text=""
      @close="closeToastBox"
    ></ToastBoxWithShadow>
  </template>
  <template v-if="showToast === -1">
    <ToastBoxWithShadow
      bold-normal-text="小鱼干不足"
      :bold-blue-text="count"
      grey-text=""
      @close="closeToastBox"
    ></ToastBoxWithShadow>
  </template>
  <BottomBar @on-help-click="switchState(true)"></BottomBar>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from "vue";
import Cards from "@/pages/plan/plan-details/Cards.vue";
import BottomBar from "@/pages/plan/plan-details/BottomBar.vue";
import BackButton from "@/components/BackButton.vue";
import { GetPlanDetailReq } from "@/apis/plan/plan-interfaces";
import { Plan } from "@/apis/schemas";
import { getPlanDetail, getUserFish, donateFish } from "@/apis/plan/plan";
import BackgroundImage from "@/components/BackgroundImage.vue";
import { onPullDownRefresh } from "@dcloudio/uni-app";
import ToastBoxWithShadow from "@/components/ToastBoxWithShadow.vue";

const showToast = ref<number>(0);

const closeToastBox = () => {
  let refresh = false;
  if (showToast.value === 1) refresh = true;
  showToast.value = 0;
  if (refresh) pageRefresh();
};

const state = ref<number>(0);
const showHelp = ref<boolean>(false);

const count = ref<number>(10); // Initialize the count value

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
const myFish = ref<number>(0);

let isInited = ref<boolean>(false);

const getData = async () => {
  plan.value = (await getPlanDetail(getPlanDetailReq)).plan;
  myFish.value = (await getUserFish({})).fish;
  count.value = 10;
  isInited.value = true;
};

// 切换基于助力按钮的页面的状态
const switchState = (fromButton: boolean) => {
  if (state.value === 0) {
    state.value = 1;
    showHelp.value = true;
  } else if (state.value === 1) {
    state.value = 0;
    if (!fromButton) {
      showHelp.value = false;
      return;
    }
    if (count.value > myFish.value) {
      showToast.value = -1;
      return;
    }
    donateFish({ planId: props.id, fish: count.value });
    showHelp.value = false;
    showToast.value = 1;
  }
};

const isRefreshing = ref(false);

function pageRefresh() {
  isRefreshing.value = true;
  getData();
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
.shadow {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 20vh;
  width: 100vw;
  height: 80vh;
  background-color: #22222288;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
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
  z-index: 2;
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
</style>
