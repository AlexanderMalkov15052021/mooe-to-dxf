export const getQuadraticSpline = (id: number, layerName: string, firstPoint: any, secondPoint: any, thirdPoint: any) => {
    return (
`SPLINE
  5
66697865642069643a20${id}
330
57
100
AcDbEntity
  8
${layerName}
100
AcDbSpline
210
0.0
220
0.0
230
1.0
 70
     8
 71
     3
 72
     8
 73
     4
 74
     0
 42
0.000000001
 43
0.001
 40
0.0
 40
0.0
 40
0.0
 40
0.0
 40
1.0
 40
1.0
 40
1.0
 40
1.0
 10
${firstPoint.x}
 20
${firstPoint.y}
 30
0.0
 10
${secondPoint.x}
 20
${secondPoint.y}
 30
0.0
 10
${thirdPoint.x}
 20
${thirdPoint.y}
 30
0.0
 10
${thirdPoint.x}
 20
${thirdPoint.y}
 30
0.0
  0`
)}