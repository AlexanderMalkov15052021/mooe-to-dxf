export const getLine = (roadId: string, LaneId: string, layerName: string, startPoint: any, endPoint: any) => {
    return (
`LINE
5
66697865642069643a20${roadId}20${LaneId}
330
C
100
AcDbEntity
8
${layerName}
100
AcDbLine
10
${startPoint.x}
20
${startPoint.y}
30
0
11
${endPoint.x}
21
${endPoint.y}
31
0
0`
)}