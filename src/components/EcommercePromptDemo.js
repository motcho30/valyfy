import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PromptModal from './PromptModal';

const promptTemplates = [
  {
    id: 1,
    title: "SaaS Landing Page",
    description: "Build a modern SaaS landing page with animations and smooth scrolls",
    prompt: `I want you to implement a conversion-focused SaaS landing page.
Goal: Instantly captivate visitors, highlight product benefits, generate leads.
User Experience: Crisp design, clear feature highlights, and compelling CTAs for sign-ups.
Implementation Focus: Emphasize fast loading, mobile responsiveness, minimal-friction contact forms, and strong brand visuals.
Build Action: Immediately code the interactive layout with headings, hero sections, calls to action, and streamlined sign-up forms.`
  },
  {
    id: 2,
    title: "Authentication System",
    description: "Build a complete authentication system for your webapp",
    prompt: `Implement user authentication for this project.

- Add registration, login, and logout functionality.
- Store user credentials securely (use best practices for password hashing and storage).
- After login, redirect users to {post_login_url}.
- After logout, redirect users to {post_logout_url}.
- Restrict access to {protected_routes_or_pages} so only authenticated users can access them.
- Use environment variables for all sensitive configuration.
- Add clear comments and a brief README section explaining how to test authentication.

If any details are missing, ask for clarification before proceeding.`
  },
  {
    id: 3,
    title: "Stripe Payment System",
    description: "Implement a complete payment system with Stripe integration",
    prompt: `Integrate Stripe payment processing into this project.

- Add a payment flow so users can pay for {product_or_service}.
- Place the payment UI in {ui_component_location}.
- On successful payment, redirect to {success_url}.
- On payment failure, redirect to {failure_url}.
- Use {currency} as the transaction currency.
- Ensure all Stripe keys are managed securely via environment variables.
- Follow best security practices and do not hardcode secrets.
- Add clear code comments and a brief README section explaining how to test the payment flow.

If any information is missing, ask for clarification before proceeding.`
  },
  {
    id: 4,
    title: "OpenAI API Wrapper",
    description: "Create OpenAI wrapper functionality for your app",
    prompt: `Integrate a new feature using the OpenAI API.

- **Functionality:** I want users to {describe_user_goal_or_action_with_openai}, for example: {example_input} should result in {example_output}.
- **Location:** Add this feature to {ui_component_location} in the app.
- **API Documentation:** Before implementation, consult the latest OpenAI API docs here to understand usage, models, and best practices: https://platform.openai.com/docs
- **Model Selection:** Based on the docs and use case, choose the most suitable OpenAI model considering performance, cost, and capabilities.
- **Security:** Manage all API keys and configuration securely via environment variables; do not expose secrets in frontend code.
- **Error Handling:** Implement graceful error handling and user feedback for API failures or unexpected responses.
- **Testing & Docs:** Add clear comments and a README section explaining how to test this OpenAI integration.
- If any details are missing or unclear, ask for clarification before proceeding.`
  }
];

const EcommercePromptDemo = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  return (
    <>
      <div className="w-full max-w-6xl mx-auto my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {promptTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group bg-white rounded-xl border border-slate-200/70 p-6 flex flex-col h-full cursor-pointer"
            onClick={() => setSelectedPrompt(template)}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {template.title}
            </h3>
            <p className="text-slate-600 flex-grow">
              {template.description}
            </p>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl">
              <button
                className="text-white text-lg font-semibold py-2 px-4 rounded-lg bg-slate-800 bg-opacity-80"
              >
                View Prompt
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {selectedPrompt && (
        <PromptModal
          template={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </>
  );
};

export default EcommercePromptDemo; 