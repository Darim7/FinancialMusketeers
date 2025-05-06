import Plot from 'react-plotly.js';

const ContourPlot = ({data, layout}:any) => {

    const TestData = [
        [10, 10.625, 12.5, 15.625, 20],
        [5.625, 6.25, 8.125, 11.25, 15.625],
        [2.5, 3.125, 5, 8.125, 12.5],
        [0.625, 1.25, 3.125, 6.25, 10.625],
        [0, 0.625, 2.5, 5.625, 10]
      ];

    return (
        <Plot
          data={[{
            z: TestData,
            type: 'contour',
            colorscale: 'Viridis',
            colorbar: {
                title: 'Color Scale',
                titleside: 'right',
                thickness: 15,
                len: 0.5,
                xanchor: 'left',
                x: 1.05,
                yanchor: 'middle',
                y: 0.5,
              },
          }]}
          layout={{
            title: 'Contour Plot',
            ...layout,
          }}
        />
    )

}

export default ContourPlot;