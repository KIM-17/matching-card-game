import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const CARDS = [
  '🌸', '🌟', '🎀', '🦄', '🌈', '🍭',
  '🌸', '🌟', '🎀', '🦄', '🌈', '🍭'
];

const Card = ({ isFlipped, children, onClick }) => (
  <button
    onClick={onClick}
    className="relative w-full aspect-square bg-white rounded-xl shadow-lg overflow-hidden"
  >
    <div
      className={`absolute inset-0 bg-pink-100 flex items-center justify-center rounded-xl border-2 border-pink-200 ${
        isFlipped ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="text-pink-400 text-4xl font-bold">?</span>
    </div>
    <div
      className={`absolute inset-0 bg-white flex items-center justify-center ${
        isFlipped ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <span className="text-5xl">{children}</span>
    </div>
  </button>
);

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    const shuffled = [...CARDS]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ id: index, content: card }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    setFlipped([...flipped, id]);
    
    if (flipped.length === 1) {
      setMoves(m => m + 1);
      const firstCard = cards[flipped[0]];
      const secondCard = cards[id];
      
      if (firstCard.content === secondCard.content) {
        setMatched([...matched, flipped[0], id]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="p-6 bg-pink-50 rounded-2xl max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-pink-500 text-center mb-6">
        두근두근 매칭카드
      </h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl text-pink-600">시도: {moves}번</div>
        <button 
          onClick={shuffleCards}
          className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg"
        >
          <Sparkles className="w-5 h-5" />
          <span>다시 시작</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {cards.map((card) => (
          <Card
            key={card.id}
            isFlipped={flipped.includes(card.id) || matched.includes(card.id)}
            onClick={() => handleCardClick(card.id)}
          >
            {card.content}
          </Card>
        ))}
      </div>

      {matched.length === cards.length && (
        <div className="mt-6 p-4 bg-pink-100 rounded-xl text-center">
          <p className="text-2xl font-bold text-pink-600">
            🎉 축하합니다! 🎉
          </p>
          <p className="text-pink-500 mt-2">
            {moves}번 만에 성공하셨어요!
          </p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <MemoryGame />
  );
};

export default App;