import { useState, useEffect, useCallback } from 'react';
import './App.css';
// components
import Cell from './components/Cell'
// helpers
import { resetGrid, randomize, calculateNextState, ROW_SIZE, COL_SIZE } from './utils/helpers';
// styled
import { StyledBoard } from './components/styled/StyledBoard';
import { MainContainer } from './components/styled/MainContainer';
import { StyledHeader } from './components/styled/StyledHeader';
// material UI
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
// import SplitButton from './components/styled/SplitButton';



const App = () => {
  const [simulate, setSimulate] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);
  const [allCellData, setAllCellData] = useState(resetGrid())
  const [savedGames, setSavedGames] = useState();
  const [savedGameToLoad, setSavedGameToLoad] = useState();

  const renderGrid = useCallback(() => {
    console.log("Rendering Grid")
    return [...Array(ROW_SIZE).keys()].map((rowIndex) => <tr key={rowIndex}>
      {
        [...Array(COL_SIZE).keys()].map((colIndex) => <Cell key={colIndex} position={[rowIndex, colIndex]} allCellData={allCellData} setAllCellData={setAllCellData} isSimulating={simulate} />)
      }
    </tr>)
  }, [allCellData, simulate])

  useEffect(() => {
    if (localStorage.getItem("savedGames") === null) {
      localStorage.setItem("savedGames", JSON.stringify([]))
      setSavedGames([])
    } else {
      setSavedGames(JSON.parse(localStorage.getItem("savedGames")))
    }
  }, [])


  useEffect(() => {
    const interval = setInterval(() => {
      if (simulate) {
        calculateNextState(allCellData, setAllCellData)
        setTriggerCount(seconds => seconds + 1);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [allCellData, simulate]);

  const saveSavedGame = () => {
    const key = `savedGame${localStorage.getItem("savedGames").length + 1}`
    localStorage.setItem("savedGames", JSON.stringify([...JSON.parse(localStorage.getItem("savedGames")), key]))
    localStorage.setItem(key, JSON.stringify(allCellData));
  }

  const loadSavedGame = (v) => {
    setAllCellData(JSON.parse(localStorage.getItem(v)));
  }


  return (
    <MainContainer className="App">
      <StyledHeader>Conway's Гаме Of Лife</StyledHeader>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > *': {
            m: 2,
          },
        }}
      >
        <ButtonGroup variant="text" aria-label="text button group">
          <Button color="secondary" style={{ textDecoration: 'overline' }} onClick={() => setSimulate(!simulate)}>{simulate ? "Stop" : "Simulate!"}</Button>
          <Button color="secondary" onClick={() => setAllCellData(randomize(allCellData))}>Randomize!</Button>
          <Button color="secondary" onClick={() => setAllCellData(resetGrid())}>Clear board</Button>
          <Button color="secondary" onClick={() => saveSavedGame()}>Save as preset</Button>
          <Button color="secondary" onClick={() => loadSavedGame()}>Load preset</Button>
          {
            savedGames && <select name="savedGames" onChange={(e) => loadSavedGame(e.target.value)}>
              <option selected disabled hidden value=''></option>
              {
                savedGames.map((savedGame) => <option value={savedGame}>{savedGame}</option>)
              }
            </select>
          }
        </ButtonGroup>
      </Box>
      <StyledBoard>
        <tbody>
          {renderGrid()}
        </tbody>
      </StyledBoard>
      <div>
        Have been triggered {triggerCount} times
      </div>
    </MainContainer>
  );
}

export default App;
