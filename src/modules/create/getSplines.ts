import { getCubicSpline } from "@/helpers/spline/getCubicSpline";
import { getQuadraticSpline } from "@/helpers/spline/getQuadraticSpline";
import { MooeDoc } from "@/types";

export const getSplines = (mooe: MooeDoc) => {

    const quadraticCurveLines = mooe?.mRoads.filter((obj: any) => obj.mLanes[0].mLaneType === 1);
    const cubicCurveLines = mooe?.mRoads.filter((obj: any) => obj.mLanes[0].mLaneType === 2);

    const pointslist = mooe?.mLaneMarks.reduce((accum: any, obj: any) => {
        accum[obj.mLaneMarkID] = obj;

        return accum;
    }, {});

    const quadraticSplines = quadraticCurveLines?.reduce((accum: any, obj: any, index: number) => {

        const startId = obj.mLanes[0].mStartPos;
        const endId = obj.mLanes[0].mEndPos;

        const firstPoint = pointslist[startId].mLaneMarkXYZW;
        const secondPoint = obj.mLanes[0].mBezierControl;
        const thirdPoint = pointslist[endId].mLaneMarkXYZW;

        const quadraticSpline = getQuadraticSpline(obj.mLanes[0].mLaneID.toString(16), "quadraticSpline", firstPoint, secondPoint, thirdPoint);

        const tailPart = quadraticSpline + (index !== quadraticCurveLines.length - 1 ? "\n" : "");

        return accum += tailPart;

    }, "");


    const cubicSplines = cubicCurveLines?.reduce((accum: any, obj: any, index: number) => {

        const startId = obj.mLanes[0].mStartPos;
        const endId = obj.mLanes[0].mEndPos;

        const firstPoint = pointslist[startId].mLaneMarkXYZW;
        const secondPoint = obj.mLanes[0].m_BezierControl1;
        const thirdPoint = obj.mLanes[0].m_BezierControl2;
        const fourthPoint = pointslist[endId].mLaneMarkXYZW;

        const cubicSpline = getCubicSpline(obj.mLanes[0].mLaneID.toString(16), "cubicSpline", firstPoint, secondPoint, thirdPoint, fourthPoint);

        const tailPart = cubicSpline + (index !== cubicCurveLines.length - 1 ? "\n" : "");

        return accum += tailPart;

    }, "");

    const targetQuadraticSplines = quadraticSplines ? `\n${quadraticSplines}` : "";
    const targetCubicSplines = cubicSplines ? `\n${cubicSplines}` : "";

    return `ENTITIES\n0${targetQuadraticSplines}${targetCubicSplines}`
}