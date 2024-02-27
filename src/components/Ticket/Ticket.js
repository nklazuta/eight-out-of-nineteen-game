import { useCallback, useState } from 'react';
import MagicIcon from '../../assets/utils/icons';
import Field from '../Field/Field';
import './Ticket.css';
import {
  FIRST_ARR,
  FIRST_ARR_NUM_QUANTITY,
  FIRST_ARR_TYPE,
  RETRY_NUMBER,
  SECOND_ARR,
  SECOND_ARR_NUM_QUANTITY,
  SECOND_ARR_TYPE,
  TIMEOUT_DELAY,
  WINNING_QUANTITY,
} from '../../assets/utils/constants';
import getUniqueRandomNumber from '../../assets/utils/utils';
import MiniPreloader from '../MiniPreloader/MiniPreloader';

// info for ticket number fields
const fieldsArr = [
  {
    type: FIRST_ARR_TYPE,
    arr: FIRST_ARR,
    quantity: FIRST_ARR_NUM_QUANTITY,
  },
  {
    type: SECOND_ARR_TYPE,
    arr: SECOND_ARR,
    quantity: SECOND_ARR_NUM_QUANTITY,
  },
];

function Ticket({ ticketNumber }) {
  const [isWin, setIsWin] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState({
    [FIRST_ARR_TYPE]: [],
    [SECOND_ARR_TYPE]: [],
  });

  // disable game button if the length of the array of selected numbers
  // for the first field is not equal to 8 and for the second field is not equal to 1
  const isSubmitDisabled = !(
    selectedNumbers[FIRST_ARR_TYPE].length === FIRST_ARR_NUM_QUANTITY
    && selectedNumbers[SECOND_ARR_TYPE].length === SECOND_ARR_NUM_QUANTITY
  );

  // number click handler
  const handleSelectNumber = useCallback(({ number, type }) => {
    setSelectedNumbers((prevVal) => ({
      ...prevVal,
      [type]: prevVal[type].includes(number)
        ? prevVal[type].filter((item) => item !== number)
        : [...prevVal[type], number],
    }));
  }, []);

  // magic wand button handler
  function selectRandom() {
    const randomNumbers = { [FIRST_ARR_TYPE]: [], [SECOND_ARR_TYPE]: [] };

    fieldsArr.forEach((field) => {
      for (let i = 0; i < field.quantity; i += 1) {
        const random = getUniqueRandomNumber(
          field.arr.length,
          randomNumbers[field.type],
        );
        randomNumbers[field.type].push(random);
      }
    });

    setSelectedNumbers(randomNumbers);
  }

  // send game data to fake server
  async function sendTicket({ data }) {
    // show game result for success request
    function showSuccessMsg() {
      setIsWin(data.isTicketWon);
      setIsShowResult(true);
      setTimeout(() => {
        setIsShowResult(false);
        setIsPending(false);
      }, TIMEOUT_DELAY);
    }

    // show game result for request error
    function showErrMsg() {
      setIsError(true);
      setIsShowResult(true);
      setTimeout(() => {
        setIsShowResult(false);
        setIsPending(false);
      }, TIMEOUT_DELAY);
      setTimeout(() => setIsError(false), TIMEOUT_DELAY * 1.2);
    }

    const fetcher = (url, options) => fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...options,
    });

    async function retry() {
      for (let i = 0; i < RETRY_NUMBER; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => { setTimeout(resolve, TIMEOUT_DELAY); });

        // eslint-disable-next-line no-await-in-loop
        const retryResponse = await fetcher('/api/tickets', {
          method: 'POST',
          body: JSON.stringify({ data }),
        });

        if (retryResponse.ok) {
          showSuccessMsg();
          return;
        }
      }

      showErrMsg();
    }

    try {
      const res = await fetcher('/api/tickets', {
        method: 'POST',
        body: JSON.stringify({ data }),
      });

      if (res.ok) {
        showSuccessMsg();
      } else {
        retry();
      }
    } catch (error) {
      retry();
    }
  }

  // ticket winning numbers
  function findWinningNumbers() {
    const winningNumbers = { [FIRST_ARR_TYPE]: [], [SECOND_ARR_TYPE]: [] };

    fieldsArr.forEach((field) => {
      for (let i = 0; i < field.quantity; i += 1) {
        const random = getUniqueRandomNumber(
          field.arr.length,
          winningNumbers[field.type],
        );
        winningNumbers[field.type].push(random);
      }
    });

    return winningNumbers;
  }

  // show result button handler
  function showResult() {
    const winningNumbers = findWinningNumbers();
    const keysArr = Object.keys(selectedNumbers);
    const result = Object.values(selectedNumbers).reduce((prevVal, arr, i) => {
      const totalPerArr = arr.reduce((prevTotal, item) => {
        if (winningNumbers[keysArr[i]].includes(item)) return prevTotal + 1;
        return prevTotal;
      }, 0);

      return prevVal + totalPerArr;
    }, 0);

    const data = {
      selectedNumber: {
        firstField: selectedNumbers[FIRST_ARR_TYPE],
        secondField: selectedNumbers[SECOND_ARR_TYPE],
      },
      isTicketWon: result >= WINNING_QUANTITY,
    };

    setIsPending(true);
    sendTicket({ data });
  }

  return (
    <section className="ticket">
      <div className="ticket__heading">
        <p className="ticket__title">
          Билет
          {' '}
          {ticketNumber}
        </p>
        <button
          className={`ticket__magic-btn ${
            isShowResult ? 'ticket__magic-btn_hidden' : ''
          }`}
          type="button"
          aria-label="Выбрать случайные числа"
          onClick={selectRandom}
        >
          <MagicIcon
            mainClassName="ticket__magic-icon"
            fillClassName="ticket__magic-icon-fill"
          />
        </button>
      </div>

      <div className="ticket__content">
        <div
          className={`ticket__game-container ${
            isShowResult ? 'ticket__game-container_hidden' : ''
          }`}
        >
          <div className="ticket__fields">
            {fieldsArr.map((field, i) => (
              <Field
                data={field}
                fieldNumber={i + 1}
                selectedNumbers={selectedNumbers[field.type]}
                onNumberClick={handleSelectNumber}
                key={field.type}
              />
            ))}
          </div>

          <button
            className={`ticket__submit-btn ${
              isSubmitDisabled || isPending ? 'ticket__submit-btn_disabled' : ''
            }`}
            type="button"
            onClick={showResult}
          >
            {isPending ? <MiniPreloader /> : <p className="ticket__btn-text">Показать результат</p>}
          </button>
        </div>

        <div
          className={`ticket__result-container ${
            isShowResult ? 'ticket__result-container_visible' : ''
          }`}
        >
          {isError ? (
            <p className="ticket__text">
              Произошла ошибка. Пожалуйста, повторите ваш запрос позже.
            </p>
          ) : (
            <p className="ticket__text">
              {isWin
                ? 'Ого, вы выиграли! Поздравляем!'
                : 'Увы, вы проиграли. Возможно, в следующий раз вам повезет больше!'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Ticket;
