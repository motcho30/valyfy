import React from 'react';
import { DownloadCloud } from 'lucide-react';

const rules = [
  {
    title: "Building a mobile app?",
    subtitle: "Use the most popular tech stack (React Native + Expo) for your cursor rules.",
    file: "/Mobileapprules.md",
    fileName: "Mobileapprules.md",
    stack: "React Native + Expo"
  },
  {
    title: "Building a web app?",
    subtitle: "Use the most popular tech stack (React + Next.js) for your cursor rules.",
    file: "/Webbapprules.md",
    fileName: "Webbapprules.md",
    stack: "React + Next.js"
  }
];

const RuleCard = ({ title, subtitle, file, fileName, stack }) => (
  <div className="bg-slate-100/80 rounded-xl p-6 flex flex-col text-center">
    <h3 className="font-bold text-lg text-gray-900">{title}</h3>
    <p className="text-gray-600 mt-2 text-sm flex-grow">{`Use the most popular tech stack (${stack}) cursor rules file.`}</p>
    <a
      href={file}
      download={fileName}
      className="mt-6 bg-black text-white hover:bg-gray-800 transition-colors rounded-lg px-4 py-2.5 text-sm font-semibold flex items-center justify-center w-full"
    >
      <DownloadCloud className="w-4 h-4 mr-2" />
      Download Rules
    </a>
  </div>
);

const ProjectStarterKit = () => {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {rules.map((rule, index) => (
          <RuleCard key={index} {...rule} />
        ))}
      </div>
    </div>
  );
};

export default ProjectStarterKit; 