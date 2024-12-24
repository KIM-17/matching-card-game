import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
const DIFFICULTY_CARDS = {
  easy: [
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭',
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭'
  ],
  medium: [
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭', '🎨', '🎪',
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭', '🎨', '🎪'
  ],
  hard: [
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭', '🎨', '🎪', '🎡', '🎢',
    '🌸', '🌟', '🎀', '🦄', '🌈', '🍭', '🎨', '🎪', '🎡', '🎢'
  ]
};

const DIFFICULTY_LABELS = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움'
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
  <div className="flex gap-2 justify-center mb-6">
    {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
      <button
        key={key}
        onClick={() => onSelect(key)}
        className={`px-4 py-2 rounded-lg text-lg ${
          difficulty === key 
            ? 'bg-pink-500 text-white' 
            : 'bg-pink-100 text-pink-500 hover:bg-pink-200'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
 );
 
 const MemoryGame = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [bestScores, setBestScores] = useState({
    easy: Infinity,
    medium: Infinity,
    hard: Infinity
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
    <div className="p-6 bg-pink-50 rounded-2xl max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-pink-500 text-center mb-6">
        귀여운 기억력 게임
      </h1>
      
      <DifficultySelector difficulty={difficulty} onSelect={setDifficulty} />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xl text-pink-600">시도: {moves}번</div>
          <div className="text-sm text-pink-400">
            최고 기록: {bestScores[difficulty] === Infinity ? '-' : `${bestScores[difficulty]}번`}
          </div>
        </div>
        <button 
          onClick={shuffleCards}
          className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg"
        >
          <Sparkles className="w-5 h-5" />
          <span>다시 시작</span>
        </button>
      </div>
 
      <div className={`grid gap-3 ${
        difficulty === 'easy' ? 'grid-cols-3' : 
        difficulty === 'medium' ? 'grid-cols-4' : 
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
    <div className="min-h-screen bg-pink-50 py-8">
      <MemoryGame />
    </div>
  );
 };
 
 export default App;
  