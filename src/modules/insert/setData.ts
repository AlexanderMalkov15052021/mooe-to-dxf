import { scaleCorrection } from "@/constants";
import { MooeDoc } from "@/types";
import { DxfWriter } from "@tarikjabiri/dxf";

export const setData = (dxf: DxfWriter, mooe: MooeDoc) => {

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

    return dxf;
}