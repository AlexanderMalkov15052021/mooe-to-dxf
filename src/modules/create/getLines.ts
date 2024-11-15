import { scaleCorrection } from "@/constants";
import { getLine } from "@/helpers/line/getLine";
import { getHexFromStr } from "@/helpers/math";
import { MooeDoc } from "@/types";
import { getRoads } from "../extract/getRoads";

export const getLines = (mooe: MooeDoc) => {

    const pointslist = mooe?.mLaneMarks?.reduce((accum: any, obj: any) => {
        accum[obj.mLaneMarkID] = obj;

        return accum;
    }, {});

    const points = mooe?.mLaneMarks?.reduce((accum: any, obj: any) => {

        if (obj.mLaneMarkType === 11) {

            if (obj.mLaneMarkName.toLowerCase().includes("rest")) {
                accum.restPoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("charge")) {
                accum.chargePoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("gt")) {
                accum.gates.push(obj);
                return accum;
            }

            if (!obj.mLaneMarkName.toLowerCase().includes("gt")) {
                accum.pallets.push(obj);
                return accum;
            }

        }

        if (obj.mLaneMarkType === 5) {

            accum.locationPoints.push(obj);
            return accum;

        }

        return accum;
    }, {
        gates: [],
        pallets: [],
        restPoints: [],
        chargePoints: [],
        locationPoints: [],
    });

    const roads = getRoads(mooe, points, pointslist);

    const straightLines = mooe?.mRoads?.filter(
        (obj: any) => obj.mLanes[0].mLaneType === 0
            && !roads?.palletRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
            && !roads?.restRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
            && !roads?.chargeRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
            && !roads?.gateRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
    );

    const palletRoads = roads?.palletRoads?.reduce((accum: any, obj: any, index: number) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

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
            getHexFromStr(obj.road.mRoadID),
            getHexFromStr(obj.road.mLanes[0].mLaneID),
            "Pallet roads",
            firstPoint,
            secondPoint
        );

        const tailPart = line + (index !== roads?.palletRoads?.length - 1 ? "\n" : "");

        return accum += tailPart;

    }, "");

    const chargeRoads = roads?.chargeRoads?.reduce((accum: any, obj: any, index: number) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

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
            getHexFromStr(obj.road.mRoadID),
            getHexFromStr(obj.road.mLanes[0].mLaneID),
            "Charge roads",
            firstPoint,
            secondPoint
        );

        const tailPart = line + (index !== roads?.chargeRoads?.length - 1 ? "\n" : "");

        return accum += tailPart;

    }, "");

    const gateRoads = roads?.gateRoads?.reduce((accum: any, obj: any, index: number) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

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
            getHexFromStr(obj.road.mRoadID),
            getHexFromStr(obj.road.mLanes[0].mLaneID),
            "Flow roads",
            firstPoint,
            secondPoint
        );

        const tailPart = line + (index !== roads?.gateRoads?.length - 1 ? "\n" : "");

        return accum += tailPart;

    }, "");

    const restRoads = roads?.restRoads?.reduce((accum: any, obj: any, index: number) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

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
            getHexFromStr(obj.road.mRoadID),
            getHexFromStr(obj.road.mLanes[0].mLaneID),
            "Rest roads",
            firstPoint,
            secondPoint
        );

        const tailPart = line + (index !== roads?.restRoads?.length - 1 ? "\n" : "");

        return accum += tailPart;

    }, "");

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
            getHexFromStr(obj.mRoadID),
            getHexFromStr(obj.mLanes[0].mLaneID),
            obj.mLanes[0].mDirection === 2 ? "Bidirectional roads" : "Straight roads",
            firstPoint,
            secondPoint
        );

        const tailPart = line + (index !== straightLines.length - 1 ? "\n" : "");

        return accum += tailPart;

    }, "");



    const targetStraightRoads = straightRoads ? `${straightRoads}\n` : "";

    const targetRestRoads = restRoads ? `${restRoads}\n` : "";

    const targetPalletRoads = palletRoads ? `${palletRoads}\n` : "";

    const targetGateRoads = gateRoads ? `${gateRoads}\n` : "";

    const targetChargeRoads = chargeRoads ? `${chargeRoads}\n` : "";



    const allRoadsStr = `${targetStraightRoads}${targetRestRoads}${targetPalletRoads}${targetGateRoads}${targetChargeRoads}`;


    const targetRoads = allRoadsStr ? `${allRoadsStr}0\nENDSEC` : "0\nENDSEC";

    return targetRoads;
}