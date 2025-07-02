# Cursor Rules Generator - Feature Extraction Tool

## Overview

This is the first part of a comprehensive Cursor Rules File generator. This phase focuses on extracting and suggesting features for web applications based on natural language descriptions.

## How It Works

### Step 1: App Idea Input
- User describes their app idea in natural language
- Example: "I want to build an AI travel planner generator for users that want to travel"

### Step 2: Feature Extraction
- Uses few-shot prompt engineering to extract features from the description
- Identifies explicitly mentioned features
- Suggests additional complementary features

### Step 3: Feature Selection
- Displays extracted features (auto-selected)
- Shows suggested additional features as multi-select options
- User can select which features to include in their app

## Features

✅ **Implemented:**
- Natural language app idea input
- AI-powered feature extraction (simulated)
- Multi-select feature selection interface
- Beautiful, animated UI with progress indicators
- Responsive design

🔄 **Coming Next:**
- Design style selection (Step 2 of the full tool)
- Cursor.rules file generation (Step 3 of the full tool)

## Technical Implementation

### Few-Shot Prompt Engineering
The tool uses carefully crafted examples covering different app categories:
- Travel applications
- E-commerce/Marketplace
- Fitness applications
- Educational platforms
- Social networking
- Productivity tools

### Intelligent Feature Detection
Currently uses keyword-based detection for:
- Travel/trip planning features
- Marketplace/e-commerce features
- Fitness/workout features
- Education/quiz features
- Social/sharing features
- Task/productivity features

## Using Real OpenAI API

To enable real GPT-powered feature extraction:

1. Get an OpenAI API key from https://platform.openai.com/
2. Add it to your environment variables:
   ```bash
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```
3. In `src/services/featureExtractionService.js`, change:
   ```javascript
   const result = await extractFeatures(appIdea, true); // Set to true
   ```

## Usage

1. Click "Generate" on the Cursor Rules File card
2. Enter your app idea description
3. Wait for feature extraction (2-3 seconds)
4. Review and select your desired features
5. Continue to the next step (coming soon)

## Example Results

**Input:** "I want to build an AI travel planner generator for users that want to travel"

**Extracted Features:**
- Travel planning
- Destination selection  
- AI-powered recommendations

**Suggested Features:**
- Budget tracking
- Weather integration
- Hotel booking
- Flight booking
- Local attractions finder
- Itinerary optimization
- Currency converter
- Travel checklist
- And more...

## File Structure

```
src/
├── components/
│   ├── CursorRulesGenerator.js    # Main component
│   ├── FeatureExtractor.js        # Handles feature extraction UI
│   └── ...
├── services/
│   └── featureExtractionService.js # AI/simulation service
└── ...
```

## Future Enhancements

- Real-time feature suggestions as user types
- Category-based feature filtering
- Custom feature addition
- Feature importance weighting
- Integration with actual Cursor rules templates 