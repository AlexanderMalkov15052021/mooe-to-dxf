import { fontSize, scaleCorrection } from "@/constants";
import { getText } from "@/helpers/text/getText";
import { MooeDoc } from "@/types";

export const getTextPoints = (mooe: MooeDoc) => {

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


    const restPoints = points?.restPoints?.reduce((accum: any, obj: any, index: number) => {

        const text = getText(
            obj.mLaneMarkID,
            obj.mLaneMarkName,
            fontSize,
            "Rest points",
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection }
        );

        const tailPart = (index === 0 ? "" : "\n") + text;

        return accum += tailPart;

    }, "");

    const gates = points?.gates?.reduce((accum: any, obj: any, index: number) => {

        const text = getText(
            obj.mLaneMarkID,
            obj.mLaneMarkName,
            fontSize,
            "Flow pallets",
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection }
        );

        const tailPart = (index === 0 ? "" : "\n") + text;

        return accum += tailPart;

    }, "");

    const pallets = points?.pallets?.reduce((accum: any, obj: any, index: number) => {

        const text = getText(
            obj.mLaneMarkID,
            obj.mLaneMarkName,
            fontSize,
            "Alley pallets",
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection }
        );

        const tailPart = (index === 0 ? "" : "\n") + text;

        return accum += tailPart;

    }, "");

    const chargePoints = points?.chargePoints?.reduce((accum: any, obj: any, index: number) => {

        const text = getText(
            obj.mLaneMarkID,
            obj.mLaneMarkName,
            fontSize,
            "Charge points",
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection }
        );

        const tailPart = (index === 0 ? "" : "\n") + text;

        return accum += tailPart;

    }, "");

    const locationPoints = points?.locationPoints?.reduce((accum: any, obj: any, index: number) => {

        const name = index < 9 ? `Test poin - 0${index + 1}` : `Test poin - ${index + 1}`

        const text = getText(
            obj.mLaneMarkID,
            name,
            fontSize,
            "Target points",
            { x: obj.mLaneMarkXYZW.x / scaleCorrection, y: obj.mLaneMarkXYZW.y / scaleCorrection }
        );

        const tailPart = (index === 0 ? "" : "\n") + text;

        return accum += tailPart;

    }, "");




    const targetRestPoints = restPoints ? `${restPoints}\n` : "";

    const targetGates = gates ? `${gates}\n` : "";

    const targetPallets = pallets ? `${pallets}\n` : "";

    const targetChargePoints = chargePoints ? `${chargePoints}\n` : "";

    const targetLocationPoints = locationPoints ? `${locationPoints}\n` : "";



    const allTextPointsStr = `${targetRestPoints}${targetGates}${targetPallets}${targetChargePoints}${targetLocationPoints}`;



    const targetTextPoints = allTextPointsStr ? `${allTextPointsStr}ENDSEC` : "ENDSEC";

    return targetTextPoints;

}