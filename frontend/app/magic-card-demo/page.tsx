'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Users, FileText } from 'lucide-react';

// 模拟玩法数据
const STARTER_PLAYS = [
  {
    id: '1',
    title: 'LayerZero 空投完全攻略',
    category: '空投',
    rarity: 'common' as const,
    value: 500,
    description: '完整的 LayerZero 空投攻略,包含跨链桥交互策略',
  },
  {
    id: '2',
    title: 'zkSync Era 测试网任务',
    category: '空投',
    rarity: 'common' as const,
    value: 300,
    description: 'zkSync Era 测试网完整任务清单',
  },
  {
    id: '3',
    title: 'Arbitrum 生态挖矿指南',
    category: 'DeFi',
    rarity: 'rare' as const,
    value: 800,
    description: 'Arbitrum 生态完整挖矿策略,包含收益计算',
  },
];

interface Card {
  id: string;
  title: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic';
  value: number;
  description: string;
}

export default function MagicCardDemo() {
  const [credits, setCredits] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cardPool, setCardPool] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState([false, false, false]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCardClick = (index: number) => {
    if (isDrawing || credits < 1 || flippedCards[index]) return;

    setIsDrawing(true);
    setSelectedIndex(index);

    // 模拟抽卡(随机打乱顺序)
    const shuffled = [...STARTER_PLAYS].sort(() => Math.random() - 0.5);
    setCardPool(shuffled);

    // 扣除积分
    setCredits(credits - 1);

    // 延迟翻开选中的卡片
    setTimeout(() => {
      const newFlipped = [false, false, false];
      newFlipped[index] = true;
      setFlippedCards(newFlipped);

      // 再延迟翻开其他卡片
      setTimeout(() => {
        setFlippedCards([true, true, true]);
        setShowResult(true);
        setIsDrawing(false);
      }, 1000);
    }, 500);
  };

  const resetCards = () => {
    setFlippedCards([false, false, false]);
    setSelectedIndex(null);
    setShowResult(false);
    setCredits(1);
    setCardPool([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            玩法交换 - 魔法卡系统
          </h1>
          <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Gift className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-bold">我的积分: {credits}</span>
            <span className="text-2xl">💎</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Magic Cards Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              🎴 翻开你的魔法卡 🎴
            </h2>
            <p className="text-white/70">
              {credits > 0
                ? '点击任意一张卡片开始翻牌(首次翻牌从 3 个新手玩法中随机获得 1 个)'
                : '积分不足,邀请好友注册可获得更多积分!'}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="flex justify-center gap-8 mb-8">
            {[0, 1, 2].map((index) => (
              <MagicCard
                key={index}
                index={index}
                card={cardPool[index]}
                isFlipped={flippedCards[index]}
                isSelected={selectedIndex === index}
                onClick={() => handleCardClick(index)}
                disabled={isDrawing || credits < 1}
              />
            ))}
          </div>

          {/* Result Message */}
          <AnimatePresence>
            {showResult && selectedIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="inline-block px-8 py-4 bg-green-500/20 border-2 border-green-500 rounded-lg backdrop-blur-md">
                  <p className="text-xl font-bold mb-2">
                    🎉 恭喜!你获得了:
                  </p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {cardPool[selectedIndex]?.title}
                  </p>
                </div>

                <button
                  onClick={resetCards}
                  className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                >
                  重新演示
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Referral Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold">邀请好友获得积分</h3>
            </div>
            <p className="text-white/70 mb-4">
              每邀请 1 个好友注册 = 1 积分
            </p>
            <div className="bg-black/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-white/50 mb-2">你的邀请链接:</p>
              <code className="text-yellow-400">
                https://playnew.com/ref/ABC123
              </code>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>已邀请: 3 人</span>
              <span>获得积分: 3 💎</span>
            </div>
          </div>

          {/* Request Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold">想要特定玩法?</h3>
            </div>
            <p className="text-white/70 mb-4">
              告诉我们你想要什么玩法,提交需求可获得 0.5 积分奖励
            </p>
            <textarea
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              rows={3}
              placeholder="例如: 求 Optimism 生态最新 DeFi 挖矿策略..."
            />
            <button className="mt-3 w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors">
              提交需求 (+0.5 积分)
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 max-w-2xl mx-auto bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <h4 className="font-bold mb-2 text-yellow-400">💡 温馨提示:</h4>
          <ul className="text-sm text-white/80 space-y-1">
            <li>• 首次翻牌将从 3 个新手玩法中随机获得 1 个</li>
            <li>• 之后的翻牌将从完整玩法库中随机获得(包含稀有和史诗玩法)</li>
            <li>• 想要更多积分?邀请好友注册即可,每人 1 积分!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Magic Card Component
interface MagicCardProps {
  index: number;
  card?: Card;
  isFlipped: boolean;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

function MagicCard({
  index,
  card,
  isFlipped,
  isSelected,
  onClick,
  disabled,
}: MagicCardProps) {
  const rarityColors = {
    common: 'from-blue-500 to-blue-600',
    rare: 'from-purple-500 to-purple-600',
    epic: 'from-yellow-500 to-yellow-600',
  };

  const rarityBorders = {
    common: 'border-blue-400',
    rare: 'border-purple-400',
    epic: 'border-yellow-400',
  };

  const rarityLabels = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
  };

  return (
    <motion.div
      className="relative"
      style={{ perspective: '1000px' }}
      whileHover={!disabled && !isFlipped ? { y: -10 } : {}}
      onClick={onClick}
    >
      <motion.div
        className="relative w-56 h-80 cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <div
          className="absolute w-full h-full rounded-xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-xl border-4 border-purple-400/50 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated Background Pattern */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
              }}
            />

            {/* Mystery Symbol */}
            <motion.div
              className="text-8xl mb-4"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              ❓
            </motion.div>

            <div className="text-2xl font-bold text-white/90">神秘卡</div>

            {/* Hover Glow */}
            {!disabled && !isFlipped && (
              <motion.div
                className="absolute inset-0 bg-white/0 hover:bg-white/10 rounded-xl transition-all duration-300"
                whileHover={{ boxShadow: '0 0 30px rgba(167, 139, 250, 0.6)' }}
              />
            )}
          </div>
        </div>

        {/* Card Front */}
        <div
          className="absolute w-full h-full rounded-xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {card && (
            <div
              className={`w-full h-full rounded-xl border-4 ${
                rarityBorders[card.rarity]
              } shadow-2xl relative overflow-hidden bg-gradient-to-br ${
                rarityColors[card.rarity]
              }`}
            >
              {/* Rarity Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-sm font-bold border border-white/30">
                {rarityLabels[card.rarity]}
              </div>

              {/* Epic Glow Effect */}
              {card.rarity === 'epic' && (
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      'radial-gradient(circle at 0% 0%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 100% 100%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 0% 100%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 100% 0%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              )}

              {/* Card Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-6 text-white">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4">
                    {card.category === '空投' && '🎁'}
                    {card.category === 'DeFi' && '💰'}
                    {card.category === '套利' && '⚡'}
                  </div>

                  <h3 className="text-xl font-bold mb-2 leading-tight">
                    {card.title}
                  </h3>

                  <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-3">
                    {card.category}
                  </div>

                  <p className="text-sm text-white/80 mb-4">{card.description}</p>

                  <div className="text-lg font-semibold">
                    价值: {card.value} 💎
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-6 left-0 right-0 text-center"
                  >
                    <div className="inline-block px-6 py-2 bg-green-500 rounded-full font-bold text-white shadow-lg">
                      ✓ 已选择
                    </div>
                  </motion.div>
                )}

                {/* Not Selected Overlay */}
                {!isSelected && isFlipped && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xl font-bold text-white/70">
                      未选择
                    </span>
                  </div>
                )}
              </div>

              {/* Particles Effect for Selected Card */}
              {isSelected && isFlipped && <ParticleEffect />}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Particle Effect Component
function ParticleEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          initial={{
            x: '50%',
            y: '50%',
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: i * 0.05,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
