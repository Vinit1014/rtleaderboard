'use client';

import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';

// Define types for question and answer
interface Answer {
  answerText: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  answers: Answer[];
}

const QuizForm = ({ roomName }: { roomName: any }) => {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizDuration, setQuizDuration] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [roomId, setRoomId] = useState('');
  const [showQuizForm, setShowQuizForm] = useState(true); // State to toggle visibility

  const handleAddQuestion = async () => {
    const newQuestion: Question = {
      questionText: currentQuestion,
      answers: answers.map((answer, index) => ({
        answerText: answer,
        isCorrect: index === correctAnswer,
      })),
    };

    try {
      const response = await fetch('/api/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          questionText: currentQuestion,
          answers: newQuestion.answers,
        }),
      });

      if (response.ok) {
        toast.success('Question added successfully');
        setQuestions([...questions, newQuestion]);
        setCurrentQuestion('');
        setAnswers(['', '', '', '']);
        setCorrectAnswer(null);
      } else {
        toast.error('Failed to add question');
      }
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
    }
  };

  const handleSubmitQuizDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Saving quiz details...');
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName,
          quizTitle,
          quizDescription,
          quizDuration: parseInt(quizDuration, 10),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setRoomId(result.data.id);
        toast.success('Quiz details saved successfully', { id: toastId });
        setShowQuizForm(false); // Hide quiz form and show question form

        // Clear the form data
        setQuizTitle('');
        setQuizDescription('');
        setQuizDuration('');
      } else {
        toast.error('Failed to save quiz details', { id: toastId });
      }
    } catch (error) {
      console.error('Error saving quiz details:', error);
      toast.error('Failed to save quiz details', { id: toastId });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster richColors />
      {showQuizForm ? 
     
        <div>
          <h1 className="text-2xl mb-4">Create Quiz</h1>
          <form onSubmit={handleSubmitQuizDetails}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Quiz Title</label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Quiz Description</label>
              <textarea
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Quiz Duration (minutes)</label>
              <input
                type="number"
                value={quizDuration}
                onChange={(e) => setQuizDuration(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save Quiz Details
              </button>
            </div>
          </form>
        </div>
        :
        <div>
          <button
            className="mb-4 bg-gray-800 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setShowQuizForm(true)}
          >
            Back to Quiz Form
          </button>
          <h2 className="text-xl mb-2">Add Questions</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Question</label>
            <input
              type="text"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            {answers.map((answer, index) => (
              <div key={index} className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Answer {index + 1}</label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[index] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Correct Answer</label>
            <select
              value={correctAnswer ?? ''}
              onChange={(e) => setCorrectAnswer(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="" disabled>Select correct answer</option>
              {answers.map((_, index) => (
                <option key={index} value={index}>
                  Answer {index + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-gray-800 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Question
            </button>
          </div>
          <div>
            <h2 className="text-xl mb-2">Current Questions Added</h2>
            <ul className="space-y-4">
              {questions.map((question, index) => (
                <li key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="font-bold text-lg mb-2">{(index+1) + ". " + question.questionText}</h3>
                  <ul className="space-y-1">
                    {question.answers.map((answer, idx) => (
                      <li
                        key={idx}
                        className={`p-2 rounded ${
                          answer.isCorrect ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {answer.answerText} {answer.isCorrect && <span className="font-bold">(Correct)</span>}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        }
    </div>
  );
};

export default QuizForm;
