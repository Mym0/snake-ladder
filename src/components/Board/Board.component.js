import React, { useState, useEffect, useCallback } from 'react';
import Cell from '../Cell/Cell.component';
import './Board.scss';
import '../Image/ImageContainer.scss';
import { getSnakes, getLadder } from '../../utils/util';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { player } from '../../utils/util';
import startCanvas from '../../canvas';
import getNewQuestionApi from '../../api/getNewQuestion';
import getGameHighScoreApi from '../../api/getGameHighScore';
import saveGameHighScoreApi from '../../api/saveGameHighScore';

import Avatar from '../../img/hacker.png';
import { useOktaAuth } from '@okta/okta-react';

toast.configure();

const Board = ({ userInfo }) => {
  const [gameData, setGameData] = useState({
    player: player,
    snakes: getSnakes(),
    ladders: getLadder(),
    gameover: false,
  });

  const [boardHtml, setBoardHtml] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState('');
  const [counter, setCounter] = useState(0);
  const [choices, setChoices] = useState([]);
  const [answer, setAnswer] = useState('');
  const [tileType, setTileType] = useState('');
  const [disable, setDisable] = useState(false);
  const [diceValue, setDiceValue] = useState('');
  const [gameStart, setGameStart] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [modal, setModal] = useState(false);
  const [score, setScore] = useState(0);

  const [highScores, setHighScores] = useState([]);

  const toggle = () => setModal(!modal);

  const handleCloseHighScoreModal = () => setHighScores([]);

  useEffect(async () => {
    const data = await getNewQuestionApi(1);
    setQuestions(data);
  }, []);

  //Celebrate the win
  useEffect(async () => {
    if (gameOver) {
      startCanvas();
      const data = await getGameHighScoreApi();
      setHighScores(data);
    } else {
      document.getElementById('canvas').style.opacity = 0;
    }
  }, [gameOver]);

  // Resetting the Game
  const resetBtn = useCallback(() => {
    let player = gameData.player;
    player.status = 1;

    setScore(0);
    setHighScores([]);
    setGameStart(true);
    setDisable(false);
    setDiceValue('');
    setGameOver(false);
    setGameData((state) => {
      return {
        ...state,
        player: player,
      };
    });
  }, [gameData.player]);

  // Snake check
  const checkSnake = useCallback(
    (i) => {
      const snake = gameData.snakes.slice();
      let found = snake.find((k, j) => {
        if (k.head === i) {
          return k;
        }
        return undefined;
      });
      return found;
    },
    [gameData.snakes]
  );

  // Ladder check
  const checkLadder = useCallback(
    (i) => {
      const ladder = gameData.ladders.slice();
      let found = ladder.find((k, j) => {
        if (k.from === i) {
          return k;
        }
        return undefined;
      });
      return found;
    },
    [gameData.ladders]
  );

  // Creating Elements on the Board
  const createBoard = (init, cells) => {
    const boardHtml = [];

    for (let i = init; i <= cells; i++) {
      let playerFound =
        gameData.player.status === i ? gameData.player : undefined;
      let snakeFound = checkSnake(i);
      let ladderFound = checkLadder(i);
      const found = {
        backgroundColor: 'grey',
      };

      boardHtml.push(
        <Cell
          sStyle={found}
          snake={snakeFound}
          ladder={ladderFound}
          player={playerFound}
          number={i}
        ></Cell>
      );
    }
    return boardHtml;
  };

  //Creating rows and columns
  useEffect(() => {
    const fixedCol = 10;
    const boardHtmlData = [];
    for (let i = 0; i < 10; i++) {
      const eachRow = createBoard(i * fixedCol + 1, fixedCol * (i + 1));
      boardHtmlData.push(<div key={i * fixedCol + 1 + 'main'}>{eachRow}</div>);
    }
    setBoardHtml(boardHtmlData);
  }, [gameData, resetBtn]);

  const handleSnakeOrLadderTile = async () => {
    // Generate a random question and choices

    // const rand = Math.floor(Math.random() * 3);
    // const randomQuestions = Math.floor(Math.random() * (Mockdata.length - 1));

    if (counter === questions.length - 1) {
      const data = await getNewQuestionApi(2);
      setQuestions(data);
      setCounter(0);
    }

    const currentQuestion = questions[counter];

    const question = currentQuestion.question;
    const answer = currentQuestion.answer;
    const wrongAnswers = currentQuestion.wrongAnswers;
    wrongAnswers.splice(counter, 0, answer);
    const choices = wrongAnswers;

    if (counter !== questions.length - 1) setCounter((prev) => prev + 1);

    // Set the question, choices, and answer in state
    setQuestion(question);
    setChoices(choices);
    setAnswer(answer);

    // Show the popup
    toggle();
  };

  const onRollDiceClick = () => {
    setGameStart(true);

    const min = 1;
    const max = 7;
    let rand = Math.floor(min + Math.random() * (max - min));
    setDiceValue(rand);
    // const rand = 1;
    let thePlayer = { ...gameData.player };

    if (thePlayer.status > 94) {
      const sum = thePlayer.status + rand;
      if (sum > 100) {
        setGameData((state) => {
          return {
            ...state,
            diceNumber: rand,
          };
        });

        return;
      } else if (sum === 100) {
        thePlayer.status = sum;
        setGameOver(true);
        setDisable(true);
        saveGameHighScoreApi({
          record: `${score}`,
          additionalInformation: `${userInfo.name}`,
        });
        setGameData((state) => {
          return {
            ...state,
            diceNumber: rand,
            player: thePlayer,
          };
        });

        toast.success('Game Over ' + thePlayer.name + ' Won', {
          position: toast.POSITION.TOP_CENTER,
          theme: 'colored',
        });
        return;
      }
    }

    let status = thePlayer.status;

    // Snake check
    const snakeFound = checkSnake(status + rand);
    if (snakeFound !== undefined) {
      setDisable(true);

      setTileType({
        name: snakeFound,
        type: 'Snake',
      });

      toast.warn('Oh, a snake!', {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        autoClose: 1800,
      });

      setTimeout(() => {
        handleSnakeOrLadderTile();
      }, 1000);
    }

    // Ladder Check
    const ladderFound = checkLadder(status + rand);

    if (ladderFound !== undefined) {
      setDisable(true);
      setTileType({
        name: ladderFound,
        type: 'Ladder',
      });

      toast.warn('You are stepping on a Ladder!', {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        autoClose: 1800,
      });

      setTimeout(() => {
        handleSnakeOrLadderTile();
      }, 1000);
    }

    thePlayer.status += rand;
    const gameDataCopy = { ...gameData, diceNumber: rand, player: thePlayer };
    setGameData(gameDataCopy);
  };

  const handleAnswerSubmit = (selectedChoice) => {
    let player = gameData.player;

    switch (tileType.type) {
      case 'Snake':
        if (selectedChoice === answer) {
          setScore(score + 1);
          toast.success('Thats correct, Well done!', {
            position: toast.POSITION.TOP_RIGHT,
            theme: 'colored',
            autoClose: 3000,
          });
        } else {
          setScore(score - 1);
          toast.error('Bullocks!, Thats wrong', {
            position: toast.POSITION.TOP_RIGHT,
            theme: 'colored',
            autoClose: 3000,
          });
          player.status = tileType.name.tail;
          setGameData((state) => {
            return {
              ...state,
              player: player,
            };
          });
        }
        break;
      case 'Ladder':
        if (selectedChoice === answer) {
          setScore(score + 1);

          toast.success('Thats correct, Well done!', {
            position: toast.POSITION.TOP_RIGHT,
            theme: 'colored',
            autoClose: 3000,
          });

          player.status = tileType.name.to;

          setGameData((state) => {
            return {
              ...state,
              player: player,
            };
          });
        } else {
          setScore(score - 1);

          toast.error('Bullocks!, Thats wrong', {
            position: toast.POSITION.TOP_RIGHT,
            theme: 'colored',
            autoClose: 3000,
          });
          player.status = tileType.name.from;
          setGameData((state) => {
            return {
              ...state,
              player: player,
            };
          });
        }
        break;
      default:
        break;
    }

    // Hide the popup
    toggle();
    setDisable(false);
  };

  const { oktaAuth } = useOktaAuth();

  const logout = async () => oktaAuth.signOut();

  return (
    <>
      <canvas
        id="canvas"
        style={{
          'z-index': gameOver ? '999' : '-1',
        }}
      ></canvas>

      <Modal isOpen={!!highScores.length} centered size="lg">
        <ModalHeader style={{ justifyContent: 'center' }}>
          <h2>Hight Scores</h2>
        </ModalHeader>
        <ModalBody style={{ display: 'flex', justifyContent: 'center' }}>
          <ol className="listed-elements" font-size="20px">
            {highScores
              .sort((a, b) => b.entry - a.entry)
              .map((highScore) => {
                return (
                  highScore.additionalInformation &&
                  highScore.entry && (
                    <li key={highScore.id}>
                      <h5>
                        {`
              ${highScore.additionalInformation}
              :
              ${highScore.entry}
              `}
                      </h5>
                    </li>
                  )
                );
              })}
          </ol>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleCloseHighScoreModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseHighScoreModal}>
            Continue playing
          </Button>
        </ModalFooter>
      </Modal>

      {gameOver && (
        <div className="memo-container">
          <h1 id="memo">winner winner chicken dinner !</h1>
        </div>
      )}
      <div className="memo-container">
        <h1 id="score">Your score is {score}</h1>
      </div>
      <Modal isOpen={modal} centered size="lg">
        <ModalHeader style={{ justifyContent: 'center' }}>
          <h2>{question}</h2>
        </ModalHeader>
        <ModalBody style={{ display: 'flex', justifyContent: 'center' }}>
          <ul className="listed-elements" font-size="20px">
            {choices.map((choice) => (
              <li key={choice}>
                <button onClick={() => handleAnswerSubmit(choice)}>
                  {choice}
                </button>
              </li>
            ))}
          </ul>
        </ModalBody>
      </Modal>
      <div className="boardGame">
        <div className="dice">
          {userInfo ? (
            <div>
              <img
                className="mb-3"
                alt="avatar"
                src={Avatar}
                width={50}
                height={50}
              />
              <p>{userInfo?.given_name + ' ' + userInfo?.family_name}</p>
              <Button
                id="logout-button"
                onClick={logout}
                style={{ zIndex: '1000', position: 'relative' }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <p>loading user info...</p>
          )}
        </div>
        <div>
          <div className="table">{boardHtml}</div>
        </div>
        <div
          className="dice"
          style={{ cursor: disable ? 'not-allowed' : 'default' }}
        >
          <Button
            variant="primary"
            onClick={onRollDiceClick}
            disabled={disable}
          >
            Roll the dice
          </Button>
          <span style={{ padding: '2rem' }}>
            {gameStart
              ? ` ${userInfo?.given_name} moved
              ${diceValue} Tile(s)
               `
              : 'Start throwing the Dice'}
          </span>
          <Button onClick={() => resetBtn()} style={{ zIndex: '1000' }}>
            Reset Game
          </Button>
        </div>
      </div>
    </>
  );
};

export default Board;

//Need help with the Following
