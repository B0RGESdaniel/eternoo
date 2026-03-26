import { WordLine } from "./components/word-line";
import type { LetterVariant } from "./components/word-line";
import logo from "./assets/logo-eternoo.svg";

function App() {
  const mock_words: { word: string; letterVariants: LetterVariant[] }[] = [
    {
      word: "acaso",
      letterVariants: ["exists", "exists", "right", "right", "exists"],
    },
    {
      word: "forte",
      letterVariants: ["wrong", "exists", "wrong", "right", "right"],
    },
    {
      word: "corda",
      letterVariants: ["active", "active", "active", "active", "active"],
    },
    { word: "", letterVariants: [] },
    { word: "", letterVariants: [] },
    { word: "", letterVariants: [] },
  ];
  return (
    <div className="flex-1 p-6">
      <header className="w-full h-14 flex items-center justify-center flex-col gap-2 p-4">
        <img src={logo} alt="Eternoo Logo" className="w-42 h-42" />
      </header>
      <main className="w-full flex items-center justify-center flex-col gap-1 mt-4">
        {/*<button className="w-6 h-6 flex items-center justify-center bg-secondary-background border border-blue-foreground text-blue-foreground rounded-md cursor-pointer">
          A
        </button>*/}
        <WordLine
          word={mock_words[0].word}
          letterVariants={mock_words[0].letterVariants}
        />
        <WordLine
          word={mock_words[1].word}
          letterVariants={mock_words[1].letterVariants}
        />
        <WordLine
          word={mock_words[2].word}
          letterVariants={mock_words[2].letterVariants}
        />
        <WordLine />
        <WordLine />
        <WordLine />
      </main>
    </div>
  );
}

export default App;
