import React, { useState, useEffect, useRef } from 'react';
import {
  PlusCircle,
  Target,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  Link,
  Building,
  Sparkles,
  Zap,
  TrendingDown,
  Edit3,
  Save,
  X,
  Brain,
  Cpu,
} from 'lucide-react';
import {
  defaultCategories,
  CategoriesState,
} from './src/categories';
import { AICategorizer, fallbackRuleBased } from './src/aiService';

const BudgetingApp = () => {
  const [income, setIncome] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState<CategoriesState>(
    defaultCategories,
  );
  const [goals, setGoals] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [accounts, setAccounts] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  
  // Ikigai Integration
  const [ikigaiProfile, setIkigaiProfile] = useState({
    love: [],
    goodAt: [],
    worldNeeds: [],
    paidFor: [],
    purpose: '',
    completeness: 0
  });
  const [agentInsights, setAgentInsights] = useState([]);
  const [agentActions, setAgentActions] = useState([]);
  const [agentThinking, setAgentThinking] = useState('Analyzing your life-money alignment...');
  
  // AI-specific state
  const [aiModel, setAiModel] = useState(null);
  const [isTrainingAI, setIsTrainingAI] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(null);
  const [aiStats, setAiStats] = useState({
    totalPredictions: 0,
    aiPredictions: 0,
    rulePredictions: 0,
    averageConfidence: 0,
    modelAccuracy: 0,
    trainingDate: null
  });
  const [aiReady, setAiReady] = useState(false);
  
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: 'Other',
    type: 'expense'
  });
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: 0,
  });

  // Load persisted data
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    const storedModel = localStorage.getItem('aiModel');
    if (storedModel) {
      setAiModel(JSON.parse(storedModel));
      setAiReady(true);
    }
  }, []);

  // Persist transactions
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Persist model metadata
  useEffect(() => {
    if (aiModel) {
      localStorage.setItem('aiModel', JSON.stringify(aiModel));
    }
  }, [aiModel]);

  // Train AI model when we have enough data
  const trainAIModel = async () => {
    if (transactions.length < 10) {
      console.log('Need at least 10 transactions to train AI');
      return;
    }

    setIsTrainingAI(true);
    setTrainingProgress({ epoch: 0, accuracy: 0, loss: 0 });

    console.log('🧠 Starting AI training with', transactions.length, 'transactions...');

    const result = await AICategorizer.train(
      transactions.filter(t => t.category !== 'Other'),
      (progress) => {
        setTrainingProgress(progress);
        if (progress.isComplete) {
          setAiStats(prev => ({
            ...prev,
            modelAccuracy: progress.accuracy,
            trainingDate: new Date()
          }));
          setAiReady(true);
        }
      }
    );

    setIsTrainingAI(false);
    const modelData = {
      accuracy: result.accuracy,
      trainedOn: transactions.length,
      date: new Date().toISOString(),
    };
    setAiModel(modelData);
    console.log(
      '✅ AI training complete! Accuracy:',
      (result.accuracy * 100).toFixed(1) + '%'
    );
  };

  // Auto-categorization with AI
  const autoCategorizeWithAI = async (description) => {
    if (!aiReady) {
      // Fallback to rule-based if AI not ready
      const category = fallbackRuleBased(description);
      setAiStats(prev => ({
        ...prev,
        totalPredictions: prev.totalPredictions + 1,
        rulePredictions: prev.rulePredictions + 1
      }));
      return category;
    }

    const result = await AICategorizer.predict(description);
    
    // Update AI statistics
    setAiStats(prev => ({
      ...prev,
      totalPredictions: prev.totalPredictions + 1,
      aiPredictions: prev.aiPredictions + (result.method === 'AI' ? 1 : 0),
      rulePredictions: prev.rulePredictions + (result.method === 'Rules' ? 1 : 0),
      averageConfidence: ((prev.averageConfidence * (prev.totalPredictions - 1)) + result.confidence) / prev.totalPredictions
    }));

    return result.category;
  };

  // Auto-train AI when we have enough transactions
  useEffect(() => {
    if (transactions.length >= 15 && !aiReady && !isTrainingAI) {
      const validTransactions = transactions.filter(t => t.category !== 'Other');
      if (validTransactions.length >= 10) {
        console.log('🤖 Auto-triggering AI training...');
        setTimeout(() => trainAIModel(), 2000); // Small delay for better UX
      }
    }
  }, [transactions.length, aiReady, isTrainingAI]);

  // Mock Plaid data for demonstration
  const mockAccounts = [
    {
      id: 'acc1',
      name: 'Chase Checking ✨',
      type: 'depository',
      subtype: 'checking',
      balance: 2847.32,
      institution: 'Chase Bank',
      color: 'from-blue-600 to-cyan-500'
    },
    {
      id: 'acc2', 
      name: 'Chase Savings 💰',
      type: 'depository',
      subtype: 'savings',
      balance: 15420.18,
      institution: 'Chase Bank',
      color: 'from-green-600 to-emerald-500'
    },
    {
      id: 'acc3',
      name: 'Capital One Credit 💳',
      type: 'credit',
      subtype: 'credit card',
      balance: -1234.56,
      institution: 'Capital One',
      color: 'from-red-600 to-pink-500'
    }
  ];

  const mockTransactions = [
    { id: 't1', account_id: 'acc1', amount: -85.32, description: 'Starbucks Coffee Downtown ☕', date: '2025-01-20' },
    { id: 't2', account_id: 'acc1', amount: -45.00, description: 'Shell Gas Station #441 ⛽', date: '2025-01-19' },
    { id: 't3', account_id: 'acc1', amount: -1200.00, description: 'Monthly Rent Payment 🏠', date: '2025-01-18' },
    { id: 't4', account_id: 'acc2', amount: 2500.00, description: 'Payroll Direct Deposit 💰', date: '2025-01-17' },
    { id: 't5', account_id: 'acc3', amount: -67.89, description: 'Netflix Monthly Subscription 📺', date: '2025-01-16' },
    { id: 't6', account_id: 'acc1', amount: -125.50, description: 'Electric Company Bill ⚡', date: '2025-01-15' },
    { id: 't7', account_id: 'acc1', amount: -89.99, description: 'CVS Pharmacy Prescription 💊', date: '2025-01-14' },
    { id: 't8', account_id: 'acc1', amount: -42.30, description: 'Starbucks Pike Place ☕', date: '2025-01-13' },
    { id: 't9', account_id: 'acc1', amount: -15.99, description: 'Spotify Premium Subscription 🎵', date: '2025-01-12' },
    { id: 't10', account_id: 'acc3', amount: -156.78, description: 'Whole Foods Market Grocery 🛒', date: '2025-01-11' },
    { id: 't11', account_id: 'acc1', amount: -65.00, description: 'Uber Rides This Week 🚗', date: '2025-01-10' },
    { id: 't12', account_id: 'acc1', amount: -28.99, description: 'Disney Plus Annual Subscription 🎬', date: '2025-01-09' },
    { id: 't13', account_id: 'acc2', amount: -500.00, description: 'Transfer to Emergency Savings 💎', date: '2025-01-08' },
    { id: 't14', account_id: 'acc1', amount: -95.44, description: 'Verizon Wireless Monthly Bill 📱', date: '2025-01-07' },
    { id: 't15', account_id: 'acc3', amount: -234.56, description: 'Amazon Prime & Whole Foods 🛍️', date: '2025-01-06' }
  ];

  // Enhanced auto-categorization logic
  const autoCategorize = (description) => {
    const desc = description.toLowerCase();
    
    // First check if any custom categories match
    const customCategories = Object.keys(categories).filter(cat => categories[cat].isCustom);
    for (const customCat of customCategories) {
      if (desc.includes(customCat.toLowerCase()) || customCat.toLowerCase().includes(desc.split(' ')[0])) {
        return customCat;
      }
    }
    
    // Housing keywords
    if (desc.includes('rent') || desc.includes('mortgage') || desc.includes('apartment') || 
        desc.includes('lease') || desc.includes('property') || desc.includes('landlord') ||
        desc.includes('housing') || desc.includes('hoa')) return 'Housing';
    
    // Food keywords  
    if (desc.includes('grocery') || desc.includes('restaurant') || desc.includes('food') || 
        desc.includes('coffee') || desc.includes('whole foods') || desc.includes('starbucks') ||
        desc.includes('mcdonalds') || desc.includes('subway') || desc.includes('pizza') ||
        desc.includes('kroger') || desc.includes('walmart') || desc.includes('target') ||
        desc.includes('safeway') || desc.includes('publix') || desc.includes('dining') ||
        desc.includes('cafe') || desc.includes('bakery') || desc.includes('deli')) return 'Food';
    
    // Transportation keywords
    if (desc.includes('gas') || desc.includes('uber') || desc.includes('taxi') || 
        desc.includes('bus') || desc.includes('shell') || desc.includes('chevron') ||
        desc.includes('exxon') || desc.includes('bp ') || desc.includes('mobil') ||
        desc.includes('lyft') || desc.includes('metro') || desc.includes('parking') ||
        desc.includes('toll') || desc.includes('car payment') || desc.includes('auto') ||
        desc.includes('vehicle') || desc.includes('insurance auto')) return 'Transportation';
    
    // Utilities keywords
    if (desc.includes('electric') || desc.includes('water') || desc.includes('internet') || 
        desc.includes('phone') || desc.includes('cable') || desc.includes('utility') ||
        desc.includes('verizon') || desc.includes('at&t') || desc.includes('comcast') ||
        desc.includes('spectrum') || desc.includes('duke energy') || desc.includes('pge') ||
        desc.includes('gas company') || desc.includes('sewage') || desc.includes('trash')) return 'Utilities';
    
    // Entertainment keywords
    if (desc.includes('movie') || desc.includes('netflix') || desc.includes('spotify') || 
        desc.includes('game') || desc.includes('amazon prime') || desc.includes('hulu') ||
        desc.includes('disney') || desc.includes('entertainment') || desc.includes('concert') ||
        desc.includes('theater') || desc.includes('cinema') || desc.includes('streaming') ||
        desc.includes('subscription') || desc.includes('youtube premium') || desc.includes('apple music')) return 'Entertainment';
    
    // Healthcare keywords
    if (desc.includes('doctor') || desc.includes('pharmacy') || desc.includes('medical') || 
        desc.includes('hospital') || desc.includes('cvs') || desc.includes('walgreens') ||
        desc.includes('health') || desc.includes('dental') || desc.includes('vision') ||
        desc.includes('clinic') || desc.includes('urgent care') || desc.includes('prescription') ||
        desc.includes('copay') || desc.includes('insurance health')) return 'Healthcare';
    
    // Savings keywords
    if (desc.includes('save') || desc.includes('invest') || desc.includes('emergency') ||
        desc.includes('transfer to savings') || desc.includes('401k') || desc.includes('ira') ||
        desc.includes('retirement') || desc.includes('mutual fund')) return 'Savings';
    
    return 'Other';
  };

  // Simulate Plaid connection
  const connectPlaidAccount = async () => {
    setIsConnecting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAccounts(mockAccounts);
    setLastSync(new Date());
    setIsConnecting(false);
    
    // Auto-sync transactions
    syncTransactions();
  };

  // Simulate transaction sync
  const syncTransactions = async () => {
    const importedTransactions = mockTransactions.map(t => ({
      id: t.id,
      description: t.description,
      amount: Math.abs(t.amount),
      category: autoCategorize(t.description),
      type: t.amount > 0 ? 'income' : 'expense',
      date: new Date(t.date).toLocaleDateString(),
      accountId: t.account_id,
      isImported: true,
      isEdited: false
    }));
    
    const existingIds = new Set(transactions.map(t => t.id));
    const newTransactions = importedTransactions.filter(t => !existingIds.has(t.id));
    
    setTransactions([...newTransactions, ...transactions]);
    setLastSync(new Date());
  };

  // Calculate totals including imported data
  const totalAllocated = Object.values(categories).reduce((sum, cat) => sum + cat.allocated, 0);
  const unallocatedIncome = income - totalAllocated;
  const totalSpent = transactions.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);
  const totalIncome = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0);
  
  // Calculate spending by category
  const spendingByCategory = {};
  Object.keys(categories).forEach(cat => {
    spendingByCategory[cat] = transactions
      .filter(t => t.category === cat && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const addTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) return;
    
    const suggestedCategory = autoCategorize(newTransaction.description);
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category === 'Other' ? suggestedCategory : newTransaction.category,
      date: new Date().toLocaleDateString(),
      isImported: false,
      isEdited: newTransaction.category !== 'Other' && newTransaction.category !== suggestedCategory
    };
    
    setTransactions([transaction, ...transactions]);
    setNewTransaction({ description: '', amount: '', category: 'Other', type: 'expense' });
  };

  const updateCategoryAllocation = (category, amount) => {
    setCategories(prev => ({
      ...prev,
      [category]: { ...prev[category], allocated: parseFloat(amount) || 0 }
    }));
  };

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      target: parseFloat(newGoal.target),
      current: 0
    };
    
    setGoals([...goals, goal]);
    setNewGoal({ name: '', target: '', current: 0 });
  };

  const updateGoalProgress = (goalId, amount) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: Math.max(0, goal.current + parseFloat(amount)) }
        : goal
    ));
  };

  const editTransactionCategory = (transactionId, newCategory) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === transactionId 
        ? { ...transaction, category: newCategory, isEdited: true }
        : transaction
    ));
    setEditingTransaction(null);
  };

  const startEditingTransaction = (transactionId) => {
    setEditingTransaction(transactionId);
  };

  const cancelEditingTransaction = () => {
    setEditingTransaction(null);
  };

  // Auto emoji generation based on category name
  const generateEmojiForCategory = (categoryName) => {
    const name = categoryName.toLowerCase().trim();
    
    // Comprehensive emoji mapping
    const emojiMap = {
      // Finance & Money
      'investment': '📈', 'invest': '📈', 'stocks': '📈', 'trading': '📊',
      'retirement': '🏖️', '401k': '🏖️', 'ira': '🏖️', 'pension': '🏖️',
      'emergency': '🆘', 'fund': '💰', 'savings': '💎', 'save': '💰',
      'debt': '💳', 'loan': '🏦', 'credit': '💳', 'mortgage': '🏠',
      
      // Food & Dining
      'food': '🍽️', 'restaurant': '🍴', 'dining': '🍽️', 'grocery': '🛒',
      'coffee': '☕', 'lunch': '🥪', 'dinner': '🍽️', 'breakfast': '🥐',
      'snack': '🍿', 'drinks': '🥤', 'alcohol': '🍷', 'bar': '🍻',
      'fast food': '🍔', 'pizza': '🍕', 'sushi': '🍣', 'dessert': '🍰',
      
      // Transportation
      'car': '🚗', 'gas': '⛽', 'fuel': '⛽', 'auto': '🚗', 'vehicle': '🚗',
      'uber': '🚕', 'taxi': '🚕', 'rideshare': '🚕', 'lyft': '🚕',
      'bus': '🚌', 'train': '🚊', 'subway': '🚇', 'metro': '🚇',
      'parking': '🅿️', 'toll': '🛣️', 'bike': '🚲', 'scooter': '🛴',
      'flight': '✈️', 'airplane': '✈️', 'travel': '✈️', 'vacation': '🏖️',
      
      // Housing & Home
      'rent': '🏠', 'mortgage': '🏠', 'housing': '🏠', 'home': '🏠',
      'apartment': '🏢', 'condo': '🏢', 'house': '🏡', 'property': '🏘️',
      'furniture': '🪑', 'decor': '🖼️', 'appliance': '🔌', 'repair': '🔧',
      'garden': '🌱', 'lawn': '🌱', 'yard': '🌳', 'landscaping': '🌿',
      
      // Utilities & Services
      'electric': '⚡', 'electricity': '⚡', 'power': '⚡', 'energy': '⚡',
      'water': '💧', 'gas': '🔥', 'internet': '🌐', 'wifi': '📶',
      'phone': '📱', 'cell': '📱', 'mobile': '📱', 'cable': '📺',
      'trash': '🗑️', 'garbage': '🗑️', 'recycling': '♻️', 'sewer': '🚰',
      
      // Entertainment & Fun
      'movie': '🎬', 'cinema': '🎬', 'theater': '🎭', 'show': '🎪',
      'game': '🎮', 'gaming': '🎮', 'xbox': '🎮', 'playstation': '🎮',
      'music': '🎵', 'spotify': '🎵', 'concert': '🎤', 'festival': '🎪',
      'book': '📚', 'reading': '📖', 'magazine': '📰', 'newspaper': '📰',
      'hobby': '🎨', 'craft': '✂️', 'art': '🎨', 'paint': '🎨',
      'sport': '⚽', 'gym': '💪', 'fitness': '💪', 'yoga': '🧘',
      'netflix': '📺', 'streaming': '📺', 'subscription': '📱', 'app': '📱',
      
      // Health & Medical
      'health': '🏥', 'medical': '🏥', 'doctor': '👨‍⚕️', 'hospital': '🏥',
      'dentist': '🦷', 'dental': '🦷', 'pharmacy': '💊', 'medicine': '💊',
      'insurance': '🛡️', 'therapy': '💆', 'massage': '💆', 'spa': '🧖',
      'vitamin': '💊', 'supplement': '💊', 'prescription': '💊', 'checkup': '🩺',
      
      // Shopping & Retail
      'shopping': '🛍️', 'clothes': '👕', 'clothing': '👕', 'fashion': '👗',
      'shoes': '👟', 'accessories': '💍', 'jewelry': '💎', 'watch': '⌚',
      'electronics': '📱', 'computer': '💻', 'laptop': '💻', 'phone': '📱',
      'gift': '🎁', 'present': '🎁', 'toy': '🧸', 'kids': '👶',
      
      // Education & Learning
      'education': '🎓', 'school': '🏫', 'college': '🎓', 'university': '🎓',
      'course': '📚', 'class': '📚', 'tuition': '🎓', 'book': '📖',
      'training': '📚', 'seminar': '📚', 'workshop': '🔨', 'certification': '📜',
      
      // Work & Business
      'business': '💼', 'work': '💼', 'office': '🏢', 'supplies': '📎',
      'equipment': '⚙️', 'tools': '🔧', 'software': '💻', 'subscription': '📱',
      'conference': '🗣️', 'meeting': '🗣️', 'networking': '🤝', 'client': '🤝',
      
      // Personal Care & Beauty
      'haircut': '💇', 'salon': '💇', 'beauty': '💄', 'cosmetics': '💄',
      'skincare': '🧴', 'grooming': '🪒', 'barber': '💇‍♂️', 'nails': '💅',
      
      // Pets & Animals
      'pet': '🐕', 'dog': '🐕', 'cat': '🐱', 'vet': '🐕', 'veterinary': '🐕',
      'pet food': '🥣', 'grooming': '🐕', 'toy': '🧸', 'animal': '🐾',
      
      // Miscellaneous
      'charity': '❤️', 'donation': '❤️', 'gift': '🎁', 'tip': '💰',
      'fee': '💰', 'tax': '💰', 'fine': '💰', 'penalty': '⚠️',
      'subscription': '📱', 'membership': '🎫', 'dues': '💰', 'license': '📜'
    };
    
    // Check for direct matches first
    if (emojiMap[name]) {
      return emojiMap[name];
    }
    
    // Check for partial matches
    for (const [keyword, emoji] of Object.entries(emojiMap)) {
      if (name.includes(keyword) || keyword.includes(name)) {
        return emoji;
      }
    }
    
    // Fallback emojis based on common patterns
    if (name.includes('pay') || name.includes('bill')) return '💳';
    if (name.includes('fun') || name.includes('enjoy')) return '🎉';
    if (name.includes('baby') || name.includes('child')) return '👶';
    if (name.includes('senior') || name.includes('elder')) return '👵';
    if (name.includes('tech') || name.includes('digital')) return '💻';
    if (name.includes('green') || name.includes('eco')) return '🌱';
    if (name.includes('luxury') || name.includes('premium')) return '💎';
    if (name.includes('quick') || name.includes('fast')) return '⚡';
    if (name.includes('special') || name.includes('event')) return '🎪';
    
    // Default fallback
    return '📦';
  };

  // Generate gradient colors for new categories
  const generateGradientForCategory = (categoryName) => {
    const colors = [
      'from-indigo-500 to-purple-600',
      'from-cyan-500 to-blue-600', 
      'from-green-500 to-teal-600',
      'from-yellow-500 to-orange-600',
      'from-red-500 to-pink-600',
      'from-purple-500 to-indigo-600',
      'from-blue-500 to-cyan-600',
      'from-teal-500 to-green-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-purple-600',
      'from-emerald-500 to-cyan-600',
      'from-violet-500 to-purple-600',
      'from-sky-500 to-blue-600',
      'from-lime-500 to-green-600',
      'from-amber-500 to-orange-600'
    ];
    
    // Use category name to consistently pick a color
    const hash = categoryName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Add new custom category
  const addCustomCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const categoryName = newCategoryName.trim();
    const emoji = generateEmojiForCategory(categoryName);
    const gradient = generateGradientForCategory(categoryName);
    
    setCategories(prev => ({
      ...prev,
      [categoryName]: {
        allocated: 0,
        color: gradient,
        icon: emoji,
        gradient: `bg-gradient-to-r ${gradient}`,
        isCustom: true
      }
    }));
    
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* AI Training Status Overlay */}
        {isTrainingAI && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 m-4 max-w-md w-full shadow-2xl border border-white/20">
              <div className="text-center">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Training AI Model</h3>
                <p className="text-gray-600 mb-6">Teaching your budget tracker to be smarter!</p>
                
                {trainingProgress && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Epoch {trainingProgress.epoch}/{trainingProgress.totalEpochs || 50}</span>
                      <span>Accuracy: {(trainingProgress.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(trainingProgress.epoch / (trainingProgress.totalEpochs || 50)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Loss: {trainingProgress.loss?.toFixed(4)} • Learning from {transactions.length} transactions
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  This will take about 30 seconds...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles size={32} className="text-purple-500" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              💰 Smart Budget Tracker
            </h1>
            <p className="text-gray-600 text-lg mb-6">Your money, perfectly organized ✨</p>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Monthly Income</p>
                    <p className="text-3xl font-bold">${income.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <DollarSign className="text-white" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Allocated</p>
                    <p className="text-3xl font-bold">${totalAllocated.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                </div>
              </div>
              
              <div className={`${
                unallocatedIncome === 0 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                  : unallocatedIncome > 0 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500'
              } p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">Unallocated</p>
                    <p className="text-3xl font-bold">${unallocatedIncome.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    {unallocatedIncome === 0 ? <CheckCircle2 className="text-white" size={24} /> : <AlertCircle className="text-white" size={24} />}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Spent</p>
                    <p className="text-3xl font-bold">${totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <TrendingDown className="text-white" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Net Worth</p>
                    <p className="text-3xl font-bold">
                      ${accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Building className="text-white" size={24} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  💸 Set Monthly Income
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                  className="w-full border-2 border-white/50 rounded-lg px-4 py-3 text-lg font-semibold bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Enter your monthly income"
                />
              </div>
              
              <div className="flex items-end">
                {accounts.length === 0 ? (
                  <button
                    onClick={connectPlaidAccount}
                    disabled={isConnecting}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="animate-spin mr-3" size={24} />
                        Connecting... ✨
                      </>
                    ) : (
                      <>
                        <Link className="mr-3" size={24} />
                        🔗 Connect Bank Account
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full">
                    <button
                      onClick={syncTransactions}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <RefreshCw className="mr-3" size={24} />
                      🔄 Sync Transactions
                    </button>
                    {lastSync && (
                      <p className="text-sm text-gray-600 mt-2 text-center">
                        ⏰ Last synced: {lastSync.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        {accounts.length > 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CreditCard className="mr-3 text-blue-500" size={28} />
              🏦 Connected Accounts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div key={account.id} className={`bg-gradient-to-r ${account.color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{account.name}</h3>
                      <p className="text-white/80 text-sm">{account.institution}</p>
                      <p className="text-white/60 text-sm capitalize">{account.subtype}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <CreditCard className="text-white" size={24} />
                    </div>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-white' : 'text-red-200'}`}>
                      ${Math.abs(account.balance).toLocaleString()}
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                      {account.type === 'credit' ? '💳 Available Credit' : '💰 Balance'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden">
          <div className="flex">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'budget', name: 'Budget', icon: '💰' },
              { id: 'transactions', name: 'Transactions', icon: '🧾' },
              { id: 'goals', name: 'Goals', icon: '🎯' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-semibold text-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/50 hover:text-gray-900'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                📈 Budget vs Spending
              </h2>
              <div className="space-y-6">
                {Object.entries(categories).map(([category, data]) => {
                  const spent = spendingByCategory[category] || 0;
                  const remaining = data.allocated - spent;
                  const percentage = data.allocated > 0 ? (spent / data.allocated) * 100 : 0;
                  const transactionCount = transactions.filter(t => t.category === category && t.type === 'expense').length;
                  
                  return (
                    <div key={category} className="bg-white/50 rounded-xl p-4 backdrop-blur-sm border border-white/30 hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{data.icon}</span>
                          <div>
                            <span className="text-lg font-semibold text-gray-800">{category}</span>
                            <p className="text-sm text-gray-500">({transactionCount} transactions)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-800">
                            ${spent.toLocaleString()} / ${data.allocated.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full ${percentage > 100 ? 'bg-gradient-to-r from-red-500 to-pink-500' : `bg-gradient-to-r ${data.color}`} transition-all duration-700 ease-out`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        {percentage > 100 && (
                          <div className="absolute -top-1 right-0">
                            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                              Over!
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-600">
                          Remaining: <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${remaining.toFixed(2)}
                          </span>
                        </span>
                        {percentage > 100 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                            Over by ${(spent - data.allocated).toFixed(2)} 🚨
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* AI Performance Dashboard */}
              <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border-2 border-blue-200 shadow-xl">
                <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                  <Brain className="mr-3 text-blue-600" size={28} />
                  🤖 Real AI Performance Dashboard
                </h3>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/90 rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {aiStats.totalPredictions}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">Total Predictions</div>
                    <div className="text-xs text-gray-500 mt-1">All transactions processed</div>
                  </div>
                  
                  <div className="bg-white/90 rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {aiStats.aiPredictions}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">🧠 AI Predictions</div>
                    <div className="text-xs text-gray-500 mt-1">Neural network powered</div>
                  </div>
                  
                  <div className="bg-white/90 rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {aiStats.rulePredictions}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">📋 Rule-based</div>
                    <div className="text-xs text-gray-500 mt-1">Traditional matching</div>
                  </div>
                  
                  <div className="bg-white/90 rounded-xl p-4 text-center shadow-md">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {aiStats.totalPredictions > 0 ? 
                        Math.round((aiStats.aiPredictions / aiStats.totalPredictions) * 100) : 0}%
                    </div>
                    <div className="text-sm font-semibold text-gray-700">AI Usage Rate</div>
                    <div className="text-xs text-gray-500 mt-1">Higher is better!</div>
                  </div>
                </div>

                {/* Model Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/80 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <Zap className="mr-2 text-yellow-500" size={20} />
                      Model Performance
                    </h4>
                    {aiReady && aiModel ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Model Accuracy:</span>
                          <span className="font-bold text-green-600">
                            {(aiStats.modelAccuracy * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-700"
                            style={{ width: `${aiStats.modelAccuracy * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Avg. Confidence:</span>
                          <span className="font-bold text-blue-600">
                            {(aiStats.averageConfidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-4xl mb-2">🚀</div>
                        <p className="text-gray-600">AI model not trained yet</p>
                        <p className="text-sm text-gray-500">
                          {transactions.length < 10 ? 
                            `Need ${10 - transactions.length} more transactions` :
                            'Click "Train AI Model" to enable AI!'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/80 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <Cpu className="mr-2 text-purple-500" size={20} />
                      Training Information
                    </h4>
                    {aiStats.trainingDate ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Trained:</span>
                          <span className="font-semibold">
                            {aiStats.trainingDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Training Data:</span>
                          <span className="font-semibold">
                            {transactions.filter(t => t.category !== 'Other').length} transactions
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Model Type:</span>
                          <span className="font-semibold text-blue-600">Neural Network</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Architecture:</span>
                          <span className="font-semibold text-purple-600">256→128→64→8</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-4xl mb-2">⏳</div>
                        <p className="text-gray-600">Ready to train!</p>
                        <p className="text-sm text-gray-500">AI will learn your spending patterns</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* User corrections tracking */}
                {transactions.filter(t => t.isEdited && t.aiPredicted).length > 0 && (
                  <div className="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-2 flex items-center">
                      📝 Learning from Your Corrections
                    </h4>
                    <p className="text-sm text-yellow-700">
                      You've corrected {transactions.filter(t => t.isEdited && t.aiPredicted).length} AI predictions. 
                      This data will improve the model when you retrain! 
                      <span className="font-semibold">🧠 Your AI is getting smarter!</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                ⚡ Recent Activity
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transactions.slice(0, 8).map((transaction) => (
                  <div key={transaction.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <p className="font-semibold text-gray-800">{transaction.description}</p>
                          {transaction.isImported && (
                            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-semibold">
                              🤖 Auto-imported
                            </span>
                          )}
                          {transaction.isEdited && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-semibold">
                              ✏️ Edited
                            </span>
                          )}
                        </div>
                        
                        {editingTransaction === transaction.id ? (
                          <div className="flex items-center gap-3 mt-2">
                            <select
                              value={transaction.category}
                              onChange={(e) => editTransactionCategory(transaction.id, e.target.value)}
                              className="border-2 border-blue-300 rounded-lg px-3 py-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              autoFocus
                            >
                              {Object.entries(categories).map(([cat, data]) => (
                                <option key={cat} value={cat}>{data.icon} {cat}</option>
                              ))}
                            </select>
                            <button
                              onClick={cancelEditingTransaction}
                              className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center"
                            >
                              <X size={14} className="mr-1" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{categories[transaction.category]?.icon}</span>
                              <span className="text-sm text-gray-600">{transaction.category}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-500">{transaction.date}</span>
                            </div>
                            <button
                              onClick={() => startEditingTransaction(transaction.id)}
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center text-xs font-semibold"
                            >
                              <Edit3 size={12} className="mr-1" />
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <span className={`text-xl font-bold ${
                          transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                💰 Allocate Your Income
              </h2>
              <p className="text-lg text-gray-600">Give every dollar a job! Make your money work for you ✨</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Object.entries(categories).map(([category, data]) => (
                <div key={category} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{data.icon}</div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
                      {category}
                      {data.isCustom && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-semibold">
                          Custom
                        </span>
                      )}
                    </h3>
                  </div>
                  <input
                    type="number"
                    value={data.allocated}
                    onChange={(e) => updateCategoryAllocation(category, e.target.value)}
                    className="w-full border-2 border-white/50 rounded-lg px-4 py-3 text-lg font-semibold text-center bg-white/80 backdrop-blur-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    placeholder="$0"
                  />
                  <div className="mt-3 text-center">
                    <span className="text-sm text-gray-600">
                      Spent: <span className="font-semibold text-red-500">${spendingByCategory[category] || 0}</span>
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${data.color} transition-all duration-500`}
                        style={{ 
                          width: `${data.allocated > 0 ? Math.min((spendingByCategory[category] || 0) / data.allocated * 100, 100) : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add New Category Card */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 backdrop-blur-sm rounded-xl p-6 border-2 border-dashed border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
                {showAddCategory ? (
                  <div className="w-full text-center">
                    <div className="text-4xl mb-4">✨</div>
                    <input
                      type="text"
                      placeholder="Enter category name..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full border-2 border-purple-300 rounded-lg px-4 py-3 text-lg font-semibold text-center bg-white/90 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all mb-4"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addCustomCategory();
                        }
                      }}
                    />
                    <div className="text-sm text-purple-700 mb-4">
                      💡 Emoji will be auto-generated!
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={addCustomCategory}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        Add Category 🚀
                      </button>
                      <button
                        onClick={() => {
                          setShowAddCategory(false);
                          setNewCategoryName('');
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddCategory(true)}
                    className="text-center hover:bg-white/20 rounded-lg p-4 transition-all duration-300 w-full"
                  >
                    <div className="text-6xl mb-2 text-purple-400">+</div>
                    <h3 className="text-lg font-bold text-purple-700">Add Custom Category</h3>
                    <p className="text-sm text-purple-600 mt-1">Create your own budget category!</p>
                  </button>
                )}
              </div>
            </div>
            
            {unallocatedIncome !== 0 && (
              <div className={`mt-8 p-6 rounded-2xl border-2 ${
                unallocatedIncome > 0 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
              } shadow-lg`}>
                <div className="flex items-center justify-center">
                  <div className="text-4xl mr-4">
                    {unallocatedIncome > 0 ? '⚠️' : '🚨'}
                  </div>
                  <div className="text-center">
                    <p className={`text-xl font-bold ${unallocatedIncome > 0 ? 'text-yellow-800' : 'text-red-800'}`}>
                      {unallocatedIncome > 0 
                        ? `You have $${unallocatedIncome.toLocaleString()} unallocated money!`
                        : `You've over-allocated by $${Math.abs(unallocatedIncome).toLocaleString()}!`
                      }
                    </p>
                    <p className="text-gray-600 mt-2">
                      {unallocatedIncome > 0 
                        ? 'Every dollar needs a purpose - give it a job!' 
                        : 'Time to reduce some allocations to balance your budget!'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                ➕ Add Manual Transaction
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="What did you buy? 🛍️"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="border-2 border-white/50 rounded-lg px-4 py-3 bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <input
                  type="number"
                  placeholder="Amount 💵"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="border-2 border-white/50 rounded-lg px-4 py-3 bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="border-2 border-white/50 rounded-lg px-4 py-3 bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  {Object.entries(categories).map(([cat, data]) => (
                    <option key={cat} value={cat}>{data.icon} {cat}</option>
                  ))}
                </select>
                <button
                  onClick={addTransaction}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <PlusCircle size={20} className="mr-2" />
                  Add ✨
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Smart tip:</strong> Manual transactions are auto-categorized too! 
                  You can override the suggestion before saving.
                </p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  📋 All Transactions
                </h2>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-semibold text-purple-700">
                    {transactions.filter(t => t.isImported).length} auto • {transactions.filter(t => !t.isImported).length} manual
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🤖</div>
                  <div>
                    <p className="font-bold text-green-800">Auto-categorization is working hard for you!</p>
                    <p className="text-sm text-green-700">
                      All imported transactions are instantly sorted. Click "Edit" to make corrections and help the AI learn! ✨
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-3">
                          <p className="font-semibold text-gray-800 text-lg">{transaction.description}</p>
                          {transaction.isImported && (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full font-semibold shadow-md">
                              🤖 Auto-imported
                            </span>
                          )}
                          {transaction.isEdited && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs rounded-full font-semibold shadow-md">
                              ✏️ User Edited
                            </span>
                          )}
                          {!transaction.isImported && !transaction.isEdited && (
                            <span className="px-3 py-1 bg-gradient-to-r from-gray-500 to-slate-500 text-white text-xs rounded-full font-semibold shadow-md">
                              ➕ Manual Entry
                            </span>
                          )}
                        </div>
                        
                        {editingTransaction === transaction.id ? (
                          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-blue-700">Edit Category:</span>
                              <select
                                value={transaction.category}
                                onChange={(e) => editTransactionCategory(transaction.id, e.target.value)}
                                className="flex-1 border-2 border-blue-300 rounded-lg px-3 py-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-semibold"
                                autoFocus
                              >
                                {Object.entries(categories).map(([cat, data]) => (
                                  <option key={cat} value={cat}>{data.icon} {cat}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex gap-3 mt-3">
                              <button
                                onClick={() => editTransactionCategory(transaction.id, document.activeElement.value)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center font-semibold"
                              >
                                <Save size={16} className="mr-2" />
                                Save Changes
                              </button>
                              <button
                                onClick={cancelEditingTransaction}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center font-semibold"
                              >
                                <X size={16} className="mr-2" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{categories[transaction.category]?.icon}</span>
                              <div>
                                <span className="font-semibold text-gray-700 text-lg">{transaction.category}</span>
                                <div className="text-sm text-gray-500">{transaction.date}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => startEditingTransaction(transaction.id)}
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center font-semibold shadow-md"
                            >
                              <Edit3 size={16} className="mr-2" />
                              Edit Category
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-6">
                        <span className={`text-2xl font-bold ${
                          transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-xl text-gray-500 mb-2">No transactions yet!</p>
                    <p className="text-gray-400">Connect your bank account or add manual transactions to get started ✨</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                🎯 Financial Goals
              </h2>
              <p className="text-lg text-gray-600">Dream big, save smart, achieve everything! ✨</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <input
                type="text"
                placeholder="What's your goal? 🌟"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                className="border-2 border-white/50 rounded-lg px-4 py-3 bg-white/80 backdrop-blur-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              <input
                type="number"
                placeholder="Target amount 💰"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                className="border-2 border-white/50 rounded-lg px-4 py-3 bg-white/80 backdrop-blur-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              <button
                onClick={addGoal}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Target size={20} className="mr-2" />
                Add Goal 🚀
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => {
                const percentage = (goal.current / goal.target) * 100;
                
                return (
                  <div key={goal.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{goal.name}</h3>
                        <p className="text-lg text-gray-600">
                          ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${percentage >= 100 ? 'text-green-500' : 'text-blue-500'}`}>
                          {percentage.toFixed(0)}%
                        </div>
                        {percentage >= 100 && <div className="text-2xl">🎉</div>}
                      </div>
                    </div>
                    
                    <div className="relative mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full ${percentage >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} transition-all duration-700 ease-out`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      {percentage >= 100 && (
                        <div className="absolute -top-2 right-0">
                          <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-bounce">
                            Complete! 🎉
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Add amount..."
                        className="flex-1 border-2 border-white/50 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            updateGoalProgress(goal.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.parentElement.querySelector('input');
                          updateGoalProgress(goal.id, input.value);
                          input.value = '';
                        }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
                      >
                        Add 💰
                      </button>
                    </div>
                    
                    <div className="mt-4 text-center">
                      {percentage >= 100 ? (
                        <span className="text-green-600 font-bold text-lg">🎉 Goal achieved! Amazing work! 🎉</span>
                      ) : (
                        <span className="text-gray-600">
                          <span className="font-semibold text-blue-600">${(goal.target - goal.current).toLocaleString()}</span> to go! 
                          You're {(100 - percentage).toFixed(1)}% away! 💪
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {goals.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-xl text-gray-500 mb-2">No goals set yet!</p>
                  <p className="text-gray-400">Set your first financial goal and start your journey to success! ✨</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Demo Notice */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-2xl p-6 mt-8 shadow-lg">
          <div className="flex items-start">
            <div className="text-3xl mr-4">🧠</div>
            <div>
              <p className="font-bold text-green-800 text-lg mb-3">✨ TensorFlow.js AI Integration Demo ✨</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="mr-2">🔗</span> Click "Connect Bank Account" to import transactions</li>
                  <li className="flex items-center"><span className="mr-2">🧠</span> AI auto-trains when you have 10+ transactions</li>
                  <li className="flex items-center"><span className="mr-2">⚡</span> Neural network learns your spending patterns</li>
                  <li className="flex items-center"><span className="mr-2">✏️</span> Edit categories to teach the AI</li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="mr-2">📊</span> Real-time AI performance dashboard</li>
                  <li className="flex items-center"><span className="mr-2">🎯</span> Confidence scoring for predictions</li>
                  <li className="flex items-center"><span className="mr-2">🔄</span> Continuous learning from corrections</li>
                  <li className="flex items-center"><span className="mr-2">🚀</span> Works completely offline!</li>
                </ul>
              </div>
              <div className="mt-4 bg-white/60 rounded-lg p-3">
                <p className="text-sm font-semibold text-green-800">
                  🤖 <strong>Real AI Features:</strong> Multi-layer neural network • Natural language processing • 
                  Transfer learning • Confidence scoring • Model persistence • Privacy-first (no external APIs!)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetingApp;