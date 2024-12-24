import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

// [DIFFICULTY_CARDS 객체는 동일하게 유지]

const Card = ({ isFlipped, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-full aspect-square bg-white rounded-lg shadow-lg overflow-hidden"
      style={{touchAction: 'manipulation'}}
    >
      <div
        className={`absolute inset-0 bg-pink-50 flex items-center justify-center rounded-lg border-2 border-pink-200 ${
          isFlipped ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}
      >
        <span className="text-pink-400 text-2xl sm:text-4xl font-bold">?</span>
      </div>
      <div
        className={`absolute inset-0 bg-white flex items-center justify-center ${
          isFlipped ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
      >
        <span className="text-2xl sm:text-4xl">{children}</span>
      </div>
    </button>
  );
};

const DifficultySelector = ({ difficulty, onSelect }) => (
  <div className="flex gap-2 justify-center w-full">
    {Object.keys(DIFFICULTY_CARDS).map((level) => (
      <button
        key={level}
        onClick={() => onSelect(level)}
        className={`flex-1 max-w-[100px] px-2 py-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 ${
          difficulty === level 
            ? 'bg-pink-100 text-pink-500 font-medium border-2 border-pink-300' 
            : 'bg-white text-pink-400 border-2 border-pink-200 hover:border-pink-300'
        }`}
      >
        {level}
      </button>
    ))}
  </div>
);

const MemoryGame = () => {
  // [상태 관리 코드는 동일하게 유지]

  return (
    <div className="w-full max-w-sm mx-auto">
      <h1 className="text-2xl sm:text-3xl font-medium text-pink-500 mb-6 text-center">
        귀여운 기억력 게임
      </h1>
      
      <DifficultySelector difficulty={difficulty} onSelect={setDifficulty} />
      
      <div className="flex flex-col items-center gap-4 my-6">
        <div className="text-pink-500">
          최고 기록: <span className="font-semibold">{bestScores[difficulty] === Infinity ? '도전해보세요!' : `${bestScores[difficulty]}번`}</span>
        </div>
        <button 
          onClick={shuffleCards}
          className="w-full max-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-pink-500 transition-colors shadow-lg font-medium"
          style={{touchAction: 'manipulation'}}
        >
          <Sparkles className="w-5 h-5" />
          {matched.length > 0 ? '다시 시작' : '게임 시작'}
        </button>
      </div>

      <div className="w-full">
        <div 
          className={`grid gap-2 ${
            difficulty === '3x4' ? 'grid-cols-3' :
            difficulty === '4x4' ? 'grid-cols-4' :
            'grid-cols-5'
          }`}
        >
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
      </div>

      {matched.length === cards.length && (
        <div className="mt-6 p-4 bg-pink-100 rounded-xl text-center">
          <p className="text-xl sm:text-2xl font-bold text-pink-600">
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
    <div className="min-h-screen w-full bg-pink-50 py-6 px-4">
      <MemoryGame />
    </div>
  );
};

export default App;