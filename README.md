# 💰 Smart Budget Tracker

An intelligent personal finance application with a **mock** AI-powered transaction categorization service. The current implementation simulates TensorFlow.js predictions and training while the UI and data layer are prepared for a real model. Track your spending, manage budgets, set financial goals, and let the demo AI categorize your transactions.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.15.0-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🤖 AI-Powered Categorization
- **Demo Neural Network**: Simulated TensorFlow.js service for transaction categorization
- **Smart Learning**: Trains on your spending patterns automatically and persists model metadata locally
- **Confidence Scoring**: Each prediction comes with confidence metrics
- **Continuous Improvement**: Learns from your corrections
- **Privacy-First**: All AI processing happens locally in your browser

### 💳 Financial Management
- **Budget Allocation**: Set monthly budgets for each category
- **Real-time Tracking**: Monitor spending vs. budget in real-time
- **Goal Setting**: Create and track financial savings goals
- **Bank Integration**: Mock Plaid integration (demo purposes)
- **Transaction Management**: Add manual transactions or import from banks

### 📊 Smart Analytics
- **Performance Dashboard**: Track AI model accuracy and performance
- **Spending Insights**: Visual breakdown of spending by category
- **Progress Tracking**: Monitor goal achievement and budget adherence
- **Transaction History**: Complete audit trail with categorization metadata

### 🎨 Modern UI/UX
- **Beautiful Design**: Gradient-based UI with Tailwind CSS
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback and animations
- **Accessibility**: Built with modern web standards

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- Modern web browser with WebGL support (for TensorFlow.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-budget-tracker.git
   cd smart-budget-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the application.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## 🧠 How the AI Works

### Neural Network Architecture
The app uses a multi-layer neural network implemented with TensorFlow.js:
- **Input Layer**: Transaction description text features
- **Hidden Layers**: 256 → 128 → 64 neurons with ReLU activation
- **Output Layer**: 8 category classifications with softmax activation

### Training Process
1. **Data Collection**: Gathers transactions with user-confirmed categories
2. **Feature Extraction**: Converts transaction descriptions to numerical features
3. **Model Training**: Uses supervised learning with backpropagation
4. **Validation**: Tests accuracy on holdout data
5. **Deployment**: Automatically replaces previous model when better

### Smart Features
- **Auto-training**: Triggers when you have 10+ categorized transactions
- **Fallback System**: Uses rule-based categorization when AI confidence is low
- **Learning Loop**: Incorporates user corrections into training data
- **Performance Metrics**: Real-time accuracy and confidence tracking

## 📱 Usage Guide

### Initial Setup
1. **Set Monthly Income**: Enter your monthly income to enable budget tracking
2. **Connect Bank Account**: Use the demo bank connection feature
3. **Review Categories**: The app comes with 8 default budget categories
4. **Add Custom Categories**: Create categories specific to your needs

### Budget Management
1. **Allocate Funds**: Distribute your income across budget categories
2. **Monitor Spending**: Watch real-time spending vs. budget comparisons
3. **Adjust as Needed**: Modify allocations based on spending patterns

### Transaction Handling
1. **Auto-Import**: Connected accounts automatically import transactions
2. **Manual Entry**: Add cash transactions or other manual entries
3. **Category Review**: AI suggests categories, but you can override
4. **Learning Mode**: Corrections help train the AI model

### Goal Setting
1. **Create Goals**: Set savings targets for specific purposes
2. **Track Progress**: Monitor goal achievement with visual progress bars
3. **Celebrate Success**: Get notified when goals are reached

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Beautiful, customizable SVG icons

### AI/ML
- **TensorFlow.js**: Machine learning in the browser
- **Neural Networks**: Multi-layer perceptron for classification
- **Natural Language Processing**: Text feature extraction
- **Model Persistence**: Local storage of trained models

### Development Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **React Scripts**: Zero-config build tooling

## 📁 Project Structure

```
smart-budget-tracker/
├── src/
│   ├── components/           # React components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── styles/              # CSS and styling
│   └── App.tsx              # Main application component
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## 🔐 Privacy & Security

- **Local Processing**: All AI computations happen in your browser
- **No Data Transmission**: Transaction data never leaves your device
- **Secure Storage**: Uses browser's local storage securely
- **No External APIs**: Complete offline functionality for core features

## 📊 Performance

The app is optimized for performance:
- **Lazy Loading**: Components load only when needed
- **Efficient AI**: Optimized TensorFlow.js models
- **Minimal Bundle**: Tree-shaking removes unused code
- **Fast Rendering**: Optimized React rendering patterns

## 🐛 Known Issues

- Bank integration is currently for demo purposes only
- AI model requires 10+ transactions for optimal performance
- Large transaction histories may impact performance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- TensorFlow.js team for making ML in the browser possible
- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Lucide for beautiful icons

## 📧 Contact

For questions, suggestions, or issues, please open a GitHub issue or contact the maintainer.

---

**Built with ❤️ and 🧠 AI** - Making personal finance smarter, one transaction at a time!
