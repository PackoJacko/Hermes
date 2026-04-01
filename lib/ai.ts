// AI Assistant Service - Claude Integration
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
});

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class HermesAI {
  // Analizar carga de trabajo y predecir burnout
  static async analyzeBurnout(data: {
    tasks: any[];
    projects: any[];
    recentHours: number;
  }): Promise<{
    score: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    suggestions: string[];
    reasoning: string;
  }> {
    const prompt = `Eres un asistente experto en gestión de autónomos y prevención de burnout.

Analiza esta situación laboral:
- Tareas activas: ${data.tasks.filter(t => t.status !== 'done').length}
- Tareas atrasadas: ${data.tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length}
- Proyectos activos: ${data.projects.filter(p => p.status === 'in-progress').length}
- Horas trabajadas esta semana: ${data.recentHours}

Responde SOLO en formato JSON válido con esta estructura exacta:
{
  "score": [número del 0-100, donde 100 es burnout crítico],
  "level": ["low" | "medium" | "high" | "critical"],
  "suggestions": ["sugerencia 1", "sugerencia 2", "sugerencia 3"],
  "reasoning": "explicación breve del análisis"
}`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const cleanJson = content.text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        return JSON.parse(cleanJson);
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('AI Burnout Analysis Error:', error);
      return {
        score: 30,
        level: 'low',
        suggestions: [
          'Prioriza las tareas más importantes',
          'Delega cuando sea posible',
          'Toma descansos regulares',
        ],
        reasoning: 'Análisis estándar (modo offline)',
      };
    }
  }

  // Generar propuesta comercial
  static async generateProposal(data: {
    clientName: string;
    projectType: string;
    budget: number;
    duration: string;
    notes: string;
  }): Promise<string> {
    const prompt = `Eres un experto en redacción de propuestas comerciales para autónomos.

Crea una propuesta profesional para:
- Cliente: ${data.clientName}
- Tipo de proyecto: ${data.projectType}
- Presupuesto: €${data.budget}
- Duración: ${data.duration}
- Notas adicionales: ${data.notes}

Genera una propuesta clara, profesional y convincente en español que incluya:
1. Introducción personalizada
2. Objetivos del proyecto
3. Entregables específicos
4. Metodología de trabajo
5. Timeline
6. Inversión (presupuesto)
7. Próximos pasos

Mantén un tono profesional pero cercano.`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('AI Proposal Generation Error:', error);
      return 'Error al generar la propuesta. Por favor, intenta nuevamente.';
    }
  }

  // Sugerir optimizaciones de proyecto
  static async suggestProjectOptimizations(project: any): Promise<{
    optimizations: string[];
    risks: string[];
    recommendations: string[];
  }> {
    const prompt = `Analiza este proyecto y sugiere optimizaciones:

Proyecto: ${project.name}
Estado: ${project.status}
Presupuesto: €${project.budget}
Fecha inicio: ${project.startDate}
Fecha fin: ${project.endDate}
Tareas completadas: ${project.tasks.filter((t: any) => t.status === 'done').length}/${project.tasks.length}

Responde SOLO en formato JSON válido:
{
  "optimizations": ["optimización 1", "optimización 2", "optimización 3"],
  "risks": ["riesgo 1", "riesgo 2"],
  "recommendations": ["recomendación 1", "recomendación 2", "recomendación 3"]
}`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const cleanJson = content.text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        return JSON.parse(cleanJson);
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('AI Project Analysis Error:', error);
      return {
        optimizations: [
          'Revisa el timeline del proyecto',
          'Asegura hitos claros',
        ],
        risks: ['Posible retraso en entregas'],
        recommendations: [
          'Mantén comunicación regular con el cliente',
          'Revisa el progreso semanalmente',
        ],
      };
    }
  }

  // Chat asistente general
  static async chat(
    messages: AIMessage[],
    context?: {
      projects?: any[];
      tasks?: any[];
      invoices?: any[];
    }
  ): Promise<string> {
    const systemPrompt = `Eres Hermes, un asistente inteligente para autónomos. Ayudas con:
- Gestión de proyectos y tareas
- Planificación financiera
- Organización del tiempo
- Consejos profesionales

${context ? `
Contexto actual del usuario:
- Proyectos activos: ${context.projects?.filter(p => p.status === 'in-progress').length || 0}
- Tareas pendientes: ${context.tasks?.filter(t => t.status !== 'done').length || 0}
- Facturas pendientes de cobro: ${context.invoices?.filter(i => i.status === 'sent').length || 0}
` : ''}

Sé conciso, práctico y amigable.`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('AI Chat Error:', error);
      return 'Lo siento, estoy teniendo problemas técnicos. Por favor, intenta nuevamente.';
    }
  }
}
