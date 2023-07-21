import { useState, useRef, useEffect } from "react";
import { socket } from "../socket";

import { Chessboard } from "react-chessboard";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";

export function ChessboardWrapper() {
  // Подсветка ходов
  var whiteSquareGrey = "#a9a9a9";
  var blackSquareGrey = "#696969";

  var whiteSquare = "#f1dbb6";
  var blackSquare = "#b58763";

  function greySquare(targetSquare: string) {
    // console.log("targetSquare");
    // console.log(targetSquare);

    let newTarget = targetSquare;

    console.log("FIRST newTarget");
    console.log(newTarget);

    if (newTarget[newTarget.length - 1] == "+") {
      console.log("1");
      newTarget = newTarget.slice(0, -1);
    }
    if (newTarget[newTarget.length - 1] == "#") {
      console.log("1");
      newTarget = newTarget.slice(0, -1);
    }

    if (newTarget.length == 5) {
      console.log("2");
      newTarget = newTarget.slice(2, 4);
    } else if (newTarget.length == 4) {
      console.log("3");
      newTarget = newTarget.slice(2);
    } else if (newTarget.length == 3) {
      console.log("4");
      newTarget = newTarget.slice(1);
    }

    console.log("newTarget");
    console.log(newTarget);

    const square = document.querySelector(
      `div [data-square="${newTarget}"]`
    ) as HTMLElement;

    if (square) {
      const color = square.getAttribute("data-square-color");
      square.style.background =
        color === "white" ? whiteSquareGrey : blackSquareGrey;
    }
  }

  function onMouseOverSquare(sourceSquare: string) {
    socket.emit("get position", sourceSquare, (moves: Array<string>) => {
      if (moves.length === 0) return;

      greySquare(sourceSquare);

      for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i]);
      }
    });
  }

  function removeGreySquares(targetSquare: string) {
    console.log("targetSquare");
    console.log(targetSquare);

    let newTarget = targetSquare;

    if (newTarget[newTarget.length - 1] == "+") {
      console.log("1");
      newTarget = newTarget.slice(0, -1);
    }
    if (newTarget[newTarget.length - 1] == "#") {
      console.log("1");
      newTarget = newTarget.slice(0, -1);
    }

    if (newTarget.length == 5) {
      console.log("2");
      newTarget = newTarget.slice(2, 4);
    } else if (newTarget.length == 4) {
      console.log("3");
      newTarget = newTarget.slice(2);
    } else if (newTarget.length == 3) {
      console.log("4");
      newTarget = newTarget.slice(1);
    }

    console.log("newTarget");
    console.log(newTarget);

    const square = document.querySelector(
      `div [data-square="${newTarget}"]`
    ) as HTMLElement;

    if (square) {
      const color = square.getAttribute("data-square-color");
      square.style.background = color === "white" ? whiteSquare : blackSquare;
    }
  }

  function onMouseOutSquare(sourceSquare: string) {
    socket.emit("get position", sourceSquare, (moves: Array<string>) => {
      if (moves.length === 0) return;

      removeGreySquares(sourceSquare);

      for (var i = 0; i < moves.length; i++) {
        removeGreySquares(moves[i]);
      }
    });
  }

  function onDragOverSquare(sourceSquare: string) {
    socket.emit("get position", sourceSquare, (moves: Array<string>) => {
      if (moves.length === 0) return;

      removeGreySquares(sourceSquare);

      for (var i = 0; i < moves.length; i++) {
        removeGreySquares(moves[i]);
      }
    });
  }

  // Связь с сервером
  const [board, setBoard] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [boardOrientation, setBoardOrientation] = useState("white");

  useEffect(() => {
    socket.on("accept move", (...args) => {
      console.log("accept move");
      console.log(args);

      console.log("args[2]");
      console.log(args[2]);

      setBoard(args[2]);
    });

    socket.on("game over", (winner) => {
      let fullWinner = "";
      if (winner == "w") {
        fullWinner = "white";
      } else {
        fullWinner = "black";
      }

      alert(`Winner: ${fullWinner}`);
      resetBoard();
    });

    socket.emit("get role", (response) => {
      console.log("response");
      console.log(response);
      if (response == "b") {
        setBoardOrientation("black");
      }
    });
  }, []);

  function onDragBegin(piece: Piece, square: Square) {
    console.log("фигура и позиция", piece, square);

    socket.emit("get position", square, (response) => {
      console.log("get position");
      console.log(response);
    });
  }

  function onPieceDrop(
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) {
    console.log("piece");
    console.log(piece);

    // меняем таргет сквер для не пешек - дописываем букву фигуры
    // if (piece[1].toLowerCase() != "p") {
    //   console.log("не пешка");
    //   console.log("${piece[1]}${targetSquare}");
    //   console.log(`${piece[1]}${targetSquare}`);

    //   socket.emit("compare", sourceSquare, `${piece[1]}${targetSquare}`);
    // } else {
    //   console.log("пешка");
    //   socket.emit("compare", sourceSquare, targetSquare);
    // }

    // не меняем таргет сквер для не пешек
    socket.emit("compare", sourceSquare, targetSquare);

    return true;
  }

  function resetBoard() {
    console.log("resetBoard");

    socket.emit("reset board");
    socket.on("answer reset", (response) => {
      console.log("answer reset");
      console.log(response);
      setBoard(response);
    });
  }

  return (
    <div>
      <Chessboard
        id="BasicBoard"
        position={board}
        showBoardNotation={true}
        onPieceDragBegin={onDragBegin}
        onPieceDrop={onPieceDrop}
        onMouseOutSquare={onMouseOutSquare}
        onMouseOverSquare={onMouseOverSquare}
        boardOrientation={boardOrientation}
        onDragOverSquare={onDragOverSquare}
      />
      <button className="resetBtn" onClick={resetBoard}>
        Reset Board
      </button>
    </div>
  );
}
