'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { HermesAI } from '@/lib/ai';
import { Brain, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

export default function BurnoutPredictor() {
  const { tasks, projects } = useStore();
  const [analysis, setAnalysis] = useState<{
    score: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    suggestions: string[];
    reasoning: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeBurnout = async () => {
    setIsLoading(true);
    try {
      // Simular horas trabajadas (esto se podría trackear realmente)
      const recentHours = 45;

      const result = await HermesAI.analyzeBurnout({
        tasks,
        projects,
        recentHours,
      });

      setAnalysis(result);
    } catch (error) {
      console.error('Burnout analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-analizar al cargar si hay datos
    if (tasks.length > 0 || projects.length > 0) {
      analyzeBurnout();
    }
  }, []);

  const getLevelConfig = () => {
    if (!analysis) return null;

    const configs = {
      low: {
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle,
        iconColor: 'text-green-600',
        label: 'Todo Bien',
        bgGradient: 'from-green-50 to-green-100',
      },
      medium: {
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: AlertTriangle,
        iconColor: 'text-yellow-600',
        label: 'Atención',
        bgGradient: 'from-yellow-50 to-yellow-100',
      },
      high: {
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        icon: Flame,
        iconColor: 'text-orange-600',
        label: 'Cuidado',
        bgGradient: 'from-orange-50 to-orange-100',
      },
      critical: {
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: AlertTriangle,
        iconColor: 'text-red-600',
        label: '¡Urgente!',
        bgGradient: 'from-red-50 to-red-100',
      },
    };

    return configs[analysis.level];
  };

  const config = getLevelConfig();

  if (!analysis && !isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Predictor de Burnout</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Analiza tu carga de trabajo para prevenir el agotamiento
        </p>
        <button
          onClick={analyzeBurnout}
          className="w-full px-4 py-2 bg-hermes-600 text-white rounded-lg hover:bg-hermes-700 transition-colors font-medium"
        >
          Analizar Ahora
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hermes-600"></div>
        </div>
      </div>
    );
  }

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={`bg-gradient-to-br ${config.bgGradient} p-6 rounded-xl shadow-sm border ${config.color}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Nivel de Riesgo: {config.label}
            </h3>
            <p className="text-sm text-gray-600">Predictor de Burnout</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{analysis.score}</div>
          <div className="text-xs text-gray-600">de 100</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              analysis.level === 'critical'
                ? 'bg-red-500'
                : analysis.level === 'high'
                ? 'bg-orange-500'
                : analysis.level === 'medium'
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${analysis.score}%` }}
          />
        </div>
      </div>

      {/* Reasoning */}
      <p className="text-sm text-gray-700 mb-4 leading-relaxed">
        {analysis.reasoning}
      </p>

      {/* Suggestions */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-gray-900">Recomendaciones:</h4>
        {analysis.suggestions.map((suggestion, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-xs mt-1">💡</span>
            <span>{suggestion}</span>
          </div>
        ))}
      </div>

      {/* Re-analyze Button */}
      <button
        onClick={analyzeBurnout}
        className="mt-4 w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm"
      >
        Volver a Analizar
      </button>
    </div>
  );
}
