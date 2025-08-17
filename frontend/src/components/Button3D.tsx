'use client';

import { motion } from 'framer-motion';
import { useState, ReactNode } from 'react';

interface Button3DProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export default function Button3D({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false
}: Button3DProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: {
      gradient: 'from-purple-600 via-purple-500 to-pink-500',
      shadow: 'rgba(168,85,247,0.4)',
      glow: 'rgba(168,85,247,0.6)',
    },
    secondary: {
      gradient: 'from-cyan-600 via-blue-500 to-purple-500',
      shadow: 'rgba(59,130,246,0.4)',
      glow: 'rgba(59,130,246,0.6)',
    },
    accent: {
      gradient: 'from-pink-600 via-rose-500 to-orange-500',
      shadow: 'rgba(236,72,153,0.4)',
      glow: 'rgba(236,72,153,0.6)',
    },
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const currentVariant = variants[variant];

  return (
    <div className="perspective-1000">
      <motion.button
        className={`
          relative transform-gpu preserve-3d cursor-pointer
          ${sizes[size]} font-semibold text-white rounded-lg
          focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: isPressed ? 5 : 0,
          rotateY: isHovered ? 2 : 0,
          scale: isPressed ? 0.98 : isHovered ? 1.02 : 1,
          z: isHovered ? 10 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => !disabled && setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={disabled ? undefined : onClick}
        whileHover={{ z: 20 }}
        whileTap={{ scale: 0.95 }}
        disabled={disabled}
      >
        {/* Main Button Face */}
        <div
          className={`
            relative z-10 bg-gradient-to-r ${currentVariant.gradient}
            rounded-lg overflow-hidden
          `}
          style={{
            transform: 'translateZ(0px)',
          }}
        >
          <div className="relative z-20 flex items-center justify-center h-full">
            {children}
          </div>

          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              transform: 'translateZ(1px) skewX(-20deg)',
              left: '-100%',
              width: '50%',
            }}
            animate={{
              left: isHovered ? '150%' : '-100%',
            }}
            transition={{
              duration: 0.6,
              ease: 'easeInOut',
            }}
          />

          {/* Inner Glow */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${currentVariant.glow}, transparent 70%)`,
              transform: 'translateZ(-1px)',
            }}
            animate={{
              opacity: isHovered ? 0.3 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* 3D Shadow Layers */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-gradient-to-r ${currentVariant.gradient} rounded-lg`}
            style={{
              transform: `translateZ(${-2 * (i + 1)}px)`,
              opacity: 0.7 - (i * 0.15),
              filter: `blur(${i * 0.5}px) brightness(${0.8 - i * 0.1})`,
            }}
          />
        ))}

        {/* Deep Shadow */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: currentVariant.shadow,
            transform: 'translateZ(-10px)',
            filter: 'blur(8px)',
          }}
          animate={{
            opacity: isHovered ? 0.6 : 0.3,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Sparkle Effects */}
        {isHovered && !disabled && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${25 + (i % 2) * 50}%`,
                  transform: 'translateZ(15px)',
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        )}

        {/* Border Highlight */}
        <motion.div
          className="absolute inset-0 rounded-lg border border-white/0"
          animate={{
            borderColor: isHovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0)',
          }}
          transition={{ duration: 0.3 }}
          style={{ transform: 'translateZ(2px)' }}
        />

        {/* Outer Glow */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            boxShadow: `0 0 20px ${currentVariant.shadow}`,
            transform: 'translateZ(-15px)',
          }}
          animate={{
            opacity: isHovered ? 0.8 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </div>
  );
}
