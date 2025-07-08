import React from 'react';

const features = [
  {
    name: 'Algochurn',
    description: 'Prepare for tech interviews like never before.',
    image: '/cursorlogo.png',
  },
  {
    name: 'Tailwind Master Kit',
    description: 'Production ready Tailwind css components for your next project.',
    image: '/lovablelogo.png',
  },
  {
    name: 'Moonbeam',
    description: 'Never write from scratch again. Go from idea to blog in minutes.',
    image: '/darkmode.png',
  },
  {
    name: 'Rogue',
    description: 'Respond to government RFPs, RFIs and RFQs 10x faster using AI.',
    image: '/minimlistic.png',
  },
];

const FeaturesMenu = () => {
  return (
    <div className="absolute top-full mt-4 w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="grid grid-cols-2 gap-6">
        {features.map((feature) => (
          <div key={feature.name} className="flex items-start space-x-4">
            <div className="w-24 h-16 bg-gray-200 rounded-md flex-shrink-0">
              <img src={feature.image} alt={feature.name} className="w-full h-full object-cover rounded-md" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{feature.name}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesMenu; 