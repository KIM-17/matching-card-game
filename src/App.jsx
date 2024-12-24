import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const DIFFICULTY_CARDS = {
  '3x4': [
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭',
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭'
  ],
  '4x4': [
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭', '🎨', '🎪',
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭', '🎨', '🎪'
  ],
  '5x4': [
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭', '🎨', '🎪', '🎡', '🎢',
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭', '🎨', '🎪', '🎡', '🎢'
  ]
};

const DIFFICULTY_LABELS = {
  '3x4': '3 x 4',
  '4x4': '4 x 4',
  '5x4': '5 x 4'
};

const Card = ({ isFlipped, children, onClick }) => {
  return (
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
};

const DifficultySelector = ({ difficulty, onSelect }) => (
  <div className="flex gap-8 justify-center">
    {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
      <button
        key={key}
        onClick={() => onSelect(key)}
        className={`px-4 py-2 transition-all ${
          difficulty === key 
            ? 'text-pink-500 border-b-2 border-pink-500 font-medium' 
            : 'text-pink-300 hover:text-pink-400'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

const MemoryGame = () => {
  const [difficulty, setDifficulty] = useState('3x4');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [bestScores, setBestScores] = useState({
    '3x4': Infinity,
    '4x4': Infinity,
    '5x4': Infinity
  });

  const shuffleCards = () => {
    const shuffled = [...DIFFICULTY_CARDS[difficulty]]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ id: index, content: card }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    shuffleCards();
  }, [difficulty]);

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    setFlipped([...flipped, id]);
    
    if (flipped.length === 1) {
      setMoves(m => m + 1);
      const firstCard = cards[flipped[0]];
      const secondCard = cards[id];
      
      if (firstCard.content === secondCard.content) {
        const newMatched = [...matched, flipped[0], id];
        setMatched(newMatched);
        setFlipped([]);
        
        if (newMatched.length === cards.length) {
          setBestScores(prev => ({
            ...prev,
            [difficulty]: Math.min(prev[difficulty], moves + 1)
          }));
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-medium text-pink-500 mb-8 text-center">
        귀여운 기억력 게임
      </h1>
      
      <DifficultySelector difficulty={difficulty} onSelect={setDifficulty} />
      
      <div className="flex flex-col items-center gap-4 mt-12 mb-8">
        <div className="text-pink-500">
          최고 기록: <span className="font-semibold">{bestScores[difficulty] === Infinity ? '도전해보세요!' : `${bestScores[difficulty]}번`}</span>
        </div>
        <button 
          onClick={shuffleCards}
          className="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-2xl"
        >
          <Sparkles className="w-5 h-5" />
          {matched.length > 0 ? '다시 시작' : '게임 시작'}
        </button>
      </div>

      <div className={`grid gap-3 w-full ${
        difficulty === '3x4' ? 'grid-cols-3' :
        difficulty === '4x4' ? 'grid-cols-4' :
        'grid-cols-5'
      }`}>
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
          {moves === bestScores[difficulty] && (
            <p className="text-pink-400 mt-1">
              ✨ 새로운 최고 기록 달성! ✨
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen w-full bg-pink-50 px-4">
      <div className="w-full py-8">
        <MemoryGame />
      </div>
    </div>
  );
};

export default App;