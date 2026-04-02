"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizBlockProps {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

export function QuizBlock({ questions, onComplete }: QuizBlockProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIdx];
  if (!question && !finished) return null;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    if (idx === question.correct) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      const finalScore = Math.round(
        ((correctCount + (selectedAnswer === question.correct ? 1 : 0)) /
          questions.length) *
          100,
      );
      setFinished(true);
      onComplete?.(finalScore);
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <div className="text-5xl font-bold">{score}%</div>
          <p className="text-muted-foreground">
            You got {correctCount} out of {questions.length} correct
          </p>
          <Button onClick={handleRetry} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Question {currentIdx + 1} of {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium">{question.q}</p>
        <div className="space-y-2">
          {question.options.map((option, idx) => {
            const isCorrect = idx === question.correct;
            const isSelected = idx === selectedAnswer;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg border transition-colors",
                  !answered && "hover:bg-muted cursor-pointer",
                  answered && isCorrect && "border-green-500 bg-green-50",
                  answered && isSelected && !isCorrect && "border-red-500 bg-red-50",
                  !answered && isSelected && "border-primary bg-primary/5",
                )}
              >
                <div className="flex items-center gap-2">
                  {answered && isCorrect && (
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  )}
                  {answered && isSelected && !isCorrect && (
                    <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                  )}
                  <span className="text-sm">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
        {answered && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm">
            {question.explanation}
          </div>
        )}
        {answered && (
          <Button onClick={handleNext}>
            {currentIdx < questions.length - 1 ? "Next Question" : "See Results"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
