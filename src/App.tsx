import { useState, useEffect } from "react";
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
  const [currentAttemptIndex, setCurrentAttemptIndex] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState<string[]>([]);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);
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
    if (Number(index) === currentAttemptIndex) {
      return "active";
    }
    return "disabled";
  }

  function handleSubmitWord(wordArray: string[], index: number) {
    const filled = wordArray.filter(Boolean);

    if (filled.length === 0) {
      toast.error("Insira uma palavra");
      return;
    }

    if (filled.length < 5) {
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
    setCurrentFocusIndex(0);

    if (
      currentAttemptIndex === 5 &&
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
        attempts: currentAttemptIndex + 1,
        streak: newStreak,
        secretWord: secretWord.join(""),
      });
      setIsFinishDialogOpen(true);
      return;
    }

    setCurrentAttemptIndex(currentAttemptIndex + 1);
    setCurrentAttempt([]);
    return;
  }

  function handleKeyPress(key: string) {
    if (!key) return;

    if (key === "DELETE") {
      const newAttempt = [...currentAttempt];
      if (newAttempt[currentFocusIndex]) {
        newAttempt[currentFocusIndex] = "";
        setCurrentAttempt(newAttempt);
      } else if (currentFocusIndex > 0) {
        newAttempt[currentFocusIndex - 1] = "";
        setCurrentAttempt(newAttempt);
        setCurrentFocusIndex(currentFocusIndex - 1);
      }
      return;
    }

    if (key.length === 1 && key.match(/[a-z]/i)) {
      if (currentFocusIndex >= 5) return;
      const newAttempt = [...currentAttempt];
      newAttempt[currentFocusIndex] = key.toUpperCase();
      setCurrentAttempt(newAttempt);
      setCurrentFocusIndex(Math.min(currentFocusIndex + 1, 4));
      return;
    }

    if (key === "ENTER") {
      handleSubmitWord(currentAttempt, currentAttemptIndex);
      return;
    }
  }

  useEffect(() => {
    function handlePhysicalKey(e: KeyboardEvent) {
      if (isFinishDialogOpen) return;
      if (e.key === "Backspace") return handleKeyPress("DELETE");
      if (e.key === "Enter") return handleKeyPress("ENTER");
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentFocusIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentFocusIndex((i) => Math.min(i + 1, 4));
        return;
      }
      if (e.key.length === 1 && e.key.match(/[a-z]/i)) handleKeyPress(e.key);
    }
    window.addEventListener("keydown", handlePhysicalKey);
    return () => window.removeEventListener("keydown", handlePhysicalKey);
  }, [
    currentAttempt,
    currentAttemptIndex,
    currentFocusIndex,
    isFinishDialogOpen,
  ]);

  function copyResultHitmapToClipboard() {
    const hitmap = getHitmap(
      getStreak(),
      attemptedWords.map((word) => word.letterHits),
    );
    navigator.clipboard.writeText(hitmap);
  }

  function handleNextWord() {
    setAttemptedWords([]);
    setCurrentAttemptIndex(0);
    setSecretWord(getRandomWord().split(""));
    setCurrentAttempt([]);
    setIsFinishDialogOpen(false);
    window.history.replaceState(null, "", window.location.pathname);
  }

  function handleShareLink() {
    const encoded = btoa(secretWord.join("").toLowerCase());
    const url = `${window.location.origin}${window.location.pathname}?w=${encoded}`;
    const text = "Tente acertar essa palavra: " + url;
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="flex flex-col h-dvh overflow-hidden py-3">
      <header className="w-full h-14 flex items-center justify-center flex-col gap-1">
        <img src={logo} alt="Eternoo Logo" className="w-35 h-35" />
        <p className="text-blue-foreground text-sm lg:text-xs">
          Sequência atual:{" "}
          <strong className="font-semibold">{getStreak()}</strong>🔥
        </p>
      </header>
      <main className="flex-1 flex flex-col items-center justify-between overflow-hidden">
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="flex items-center justify-between flex-col gap-1">
            {Array.from({ length: 6 }).map((_, index) => {
              return (
                <WordLine
                  key={index}
                  state={getWordStateByIndex(index)}
                  letterVariants={attemptedWords[index]?.letterHits}
                  wordArrayValue={currentAttempt}
                  word={attemptedWords[index]?.wordArray.join("")}
                  currentFocusIndex={currentFocusIndex}
                  setCurrentFocusIndex={setCurrentFocusIndex}
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
