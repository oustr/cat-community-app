import { Pages } from "@/utils/url";

export function onClickPlan(id: string) {
    uni.navigateTo({
        url: `${Pages.PlanDetails}?id=${id}`
    });
}

