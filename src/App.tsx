import { useState } from "react";
import { WordLine } from "./components/word-line";
import logo from "./assets/logo-eternoo.svg";
import { getRandomWord, isValidWord } from "./utils/dictonary";
import { toast } from "sonner";

import { LetterVariant } from "./types/letter-variant";
import { AttemptedWordState } from "./types/attempted-word-state";
import { Keyboard } from "./components/keyboard";

type AttemptedWord = {
  wordArray: string[];
  letterHits: LetterVariant[];
  state: AttemptedWordState;
};

function App() {
  const [attemptedWords, setAttemptedWords] = useState<AttemptedWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState<string[]>([]);

  const todaysWord = "adaga".toLocaleUpperCase().split("");

  function checkLetterInRightWord(
    attemptedWord: string[],
    rightWord: string[],
  ): LetterVariant[] {
    const result: LetterVariant[] = Array(attemptedWord.length).fill("wrong");
    const remainingRightLetters = [...rightWord];

    for (let i = 0; i < 5; i++) {
      if (attemptedWord[i] === rightWord[i]) {
        result[i] = "right";
        remainingRightLetters[i] = "";
      }
    }

    for (let i = 0; i < 5; i++) {
      if (result[i] === "right") continue;
      const j = remainingRightLetters.indexOf(attemptedWord[i]);
      if (j !== -1) {
        result[i] = "exists";
        remainingRightLetters[j] = "";
      }
    }

    return result;
  }

  function getWordStateByIndex(index: number): AttemptedWordState {
    if (attemptedWords[index]?.letterHits.length === 5) {
      return "submitted";
    }
    if (Number(index) === currentWordIndex) {
      return "active";
    }
    return "disabled";
  }

  function handleSubmitWord(wordArray: string[], index: number) {
    if (wordArray.length === 0) {
      return;
    }

    if (wordArray.length < 5) {
      toast.error("A palavra deve ter 5 letras");
      return;
    }

    if (!isValidWord(wordArray.join("").toLocaleLowerCase())) {
      toast.error("Essa palavra não é válida");
      return;
    }

    const checkedWordArray = checkLetterInRightWord(wordArray, todaysWord);
    const submittedWords = [...attemptedWords];
    const newSubmittedWord = {
      wordArray,
      letterHits: checkedWordArray,
      state: AttemptedWordState.Submitted,
    };
    submittedWords[index] = newSubmittedWord;
    setAttemptedWords(submittedWords);
    if (checkedWordArray.every((hit) => hit === "right")) {
      toast.success("Parabéns! Você acertou a palavra");
      return;
    }

    setCurrentWordIndex(currentWordIndex + 1);
    setCurrentAttempt([]);
    return;
  }

  return (
    <div className="flex-1 p-6">
      <header className="w-full h-14 flex items-center justify-center flex-col gap-2 p-4">
        <img src={logo} alt="Eternoo Logo" className="w-42 h-42" />
      </header>
      <main className="w-full flex items-center justify-center flex-col gap-1 mt-4">
        {/*<button className="w-6 h-6 flex items-center justify-center bg-secondary-background border border-blue-foreground text-blue-foreground rounded-md cursor-pointer">
          A
        </button>*/}
        {Array.from({ length: 6 }).map((_, index) => {
          return (
            <WordLine
              key={index}
              state={getWordStateByIndex(index)}
              letterVariants={attemptedWords[index]?.letterHits}
              wordArrayValue={currentAttempt}
              setWordArrayValue={setCurrentAttempt}
              word={attemptedWords[index]?.wordArray.join("")}
              onSubmit={() =>
                handleSubmitWord(currentAttempt, currentWordIndex)
              }
            />
          );
        })}
        <button
          type="button"
          onClick={() => handleSubmitWord(currentAttempt, currentWordIndex)}
          className="mt-4 w-24 p-2 rounded-md bg-primary font-medium"
        >
          Enviar
        </button>
        <Keyboard />
      </main>
    </div>
  );
}

export default App;
