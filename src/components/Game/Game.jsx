import React from "react";

import { Board, O_ICON, X_ICON } from "../Board/Board";

import "./Game.css";

const WINNING_CONFIGURATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

export class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: Array(9).fill(null),
      emptySquares: 9,
      winner: null,
      winningConfig: [],
      xIsNextPlayer: true,
      boardHistory: [Array(9).fill(null)],
    };
  }

  clearState() {
    const newState = {
      squares: Array(9).fill(null),
      emptySquares: 9,
      winner: null,
      winningConfig: [],
      xIsNextPlayer: true,
      boardHistory: [Array(9).fill(null)],
    };

    this.setState(newState);
  }

  getWinner(squares) {
    for (let config of WINNING_CONFIGURATIONS) {
      const [index1, index2, index3] = config;

      if (
        squares[index1] &&
        squares[index1] === squares[index2] &&
        squares[index1] === squares[index3]
      ) {
        return {
          winner: squares[index1],
          winningConfig: config,
        };
      }
    }

    return {
      winner: null,
      winningConfig: [],
    };
  }

  undoLastMove() {
    const newSquaresState =
      this.state.boardHistory[this.state.boardHistory.length - 2];

    const newBoardHistory = [...this.state.boardHistory];
    newBoardHistory.pop();

    let newState = {
      ...this.state,
      squares: newSquaresState,
      emptySquares: this.state.emptySquares + 1,
      xIsNextPlayer: !this.state.xIsNextPlayer,
      boardHistory: newBoardHistory,
    };

    this.setState(newState);
  }

  handleClickOnBoard(squareIndex) {
    if (!this.state.winner && !this.state.squares[squareIndex]) {
      const newSquaresState = [...this.state.squares];
      newSquaresState[squareIndex] = this.state.xIsNextPlayer ? "X" : "O";

      const newBoardHistory = [...this.state.boardHistory];
      newBoardHistory.push(newSquaresState);

      let newState = {
        squares: newSquaresState,
        emptySquares: this.state.emptySquares - 1,
        winner: this.getWinner(newSquaresState).winner,
        winningConfig: this.getWinner(newSquaresState).winningConfig,
        xIsNextPlayer: !this.state.xIsNextPlayer,
        boardHistory: newBoardHistory,
      };

      this.setState(newState);
    }
  }

  render() {
    const nextPlayer = this.state.xIsNextPlayer ? "X" : "O";

    return (
      <main>
        <h1>tic tac toe</h1>

        <div className="game">
          <Board
            squares={this.state.squares}
            emptySquares={this.state.emptySquares}
            winner={this.state.winner}
            winningConfig={this.state.winningConfig}
            xIsNextPlayer={this.state.xIsNextPlayer}
            handleClick={(squareIndex) => this.handleClickOnBoard(squareIndex)}
            clearState={() => this.clearState()}
          />

          <div className="game-infos">
            <p className="game-infos__next-player">
              <span>Prochain joueur : </span>
              <span
                className={`${nextPlayer === "X" ? X_ICON : O_ICON}`}
              ></span>
            </p>

            <ol>
              {this.state.boardHistory.map((board, index) => {
                if (index > 0) {
                  return (
                    <li key={`undo-${index}`}>
                      <button
                        className={`${index % 2 === 1 ? "x-bg" : "o-bg"}${
                          index === this.state.boardHistory.length - 1
                            ? " active-undo-btn"
                            : ""
                        }`}
                        onClick={() => {
                          if (index === this.state.boardHistory.length - 1) {
                            this.undoLastMove();
                          }
                        }}
                        disabled={
                          index < this.state.boardHistory.length - 1 ||
                          this.state.winner
                        }
                      >
                        <span className="fas fa-undo"></span>
                        <span> annuler le mouvement de </span>
                        <span
                          className={`${index % 2 === 1 ? X_ICON : O_ICON}`}
                        ></span>
                      </button>
                    </li>
                  );
                }

                return "";
              })}
            </ol>
          </div>
        </div>
      </main>
    );
  }
}
