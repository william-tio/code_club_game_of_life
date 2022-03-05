import { useState, useEffect, useCallback } from 'react';
import './App.css';
import Cell from './Cell'
import { randomize } from './utils/randomize';

const App = () => {
  const [grid, setGrid] = useState(new Array(40).fill(0).map(row => new Array(40).fill(0)))
  const [simulate, setSimulate] = useState(false)
  const [triggerCount, setTriggerCount] = useState(0);

  const renderGrid = useCallback(() => {
    console.log("Rendering Grid")
    return grid.map((row, rowIndex) =>
      <tr key={rowIndex}>{row.map((cell, cellIndex) => <Cell key={cellIndex} position={[rowIndex, cellIndex]} grid={grid} setGrid={setGrid} isSimulating={simulate} />)}</tr>
    )
  }, [simulate, grid])


  useEffect(() => {
    const interval = setInterval(() => {
      if (simulate) {
        setTriggerCount(seconds => seconds + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [simulate]);


  return (
    <div className="App">
      <table style={{ border: '1px solid black' }}>
        <tbody>
          {renderGrid()}
        </tbody>
      </table>
      <button onClick={() => setSimulate(!simulate)}>Simulate!</button>
      <button onClick={() => setGrid(randomize(grid))}>Randomize!</button>
      <div>
        Have been triggered {triggerCount} times
      </div>
    </div>
  );
}

export default App;
