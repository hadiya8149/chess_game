import { useState , useMemo, useCallback, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Chess} from 'chess.js'
import { Chessboard } from "react-chessboard";
import { API_KEY } from '../utils'
import OpenAI from "openai";

function App() {
  const chess = useMemo(() => new Chess(), []); // <- 1
  const [fen, setFen] = useState(chess.fen()); // <- 2
  const openai = new OpenAI({ apiKey: API_KEY ,dangerouslyAllowBrowser: true });

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0]);
}
  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); // update Chess instance
        setFen(chess.fen()); // update fen state to trigger a re-render
  
        console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());
  
        if (chess.isGameOver()) { // check if move led to "game over"
          if (chess.isCheckmate()) { // if reason for game over is a checkmate
            // Set message to checkmate. 
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            ); 
            // The winner is determined by checking which side made the last move
          } else if (chess.isDraw()) { // if it is a draw
            setOver("Draw"); // set message to "Draw"
          } else {
            setOver("Game over");
          }
        }
        console.log(result, "chess game result")
        return result;
      } catch (e) {
        return null;
      } // null if the move was illegal, the move object if the move was legal
    },
    [chess]
  );
  function onDrop(sourceSquare, targetSquare) {
    console.log(sourceSquare, targetSquare)
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      // promotion: "q",
    };
    console.log(moveData)
    const move = makeAMove(moveData);

    // illegal move
    if (move === null) return false;

    return true;
  }
useEffect(()=>{
main()
},[])
  return (
    <>

<div
  style={{
    margin: '3rem auto',
    maxWidth: '70vh',
    width: '70vw'
  }}
>
  <Chessboard
    id="Configurable Board"
    position={fen}
    onArrowsChange={function noRefCheck(){}}
    onDragOverSquare={function noRefCheck(){}}
    onMouseOutSquare={function noRefCheck(){}}
    onMouseOverSquare={function noRefCheck(){}}
    onPieceClick={function noRefCheck(){}}
    onPieceDragBegin={function noRefCheck(){}}
    onPieceDragEnd={function noRefCheck(){}}
    onPieceDrop={onDrop}
    onPromotionCheck={function noRefCheck(){}}
    onPromotionPieceSelect={function noRefCheck(){}}
    onSquareClick={function noRefCheck(){}}
    onSquareRightClick={function noRefCheck(){}}
  />
</div>


    </>
  )
}

export default App
