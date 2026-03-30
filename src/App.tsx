import { useState } from "react";
import { WordLine } from "./components/word-line";
import logo from "./assets/logo-eternoo.svg";
import { getRandomWord, isValidWord } from "./utils/dictonary";
import { toast } from "sonner";

import { LetterVariant } from "./types/letter-variant";
import { AttemptedWordState } from "./types/attempted-word-state";
import { Keyboard } from "./components/keyboard";
import { FinishDialog, type Result } from "./components/finish-dialog";
import { getHitmap } from "./utils/get-hit-map";

type AttemptedWord = {
  wordArray: string[];
  letterHits: LetterVariant[];
  state: AttemptedWordState;
};

type KeyHit = "notUsed" | "wrong" | "exists" | "right";

const STREAK_KEY = "eternoo_streak";

function getStreak(): number {
  return Number(localStorage.getItem(STREAK_KEY) ?? 0);
}

function saveStreak(value: number) {
  localStorage.setItem(STREAK_KEY, String(value));
}

function App() {
  const [attemptedWords, setAttemptedWords] = useState<AttemptedWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState<string[]>([]);
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  const [secretWord, setSecretWord] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const w = params.get("w");
    if (w) {
      try {
        return atob(w).toUpperCase().split("");
      } catch {
        toast.error("Link inválido");
        return getRandomWord().split("");
      }
    }
    return getRandomWord().split("");
  });
  const [result, setResult] = useState<Result>({
    guessed: false,
    attempts: 0,
    streak: 0,
    secretWord: "",
  });

  const hitPriority: Record<KeyHit, number> = {
    notUsed: 0,
    wrong: 1,
    exists: 2,
    right: 3,
  };
  const keyHits: Record<string, KeyHit> = {};
  for (const word of attemptedWords) {
    word.wordArray.forEach((letter, i) => {
      const hit = word.letterHits[i] as KeyHit;
      if (!keyHits[letter] || hitPriority[hit] > hitPriority[keyHits[letter]]) {
        keyHits[letter] = hit;
      }
    });
  }

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
      toast.error("Insira uma palavra");
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

    const checkedWordArray = checkLetterInRightWord(wordArray, secretWord);
    const submittedWords = [...attemptedWords];
    const newSubmittedWord = {
      wordArray,
      letterHits: checkedWordArray,
      state: AttemptedWordState.Submitted,
    };
    submittedWords[index] = newSubmittedWord;
    setAttemptedWords(submittedWords);

    if (
      currentWordIndex === 5 &&
      !checkedWordArray.every((hit) => hit === "right")
    ) {
      saveStreak(0);
      setResult({
        guessed: false,
        attempts: 6,
        streak: 0,
        secretWord: secretWord.join(""),
      });
      setIsFinishDialogOpen(true);
      return;
    }

    if (checkedWordArray.every((hit) => hit === "right")) {
      const newStreak = getStreak() + 1;
      saveStreak(newStreak);
      setResult({
        guessed: true,
        attempts: currentWordIndex + 1,
        streak: newStreak,
        secretWord: secretWord.join(""),
      });
      setIsFinishDialogOpen(true);
      return;
    }

    setCurrentWordIndex(currentWordIndex + 1);
    setCurrentAttempt([]);
    return;
  }

  function handleKeyPress(key: string) {
    if (!key) return;

    if (key === "⌫" && currentAttempt.length > 0) {
      const attempt = currentAttempt.slice(0, -1) ?? [""];
      setCurrentAttempt(attempt);
      return;
    }

    if (key.length === 1 && key.match(/[a-z]/i)) {
      setCurrentAttempt([...currentAttempt, key.toUpperCase()]);
    }

    if (key === "ENTER") {
      handleSubmitWord(currentAttempt, currentWordIndex);
      return;
    }
  }

  function copyResultHitmapToClipboard() {
    const hitmap = getHitmap(
      getStreak(),
      attemptedWords.map((word) => word.letterHits),
    );
    navigator.clipboard.writeText(hitmap);
  }

  function handleNextWord() {
    setAttemptedWords([]);
    setCurrentWordIndex(0);
    setSecretWord(getRandomWord().split(""));
    setCurrentAttempt([]);
    setIsFinishDialogOpen(false);
    window.history.replaceState(null, "", window.location.pathname);
  }

  function handleShareLink() {
    const encoded = btoa(secretWord.join("").toLowerCase());
    const url = `${window.location.origin}${window.location.pathname}?w=${encoded}`;
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="flex flex-col h-dvh overflow-hidden py-3">
      <header className="w-full h-14 flex items-center justify-center flex-col gap-2 pt-4">
        <img
          src={logo}
          alt="Eternoo Logo"
          className="w-42 h-42 lg:w-50 lg:h-50"
        />
        <p className="text-blue-foreground text-sm lg:text-sm">
          Sequência atual:{" "}
          <strong className="font-semibold">{getStreak()}</strong>🔥
        </p>
      </header>
      <main className="flex flex-1 flex-col items-center mt-10 justify-between overflow-hidden">
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="flex items-center justify-between flex-col gap-1">
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
          </div>
        </div>
        <Keyboard keyHits={keyHits} onKey={handleKeyPress} />
      </main>
      <FinishDialog
        isOpen={isFinishDialogOpen}
        setOpenFn={setIsFinishDialogOpen}
        result={result}
        onCopy={copyResultHitmapToClipboard}
        onNext={handleNextWord}
        onShareLink={handleShareLink}
      />
    </div>
  );
}

export default App;
