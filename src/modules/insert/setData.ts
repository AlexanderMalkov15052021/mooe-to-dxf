import { fontSize, scaleCorrection } from "@/constants";
import { MooeDoc } from "@/types";
import { DxfWriter } from "@tarikjabiri/dxf";
// import { getRoads } from "../extract/getRoads";

export const setData = (dxf: DxfWriter, mooe: MooeDoc) => {

    // const pointslist = mooe?.mLaneMarks?.reduce((accum: any, obj: any) => {
    //     accum[obj.mLaneMarkID] = obj;

    //     return accum;
    // }, {});

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

    // const roads = getRoads(mooe, points, pointslist);

    // const straightLines = mooe?.mRoads?.filter(
    //     (obj: any) => obj.mLanes[0].mLaneType === 0
    //         && !roads?.palletRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
    //         && !roads?.restRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
    //         && !roads?.chargeRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
    //         && !roads?.gateRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
    // );

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
    dxf.addLayer("Target points", 70);
    dxf.addLayer("Bidirectional roads", 120);

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

    // straightLines?.map((obj: any) => {

    //     const startId = obj.mLanes[0].mStartPos;
    //     const endId = obj.mLanes[0].mEndPos;

    //     const dir = obj.mLanes[0].mDirection;

    //     if (dir === 0) {
    //         dxf.addLine(
    //             point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
    //             point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
    //             { layerName: "Bidirectional roads" }
    //         );
    //     }
    //     else {
    //         dxf.addLine(
    //             point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
    //             point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
    //             { layerName: "Straight roads" }
    //         );
    //     }
    // });

    // roads?.palletRoads?.map((obj: any) => {

    //     const startId = obj.road.mLanes[0].mStartPos;
    //     const endId = obj.road.mLanes[0].mEndPos;

    //     dxf.addLine(
    //         point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
    //         point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
    //         { layerName: "Pallet roads" }
    //     );

    // });

    // roads?.restRoads?.map((obj: any) => {

    //     const startId = obj.road.mLanes[0].mStartPos;
    //     const endId = obj.road.mLanes[0].mEndPos;

    //     dxf.addLine(
    //         point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
    //         point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
    //         { layerName: "Rest roads" }
    //     );

    // });

    // roads?.chargeRoads?.map((obj: any) => {

    //     const startId = obj.road.mLanes[0].mStartPos;
    //     const endId = obj.road.mLanes[0].mEndPos;

    //     dxf.addLine(
    //         point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
    //         point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
    //         { layerName: "Charge roads" }
    //     );

    // });

    // roads?.gateRoads?.map((obj: any) => {

    //     const startId = obj.road.mLanes[0].mStartPos;
    //     const endId = obj.road.mLanes[0].mEndPos;

    //     dxf.addLine(
    //         point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
    //         point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
    //         { layerName: "Flow roads" }
    //     );

    // });

    points?.gates?.map((obj: any) => {
        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            obj.mLaneMarkName,
            { layerName: "Flow pallets" }
        );
    });

    points?.pallets?.map((obj: any) => {
        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            obj.mLaneMarkName,
            { layerName: "Alley pallets" }
        );
    });

    points?.restPoints?.map((obj: any) => {
        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            obj.mLaneMarkName,
            { layerName: "Rest points" }
        );
    });

    points?.chargePoints?.map((obj: any) => {
        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            obj.mLaneMarkName,
            { layerName: "Charge points" }
        );
    });

    points?.locationPoints?.map((obj: any, index: number) => {

        const name = index < 9 ? `Test poin - 0${index + 1}` : `Test poin - ${index + 1}`

        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            name,
            { layerName: "Target points" }
        );
    });

    return dxf;
}