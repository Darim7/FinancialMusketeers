import { ReactElement, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

const SurfacePlot = ({data, layout}:any): ReactElement => {
    
    const TestData = [
        [8, 10, 12, 14, 16],
        [7, 9, 11, 13, 15],
        [6, 8, 10, 12, 14],
        [5, 7, 9, 11, 13],
      ];
    
      const TestLayout = {
        scene: {
          xaxis: { title: 'X Axis' },
          yaxis: { title: 'Y Axis' },
          zaxis: { title: 'Z Axis' },
        },
      };

    return (
        <Plot
          data={[
            {
              z: TestData,
              type: 'surface',
            },
          ]}
          layout={{
            title: 'Surface Plot',
            ...TestLayout,
          }}
        />
    );
}
export default SurfacePlot;