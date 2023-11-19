import React, { useEffect, useState } from 'react';
import { ENDPOINTS, createAPIEndpoint } from '.';

// Function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = (array) => {
     for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
     }
     return array;
};

export default function FindCallNumber() {
     const [questions, setQuestions] = useState([]);
     const [selectedAnswer, setSelectedAnswer] = useState(null);
     const [streak, setStreak] = useState(0);
     const [question, setQuestion] = useState("");
     const [answerList, setAnswerList] = useState([]);
     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

     const fetchData = async () => {
          try {
               const res = await createAPIEndpoint(ENDPOINTS.findCallNumber).quiz();
               setQuestions(res.data);
               setAnswerList(res.data.map((question) => question[0].CallNumber));
               // set the question to the 3rd list in questions 
               setQuestion(res.data[2][0].Description);
               // Shuffle the answers for each question
               const shuffledQuestions = res.data.map((question) => shuffleArray(question));

               setQuestions(shuffledQuestions);
          } catch (error) {
               console.error("Error fetching quiz data", error);
          }
     };

     useEffect(() => {
          fetchData();
     }, []);

     const handleAnswerClick = (selectedAnswer) => {
          const expectedAnswer = answerList[currentQuestionIndex];

          if (selectedAnswer === expectedAnswer) {
               // If the selected answer is correct, move to the next question
               setCurrentQuestionIndex(currentQuestionIndex + 1);

               // Reset selected answer
               setSelectedAnswer(null);

               if (currentQuestionIndex === 2) {
                    // Check if the current question is the last one
                    alert("Well done you got the correct path");
                    setStreak(streak + 1);
                    restartQuiz();
               }
          } else {
               alert("Incorrect");
               restartQuiz();
               setStreak(0);
          }
     };

     const restartQuiz = () => {
          // Reset the state to restart the quiz
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          fetchData();
     };

     return (
          <div>
               <h3>Streak: {streak}</h3>
               <h1 style={{ color: 'white' }}>Find Call Number</h1>
               <h2 style={{ color: 'white' }}>Question: {question || "Loading..."}</h2>
               {questions[currentQuestionIndex]?.map((answer, index) => (
                    <button
                         key={index}
                         onClick={() => {
                              handleAnswerClick(answer.CallNumber);
                         }}
                         style={{ display: 'block', width: '600px', marginBottom: '10px' }}
                    >
                         {answer.CallNumber} {currentQuestionIndex === 2 ? "" : answer.Description}
                    </button>
               ))}
          </div>
     );
}
