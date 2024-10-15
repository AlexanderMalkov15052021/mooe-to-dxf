import { fontSize, scaleCorrection } from "@/constants";
import { MooeDoc } from "@/types";
import { DxfWriter, point3d } from "@tarikjabiri/dxf";
import { getRoads } from "../extract/getRoads";

export const setData = (dxf: DxfWriter, mooe: MooeDoc) => {

    const pointslist = mooe?.mLaneMarks.reduce((accum: any, obj: any) => {
        accum[obj.mLaneMarkID] = obj;

        return accum;
    }, {});

    const points = mooe?.mLaneMarks.reduce((accum: any, obj: any) => {

        if (obj.mLaneMarkType === 11) {
            obj.mLaneMarkName.includes("rest") && accum.restPoints.push(obj);
            obj.mLaneMarkName.includes("charge") && accum.chargePoints.push(obj);
            obj.mLaneMarkName.includes("GT") && obj.mLaneMarkName.toLowerCase().includes("col") && accum.gates.push(obj);
            !obj.mLaneMarkName.includes("GT") && obj.mLaneMarkName.toLowerCase().includes("col") && accum.pallets.push(obj);
        }

        return accum;
    }, {
        gates: [],
        pallets: [],
        restPoints: [],
        chargePoints: [],
    });

    const roads = getRoads(mooe, points, pointslist);

    const straightLines = mooe?.mRoads.filter(
        (obj: any) => obj.mLanes[0].mLaneType === 0
            && !roads?.palletRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
            && !roads?.restRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
            && !roads?.chargeRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
            && !roads?.gateRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
    );

    dxf.addLayer("Flow pallets", 4);
    dxf.addLayer("Straight roads", 5);
    dxf.addLayer("Quadratic spline roads", 3);
    dxf.addLayer("Cubic spline roads", 12);
    dxf.addLayer("Alley pallets", 1);
    dxf.addLayer("Rest points", 30);
    dxf.addLayer("Charge points", 3);
    dxf.addLayer("Pallet roads", 2);
    dxf.addLayer("Rest roads", 6);
    dxf.addLayer("Charge roads", 8);
    dxf.addLayer("Flow roads", 190);
    dxf.addLayer("Layer", 22);

    dxf.addRectangle(
        {
            x: (mooe?.mSceneMap?.mMapAttr?.mMapOrigin?.x ?? 1) / scaleCorrection
                + (mooe?.mSceneMap?.mMapAttr?.mMapLength ?? 1) / scaleCorrection,
            y: (mooe?.mSceneMap?.mMapAttr?.mMapOrigin?.y ?? 1) / scaleCorrection
        },
        {
            x: (mooe?.mSceneMap?.mMapAttr?.mMapOrigin?.x ?? 1) / scaleCorrection,
            y: (mooe?.mSceneMap?.mMapAttr?.mMapOrigin?.y ?? 1) / scaleCorrection
                + (mooe?.mSceneMap?.mMapAttr?.mMapWidth ?? 1) / scaleCorrection
        },
        { layerName: "Layer" }
    );

    straightLines?.map((obj: any) => {

        const startId = obj.mLanes[0].mStartPos;
        const endId = obj.mLanes[0].mEndPos;

        dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Straight roads" }
        );

    });

    roads?.palletRoads.map((obj: any) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

        dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Pallet roads" }
        );

    });

    roads?.restRoads.map((obj: any) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

        dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Rest roads" }
        );

    });

    roads?.chargeRoads.map((obj: any) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

        dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Charge roads" }
        );

    });

    roads?.gateRoads.map((obj: any) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

        dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Flow roads" }
        );

    });

    points.gates.map((obj: any) => {
        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            obj.mLaneMarkName,
            { layerName: "Flow pallets" }
        );
    });

    points.pallets.map((obj: any) => {
        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            obj.mLaneMarkName,
            { layerName: "Alley pallets" }
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