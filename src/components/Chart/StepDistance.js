// import React, { useEffect } from "react";
// import CanvasJSReact from "@canvasjs/react-charts";


// const StepDistance = ({ data }) => {
//     console.log(data)
//   return (
//     <div>
//       {data.map((animalData, index) => (
//         <div key={index} style={{ marginBottom: "20px" }}>
//           <h3>{animalData.animal_name}</h3>
//           <div
//             id={`chartContainer-${index}`}
//             style={{ height: "360px", width: "100%" }}
//           />
//           {/* <AnimalChart
//             data={animalData.movements}
//             containerId={`chartContainer-${index}`}
//           /> */}
//         </div>
//       ))}
//     </div>
//   );
// };

// // const AnimalChart = ({ data}) => {
// //   useEffect(() => {
// //     const options = {
// //       theme: "light2",
// //       animationEnabled: true,
// //       zoomEnabled: true,
// //       title: {
// //         text: "Minimum Distance Over Time",
// //       },
// //       axisX: {
// //         title: "Time",
// //         valueFormatString: "DD MMM YYYY HH:mm",
// //       },
// //       axisY: {
// //         title: "Distance (km)",
// //       },
// //       data: [
// //         {
// //           type: "area",
// //           xValueFormatString: "DD MMM YYYY HH:mm",
// //           dataPoints: data.map((point) => ({
// //             x: new Date(point.time),
// //             y: point.min_distance_km,
// //           })),
// //         },
// //       ],
// //     };

// //     const chart = new CanvasJSReact.CanvasJSChart(options);
// //     chart.render();

// //     return () => chart.destroy();
// //   }, [data]);

// //   return null;
// // };

// export default StepDistance;
