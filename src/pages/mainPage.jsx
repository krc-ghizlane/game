import { useState, useEffect } from "react";
import { VolumeX, Volume2, Settings2, RotateCcw } from "lucide-react";

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [cardCount, setCardCount] = useState(4); // Default 4 cards (2x2)

  // Initialize cards
  const initializeCards = (count) => {
    const cardValues = Array(count / 2)
      .fill(0)
      .map((_, index) => index + 1);
    const duplicatedCards = [...cardValues, ...cardValues];
    const shuffledCards = duplicatedCards
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setStartTime(null);
    setEndTime(null);
    setGameStarted(false);
  };

  useEffect(() => {
    initializeCards(cardCount);
  }, [cardCount]);

  const handleCardClick = (cardId) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    if (
      flipped.length === 2 ||
      flipped.includes(cardId) ||
      matched.includes(cardId)
    )
      return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard.value === secondCard.value) {
        setMatched([...matched, firstId, secondId]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setEndTime(Date.now());
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const getGameTime = () => {
    if (!startTime || !endTime) return 0;
    return Math.floor((endTime - startTime) / 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
      <div className="bg-black/30 rounded-full px-6 py-2 mb-8 flex items-center gap-4">
        <button
          onClick={() => setMuted(!muted)}
          className="text-white hover:text-gray-200"
        >
          {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <button
          onClick={() => initializeCards(cardCount)}
          className="text-white hover:text-gray-200"
        >
          <RotateCcw size={24} />
        </button>
        <button
          onClick={() => {
            const sizes = [4, 16, 32];
            const currentIndex = sizes.indexOf(cardCount);
            const nextSize = sizes[(currentIndex + 1) % sizes.length];
            setCardCount(nextSize);
          }}
          className="text-white hover:text-gray-200"
        >
          <Settings2 size={24} />
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
        <div
          className={`grid gap-4 ${
            cardCount === 4
              ? "grid-cols-2"
              : cardCount === 16
              ? "grid-cols-4"
              : "grid-cols-8"
          }`}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                w-16 h-16 
                rounded-lg 
                cursor-pointer 
                transition-all 
                duration-300 
                transform 
                ${
                  flipped.includes(card.id) || matched.includes(card.id)
                    ? "rotate-0 bg-white"
                    : "rotate-180 bg-gray-800"
                }
                hover:scale-105
              `}
            >
              {(flipped.includes(card.id) || matched.includes(card.id)) && (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {card.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-white text-center">
        <p>Moves: {moves}</p>
        {endTime && <p>Completed in: {getGameTime()} seconds</p>}
      </div>
    </div>
  );
};

export default MemoryGame;
