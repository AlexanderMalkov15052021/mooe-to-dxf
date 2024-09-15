import { MooeDoc } from "@/types";
import { DxfWriter, point3d } from "@tarikjabiri/dxf";

export const setData = (dxf: DxfWriter, mooe: MooeDoc) => {



    const pointslist = mooe?.mLaneMarks.reduce((accum: any, obj: any) => {
        accum[obj.mLaneMarkID] = obj;

        return accum;
    }, {});

    const points = mooe?.mLaneMarks.reduce((accum: any, obj: any) => {
        obj.mLaneMarkType === 11 && accum.pallets.push(obj);

        return accum;
    }, {
        pallets: []
    });

    const straightLines = mooe?.mRoads.filter((obj: any) => obj.mLanes[0].mLaneType === 0);

    dxf.addLayer("Gate pallets", 4);
    dxf.addLayer("Route", 5);
    dxf.addLayer("quadraticSpline", 3);
    dxf.addLayer("cubicSpline", 12);

    straightLines?.map((obj: any) => {

        const startId = obj.mLanes[0].mStartPos;
        const endId = obj.mLanes[0].mEndPos;

        dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x, pointslist[startId].mLaneMarkXYZW.y),
            point3d(pointslist[endId].mLaneMarkXYZW.x, pointslist[endId].mLaneMarkXYZW.y),
            { layerName: "Route" }
        );

    });

    points.pallets.map((obj: any) => {
        dxf.addMText(
            { x: obj.mLaneMarkXYZW.x, y: obj.mLaneMarkXYZW.y, z: 0 },
            75 * 0.001,
            obj.mLaneMarkName,
            { layerName: "Gate pallets" }
        );
    });

    return dxf;
}