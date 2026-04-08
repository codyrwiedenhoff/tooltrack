'use client';

interface Card {
  title: string;
  value: string | number;
  color: string;
  icon: string;
}

export function OverviewCards({ cards }: { cards: Card[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} rounded-lg shadow p-6 text-white`}
        >
          <div className="text-4xl mb-2">{card.icon}</div>
          <div className="text-sm opacity-80">{card.title}</div>
          <div className="text-3xl font-bold">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
