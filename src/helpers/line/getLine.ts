export const getLine = (id: number, layerName: string, startPoint: any, endPoint: any) => {
    return (
`0
LINE
5
66697865642069643a20${id}
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
0`
)}