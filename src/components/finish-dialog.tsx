import { useRef, useState } from "react";
import { Dialog } from "@base-ui/react";
import { Copy, ArrowRight, Link, Check } from "lucide-react";

export type Result = {
  guessed: boolean;
  attempts: number;
  streak: number;
  secretWord: string;
};

interface FinishDialogProps {
  isOpen: boolean;
  setOpenFn: React.Dispatch<React.SetStateAction<boolean>>;
  result: Result;
  onNext: () => void;
  onCopy: () => void;
  onShareLink: () => void;
}

export function FinishDialog({
  isOpen,
  setOpenFn,
  result,
  onNext,
  onCopy,
  onShareLink,
}: FinishDialogProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);
  const [linkedCopied, setLinkedCopied] = useState(false);

  function handleCopy() {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareLink() {
    onShareLink();
    setLinkedCopied(true);
    setTimeout(() => setLinkedCopied(false), 2000);
  }

  const getTitle = (guessed: boolean) =>
    guessed ? "Performático 🎭" : "Não foi dessa vez 👎";

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        setOpenFn(open);
        if (!open) onNext();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-70 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Popup
          initialFocus={titleRef}
          className="fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 text-neutral outline-1 outline-muted-background transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0"
        >
          <Dialog.Title
            ref={titleRef}
            tabIndex={-1}
            className="-mt-1.5 mb-1 text-lg font-medium outline-none"
          >
            {getTitle(result.guessed)}
          </Dialog.Title>
          <div className="flex flex-col gap-2 mt-3 text-blue-foreground text-sm">
            {result.guessed ? (
              <>
                <p>
                  Você acertou a palavra "{result.secretWord.toUpperCase()}" em{" "}
                  <strong className="text-primary">{result.attempts}</strong>{" "}
                  tentativa(s)!
                </p>
                <p>Sequência de acertos: {result.streak} 🔥</p>
              </>
            ) : (
              <>
                <p>A palavra era "{result.secretWord.toUpperCase()}"!</p>
                <p>
                  Clique em{" "}
                  <strong className="font-semibold">Próxima palavra</strong>{" "}
                  para tentar outra!
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4 font-medium text-sm">
            <button
              className="flex items-center gap-2 justify-center border border-primary text-primary rounded-md p-2.5 cursor-pointer"
              onClick={handleCopy}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copiado!" : "Copiar resultado"}
            </button>
            <button
              className="flex items-center gap-2 justify-center border border-primary text-primary rounded-md p-2.5 cursor-pointer"
              onClick={handleShareLink}
            >
              {linkedCopied ? <Check size={18} /> : <Link size={18} />}
              {linkedCopied ? "Link copiado!" : "Link da palavra"}
            </button>
            <button
              className="flex items-center gap-2 justify-center bg-primary border border-primary text-neutral rounded-md p-2.5  cursor-pointer"
              onClick={() => onNext()}
            >
              Próxima palavra
              <ArrowRight size={18} />
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
