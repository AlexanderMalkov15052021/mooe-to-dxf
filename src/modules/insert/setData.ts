import { fontSize, scaleCorrection } from "@/constants";
import { laneMark, MooeDoc, Points } from "@/types";
import { DxfWriter, point3d } from "@tarikjabiri/dxf";
import { getRoads } from "../extract/getRoads";

const getDXFLine = (dxf: DxfWriter, dir: number, startId: number, endId: number, pointslist: any) => {
    if (dir === 0) {
        return dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Bidirectional roads" }
        );
    }
    else {
        return dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Straight roads" }
        );
    }
}

export const setData = (dxf: DxfWriter, mooe: MooeDoc) => {

    const pointslist = mooe?.mLaneMarks?.reduce((accum: any, obj: any) => {
        accum[obj.mLaneMarkID] = obj;

        return accum;
    }, {});

    const points: Points = mooe?.mLaneMarks?.reduce((accum: any, obj: any) => {
        if (obj.mLaneMarkType === 2) {
            if (obj.mLaneMarkName.toLowerCase().includes("rest") && obj.mLaneMarkName.toLowerCase().includes("检")) {
                accum.targetRestPoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("rest") && obj.mLaneMarkName.toLowerCase().includes("前置点")) {
                accum.turningRestPoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("charge") && obj.mLaneMarkName.toLowerCase().includes("检")) {
                accum.targetChargePoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("charge") && obj.mLaneMarkName.toLowerCase().includes("前置点")) {
                accum.turningChargePoints.push(obj);
                return accum;
            }

            if (!obj.mLaneMarkName.toLowerCase().includes("gt") && obj.mLaneMarkName.toLowerCase().includes("检")) {
                accum.targetPalletsPoints.push(obj);
                return accum;
            }

            if (!obj.mLaneMarkName.toLowerCase().includes("gt") && obj.mLaneMarkName.toLowerCase().includes("前置点")) {
                accum.turningPalletsPoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("gt") && obj.mLaneMarkName.toLowerCase().includes("检")) {
                accum.targetGatesPoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("gt") && obj.mLaneMarkName.toLowerCase().includes("前置点")) {
                accum.turningGatesPoints.push(obj);
                return accum;
            }
        }

        if (obj.mLaneMarkType === 9) {

            if (!obj.mLaneMarkName.toLowerCase().includes("gt") && obj.mLaneMarkName.toLowerCase().includes("识别")) {
                accum.cachePalletsPoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("gt") && obj.mLaneMarkName.toLowerCase().includes("识别")) {
                accum.cacheGatesPoints.push(obj);
                return accum;
            }

        }

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
        targetGatesPoints: [],
        turningGatesPoints: [],
        cacheGatesPoints: [],
        pallets: [],
        targetPalletsPoints: [],
        turningPalletsPoints: [],
        cachePalletsPoints: [],
        restPoints: [],
        targetRestPoints: [],
        turningRestPoints: [],
        chargePoints: [],
        targetChargePoints: [],
        turningChargePoints: [],
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

    straightLines?.map((obj: any) => {

        const startId = obj.mLanes[0].mStartPos;
        const endId = obj.mLanes[0].mEndPos;

        const dir = obj.mLanes[0].mDirection;

        const line = getDXFLine(dxf, dir, startId, endId, pointslist);

        const appId = dxf.tables.addAppId(`Line - ${line.handle}`);

        const xData = line.addXData(appId.name);

        xData.string(`fixed id: road ${line.handle} ${obj.mRoadID} ${obj.mLanes[0].mLaneID} ${obj.mLanes[0].mStartPos} ${obj.mLanes[0].mEndPos} `);
    });

    roads?.palletRoads?.map((obj: any) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

        const line = dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Pallet roads" }
        );

        const appId = dxf.tables.addAppId(`Line - ${line.handle}`);

        const xData = line.addXData(appId.name);

        xData.string(`fixed id: road ${line.handle} ${obj.road.mRoadID} ${obj.road.mLanes[0].mLaneID} ${obj.road.mLanes[0].mStartPos} ${obj.road.mLanes[0].mEndPos} `);

    });

    roads?.restRoads?.map((obj: any) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

        const line = dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Rest roads" }
        );

        const appId = dxf.tables.addAppId(`Line - ${line.handle}`);

        const xData = line.addXData(appId.name);

        xData.string(`fixed id: road ${line.handle} ${obj.road.mRoadID} ${obj.road.mLanes[0].mLaneID} ${obj.road.mLanes[0].mStartPos} ${obj.road.mLanes[0].mEndPos} `);
    });

    roads?.chargeRoads?.map((obj: any) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

        const line = dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Charge roads" }
        );

        const appId = dxf.tables.addAppId(`Line - ${line.handle}`);

        const xData = line.addXData(appId.name);

        xData.string(`fixed id: road ${line.handle} ${obj.road.mRoadID} ${obj.road.mLanes[0].mLaneID} ${obj.road.mLanes[0].mStartPos} ${obj.road.mLanes[0].mEndPos} `);
    });

    roads?.gateRoads?.map((obj: any) => {

        const startId = obj.road.mLanes[0].mStartPos;
        const endId = obj.road.mLanes[0].mEndPos;

        const line = dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Flow roads" }
        );

        const appId = dxf.tables.addAppId(`Line - ${line.handle}`);

        const xData = line.addXData(appId.name);

        xData.string(`fixed id: road ${line.handle} ${obj.road.mRoadID} ${obj.road.mLanes[0].mLaneID} ${obj.road.mLanes[0].mStartPos} ${obj.road.mLanes[0].mEndPos} `);
    });

    points?.gates?.map((gate: any) => {
        const mText = dxf.addMText(
            { x: gate.mLaneMarkXYZW.x / scaleCorrection, y: gate.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            gate.mLaneMarkName,
            { layerName: "Flow pallets" }
        );

        const targetGatesPoint = points.targetGatesPoints.find(point => point.mLaneMarkName.includes(gate.mLaneMarkName));
        const cacheGatesPoint = points.cacheGatesPoints.find(point => point.mLaneMarkName.includes(gate.mLaneMarkName));
        const turningGatesPoint = points.turningGatesPoints.find(point => point.mLaneMarkName.includes(gate.mLaneMarkName));

        const appId = dxf.tables.addAppId(`MText - ${mText.handle}`);

        const xData = mText.addXData(appId.name);

        xData.string(`fixed id: point ${mText.handle} ${gate?.mLaneMarkID} ${targetGatesPoint?.mLaneMarkID} ${cacheGatesPoint?.mLaneMarkID} ${turningGatesPoint?.mLaneMarkID} `);
    });

    points?.pallets?.map((pallet: any) => {
        const mText = dxf.addMText(
            { x: pallet.mLaneMarkXYZW.x / scaleCorrection, y: pallet.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            pallet.mLaneMarkName,
            { layerName: "Alley pallets" }
        );

        const targetPalletsPoint = points.targetPalletsPoints.find(point => point.mLaneMarkName.includes(pallet.mLaneMarkName));
        const cachePalletsPoint = points.cachePalletsPoints.find(point => point.mLaneMarkName.includes(pallet.mLaneMarkName));
        const turningPalletsPoint = points.turningPalletsPoints.find(point => point.mLaneMarkName.includes(pallet.mLaneMarkName));

        const appId = dxf.tables.addAppId(`MText - ${mText.handle}`);

        const xData = mText.addXData(appId.name);

        xData.string(`fixed id: point ${mText.handle} ${pallet?.mLaneMarkID} ${targetPalletsPoint?.mLaneMarkID} ${cachePalletsPoint?.mLaneMarkID} ${turningPalletsPoint?.mLaneMarkID} `);
    });

    points?.restPoints?.map((rest: laneMark) => {
        const mText = dxf.addMText(
            { x: rest.mLaneMarkXYZW.x / scaleCorrection, y: rest.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            rest.mLaneMarkName,
            { layerName: "Rest points" }
        );

        const targetRestPoint = points.targetRestPoints.find(point => point.mLaneMarkName.includes(rest.mLaneMarkName));
        const turningRestPoint = points.turningRestPoints.find(point => point.mLaneMarkName.includes(rest.mLaneMarkName));

        const appId = dxf.tables.addAppId(`MText - ${mText.handle}`);

        const xData = mText.addXData(appId.name);

        xData.string(`fixed id: point ${mText.handle} ${rest?.mLaneMarkID} ${targetRestPoint?.mLaneMarkID} ${turningRestPoint?.mLaneMarkID} `);
    });

    points?.chargePoints?.map((charge: any) => {
        
        const mText = dxf.addMText(
            { x: charge.mLaneMarkXYZW.x / scaleCorrection, y: charge.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
            fontSize,
            charge.mLaneMarkName,
            { layerName: "Charge points" }
        );

        const targetChargePoint = points.targetChargePoints.find(point => point.mLaneMarkName.includes(charge.mLaneMarkName));
        const turningChargePoint = points.turningChargePoints.find(point => point.mLaneMarkName.includes(charge.mLaneMarkName));

        const appId = dxf.tables.addAppId(`MText - ${mText.handle}`);

        const xData = mText.addXData(appId.name);

        xData.string(`fixed id: point ${mText.handle} ${charge?.mLaneMarkID} ${targetChargePoint?.mLaneMarkID} ${turningChargePoint?.mLaneMarkID} `);
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