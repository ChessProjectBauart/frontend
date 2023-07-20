import React, { useState, useRef, useEffect } from "react";
import { socket } from "../socket";

import { Chessboard } from "react-chessboard";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";

export function ChessboardWrapper() {
  const defaultFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  var whiteSquareGrey = "#a9a9a9";
  var blackSquareGrey = "#696969";

  //   var whiteSquare = "#f1dbb6";
  //   var blackSquare = "#b58763";

  const boardRef = useRef(null);
  //   socket.on("testOn", (payload) => {
  //     console.log("testOn", payload);
  //   });

  let [availableMoves, setAvailableMoves] = useState<{
    square: string;
    moves: Array<string>;
  }>({ square: "", moves: [] });

  function onDragBegin(piece: Piece, square: Square) {
    console.log("фигура и позиция", piece, square);

    // socket.emit("get position", square);

    socket.emit("get position", square, (response) => {
      console.log(response);
    });

    // console.log("Drag started:");
    // // console.log("Source: " + source);
    // console.log("Piece: " + piece);
    // // console.log("Position: " + boardRef.current.objToFen(position));
    // console.log("Orientation: " + orientation);
    // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  }

  function greySquare(targetSquare: string) {
    const square = document.querySelector(
      `div [data-square="${targetSquare}"]`
    ) as HTMLElement;

    if (square) {
      const color = square.getAttribute("data-square-color");
      square.style.background =
        color === "white" ? whiteSquareGrey : blackSquareGrey;
    }
  }

  function onMouseOverSquare(sourceSquare: string) {
    socket.emit("get position", sourceSquare, (moves: Array<string>) => {
      setAvailableMoves({ square: sourceSquare, moves });

      if (moves.length === 0) return;

      greySquare(sourceSquare);

      for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i]);
      }
    });
  }

  // function removeGreySquares (targetSquare: string) {
  //     const square = document.querySelector(
  //         `div [data-square="${targetSquare}"]`
  //       ) as HTMLElement;

  //       if (square) {
  //         const color = square.getAttribute("data-square-color");
  //         square.style.background =
  //           color === "blackSquareGrey" ? whiteSquare : blackSquare;
  //       }
  // }

  // function onMouseOutSquare (square, piece) {

  // }

  return (
    <div>
      <Chessboard
        id="BasicBoard"
        ref={boardRef}
        position={defaultFEN}
        showBoardNotation={true}
        // onSnapEnd={onSnapEnd}
        onPieceDragBegin={onDragBegin}
        // onMouseOutSquare={onMouseOutSquare}
        onMouseOverSquare={onMouseOverSquare}
      />
    </div>
  );
}
