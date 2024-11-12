import { scaleCorrection } from "@/constants";
import { getLine } from "@/helpers/line/getLine";
import { MooeDoc } from "@/types";

export const getLines = (mooe: MooeDoc) => {

    const straightLines = mooe?.mRoads.filter((obj: any) => obj.mLanes[0].mLaneType === 0);

    const pointslist = mooe?.mLaneMarks.reduce((accum: any, obj: any) => {
        accum[obj.mLaneMarkID] = obj;

        return accum;
    }, {});


    const straightRoads = straightLines?.reduce((accum: any, obj: any, index: number) => {

        const startId = obj.mLanes[0].mStartPos;
        const endId = obj.mLanes[0].mEndPos;

        const firstPoint = {
            x: pointslist[startId].mLaneMarkXYZW.x / scaleCorrection,
            y: pointslist[startId].mLaneMarkXYZW.y / scaleCorrection,
            z: pointslist[startId].mLaneMarkXYZW.z / scaleCorrection
        };

        const secondPoint = {
            x: pointslist[endId].mLaneMarkXYZW.x / scaleCorrection,
            y: pointslist[endId].mLaneMarkXYZW.y / scaleCorrection,
            z: pointslist[endId].mLaneMarkXYZW.z / scaleCorrection
        };

        const line = getLine(
            obj.mLanes[0].mLaneID.toString(16),
            obj.mLanes[0].mDirection === 2 ? "Bidirectional roads" : "Straight roads",
            firstPoint,
            secondPoint
        );

        const tailPart = line + (index !== straightLines.length - 1 ? "\n" : "");

        return accum += tailPart;

    }, "");

    const targetStraightRoads = straightRoads ? `${straightRoads}\n0\nENDSEC` : "";

    return targetStraightRoads;
}