import "./styles.scss";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

let answer = "";

const removeTags = (string) => string.replace(/<[^>]*>?/gm, "");

export default function App() {
  const [questionData, setQuestionData] = useState([]);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showResult, setShowResult] = useState(false);

  /**
   * Get data from the API on first render
   */
  useEffect(() => {
    document.title = "Trivia Game";
    getQuestionData();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (showResult) compareAndReset();
    //eslint-disable-next-line
  }, [showResult]);

  /**
   * Show comparison for 3 seconds, then get the question data again
   */
  const compareAndReset = async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        setShowResult(false);
        resolve(true);
      }, 3000);
    });
    await getQuestionData();
  };

  /**
   * Logic for getting the data from the API
   */
  const getQuestionData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("https://jservice.io/api/random");
      setQuestionData(data[0].question);
      answer = removeTags(data[0].answer);
      // console.log(answer);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * will set the result passed temporarily to render
   * @param {String} userAnswer the answer provided as input
   */
  const submitAndCheck = async (userAnswer) => {
    setError(null);
    setShowResult(userAnswer);
  };

  if (showResult)
    return (
      <div className="app__container">
        <div className="results__container">
          <div>
            {showResult.toLowerCase() === answer.toLowerCase() ? (
              <>
                <div className="result correct">Correct Answer!</div>
                <div className="answer">Answer: {answer}</div>
              </>
            ) : (
              <>
                <div className="result wrong">Wrong Answer!</div>
                <div className="answer__comparison">
                  <div className="answer">Correct Answer: {answer}</div>
                  <div style={{ fontStyle: "italic" }}>
                    (Your answer: {showResult})
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div className="app__container">
      {isLoading ? (
        <div id="circle__loading"></div>
      ) : (
        <div className="main__container">
          <QuestionCard
            data={questionData}
            submitAndCheck={submitAndCheck}
            setError={(errorText) => {
              setError(errorText);
            }}
          />
          {error && <div>Error: {error}</div>}
        </div>
      )}
    </div>
  );
}

const QuestionCard = ({ data, submitAndCheck, setError }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    if (!userAnswer) setError("Answer must not be empty!");
    submitAndCheck(userAnswer);
  };

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="question__card">
      <form onSubmit={submitHandler}>
        <div className="question__title">{data}</div>
        <div className="answer__section">
          <input
            autoComplete="off"
            id="answer__input"
            ref={(node) => (inputRef.current = node)}
            placeholder="Enter your answer here"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
        </div>

        <div className="button__section">
          <button disabled={!userAnswer} type="submit" id="submit__btn">
            Submit Answer
          </button>
        </div>

        {/* <button
          type="button"
          onClick={() => setError("Value must not be empty!")}
        >
          Set Error
        </button> */}
      </form>
    </div>
  );
};
