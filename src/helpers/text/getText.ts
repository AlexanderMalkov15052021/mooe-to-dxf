import { Coords2D } from "@/types";

export const getText = (id: string, text: string, fontSize: number, layerName: string, coord: Coords2D) => {
    return (
`MTEXT
5
66697865642069643a20${id}
330
C
100
AcDbEntity
8
${layerName}
100
AcDbMText
10
${coord.x}
20
${coord.y}
30
0
40
${fontSize}
1
${text}
7
STANDARD
0`
)};