import { Dialog } from "@base-ui/react";
import { Copy, ArrowRight, Link } from "lucide-react";

interface FinishDialogProps {
  isOpen: boolean;
  setOpenFn: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FinishDialog({ isOpen, setOpenFn }: FinishDialogProps) {
  const getTitle = (guessed: boolean) =>
    guessed ? "Performático 🎭" : "Não foi dessa vez 👎";

  const mock_guesses = [
    { guessed: true, attempts: 4, streak: 5, secretWord: "adaga" },
    { guessed: false, attempts: 6, streak: 0, secretWord: "adaga" },
  ];

  const test_result = mock_guesses[1];

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpenFn}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-70 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 text-neutral outline-1 outline-muted-background transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0">
          <Dialog.Title className="-mt-1.5 mb-1 text-lg font-medium">
            {getTitle(test_result.guessed)}
          </Dialog.Title>
          <Dialog.Description className="text-blue-foreground">
            {test_result.guessed ? (
              <div className="flex flex-col gap-2 mt-3">
                <p>
                  Você acertou a palavra "{test_result.secretWord.toUpperCase()}
                  " em <strong>{test_result.attempts}</strong> tentativas!
                </p>
                <p>Sequência de acertos: {test_result.streak} 🔥</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-3">
                <p>A palavra era "{test_result.secretWord.toUpperCase()}"!</p>
                <p>
                  Clique em <strong>Próxima palavra</strong> para tentar outra!
                </p>
              </div>
            )}
          </Dialog.Description>
          <div className="flex flex-col gap-2 mt-4 font-medium">
            <button className="flex items-center gap-2 justify-center border border-primary text-primary rounded-md p-2.5">
              <Copy size={18} />
              Copiar resultado
            </button>
            <button className="flex items-center gap-2 justify-center border border-primary text-primary rounded-md p-2.5">
              <Link size={18} />
              Link da palavra
            </button>
            <button className="flex items-center gap-2 justify-center bg-primary border border-primary text-neutral rounded-md p-2.5">
              Próxima palavra
              <ArrowRight size={18} />
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
