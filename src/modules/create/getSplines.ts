import { getFirstPartSpline } from "@/helpers/spline/getFirstPartSpline";
import { getSecondPartSpline } from "@/helpers/spline/getSecondPartSpline";
import { MooeDoc } from "@/types";

export const getSplines = (mooe: MooeDoc) => {

    const curveLines = mooe?.mRoads.filter((obj: any) => obj.mLanes[0].mLaneType === 1);

    const splines = curveLines?.reduce((accum: any, obj: any, index: number) => {

        const startId = obj.mLanes[0].mStartPos;
        const endId = obj.mLanes[0].mEndPos;

        const pointslist = mooe?.mLaneMarks.reduce((accum: any, obj: any) => {
            accum[obj.mLaneMarkID] = obj;

            return accum;
        }, {});

        const firstPoint = pointslist[startId].mLaneMarkXYZW;
        const secondPoint = obj.mLanes[0].mBezierControl;
        const thirdPoint = pointslist[endId].mLaneMarkXYZW;

        const firsPart = getFirstPartSpline(obj.mLanes[0].mLaneID.toString(16), "ARC");

        const secondPart = getSecondPartSpline(firstPoint, secondPoint, thirdPoint);

        const tailPart = secondPart + (index !== curveLines.length - 1 ? "\n" : "");

        return accum += firsPart + tailPart;

    }, "");

    return `ENTITIES\n0\n${splines}`
}