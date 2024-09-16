import { fontSize, scaleCorrection } from "@/constants";
import { MooeDoc } from "@/types";
import { DxfWriter, point3d } from "@tarikjabiri/dxf";

export const setData = (dxf: DxfWriter, mooe: MooeDoc) => {

    const pointslist = mooe?.mLaneMarks.reduce((accum: any, obj: any) => {
        accum[obj.mLaneMarkID] = obj;

        return accum;
    }, {});

    const points = mooe?.mLaneMarks.reduce((accum: any, obj: any) => {

        if (obj.mLaneMarkType === 11) {
            obj.mLaneMarkName.slice(0, 2) !== "GT" && accum.pallets.push(obj);
            obj.mLaneMarkName.includes("Rest") && accum.restPoints.push(obj);
            obj.mLaneMarkName.includes("Charge") && accum.chargePoints.push(obj);
            obj.mLaneMarkName.includes("GT") && accum.gates.push(obj);
        }

        return accum;
    }, {
        gates: [],
        pallets: [],
        restPoints: [],
        chargePoints: [],
    });

    const straightLines = mooe?.mRoads.filter((obj: any) => obj.mLanes[0].mLaneType === 0);

    dxf.addLayer("Gtp", 4);
    dxf.addLayer("Route", 5);
    dxf.addLayer("QuadraticSpline", 3);
    dxf.addLayer("CubicSpline", 12);
    dxf.addLayer("Pallet points", 1);
    dxf.addLayer("Rest points", 30);
    dxf.addLayer("Charge points", 3);

    straightLines?.map((obj: any) => {

        const startId = obj.mLanes[0].mStartPos;
        const endId = obj.mLanes[0].mEndPos;

        dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Route" }
        );

    });

    points.gates.map((obj: any) => {
        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            obj.mLaneMarkName,
            { layerName: "Gtp" }
        );
    });

    points.pallets.map((obj: any) => {
        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            obj.mLaneMarkName,
            { layerName: "Pallet points" }
        );
    });

    points.restPoints.map((obj: any) => {
        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            obj.mLaneMarkName,
            { layerName: "Rest points" }
        );
    });

    points.chargePoints.map((obj: any) => {
        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            obj.mLaneMarkName,
            { layerName: "Charge points" }
        );
    });

    return dxf;
}