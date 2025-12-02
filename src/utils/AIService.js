import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Service for Domestic Violence Communication Mediation
 * Uses Google Gemini API with specialized prompts for detecting abuse patterns
 */

class AIService {
    constructor() {
        this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        this.genAI = null;
        this.model = null;

        if (this.apiKey) {
            try {
                this.genAI = new GoogleGenerativeAI(this.apiKey);
                this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            } catch (error) {
                console.warn('Failed to initialize Gemini AI:', error);
            }
        }
    }

    /**
     * System prompt specialized for domestic violence context
     */
    getSystemPrompt() {
        return `Você é um assistente de IA especializado em mediação de comunicação em contextos de VIOLÊNCIA DOMÉSTICA e separações conflituosas.

SEU PAPEL CRÍTICO:
1. PROTEGER VÍTIMAS de abuso emocional, manipulação e gaslighting
2. DETECTAR e ALERTAR sobre padrões de comportamento abusivo
3. Transformar comunicação hostil em mensagens seguras e neutras
4. Manter foco na segurança e bem-estar de todos, especialmente crianças

PADRÕES DE ABUSO A DETECTAR:
- Manipulação emocional e gaslighting ("você está louca", "isso nunca aconteceu")
- Ameaças veladas ou diretas
- Culpabilização da vítima
- Controle financeiro ou de decisões
- Isolamento social
- Minimização de violência passada
- Chantagem emocional usando crianças
- Intimidação
- Sarcasmo cruel e humilhação

NÍVEIS DE SEVERIDADE:
- CRÍTICO: Ameaças, violência, gaslighting severo → ALERTA URGENTE
- ALTO: Manipulação, controle, intimidação → AVISO FORTE
- MÉDIO: Linguagem hostil, acusações → SUGESTÃO DE REFORMULAÇÃO
- BAIXO: Tom levemente negativo → ORIENTAÇÃO GENTIL

SUA RESPOSTA DEVE SER JSON ESTRITO:
{
  "severityLevel": "critical|high|medium|low",
  "overallTone": "calm|slightly_tense|tense|hostile|very_hostile|abusive",
  "detectedPatterns": [
    {"type": "gaslighting|threat|manipulation|control|blame|insult|etc", "severity": "critical|high|medium|low", "evidence": "trecho específico"}
  ],
  "isAbusiveContent": boolean,
  "safetyWarning": "texto de aviso SE houver risco de segurança",
  "transformed": "mensagem transformada em comunicação segura e neutra",
  "warnings": [
    {"level": "critical|high|medium", "message": "aviso específico"}
  ],
  "suggestions": [
    {"type": "safety|child_focus|practical|alternative", "text": "sugestão", "icon": "emoji"}
  ],
  "emergencyRecommendation": "SE CRÍTICO, recomendar buscar autoridades/suporte"
}

REGRAS DE TRANSFORMAÇÃO:
1. SEMPRE remover ameaças e linguagem abusiva
2. NÃO permitir manipulação passar
3. Converter acusações em observações neutras
4. Adicionar foco no bem-estar das crianças quando relevante
5. SE conteúdo é perigoso, a mensagem transformada deve ser MUITO genérica e segura
6. Incluir sugestões de alternativas práticas e seguras
7. Para níveis críticos, sugerir mediação profissional ou autoridades

EXEMPLOS:

Mensagem: "Você está louca! Eu nunca fiz isso, você inventa coisas!"
Resposta: {
  "severityLevel": "critical",
  "overallTone": "abusive",
  "detectedPatterns": [
    {"type": "gaslighting", "severity": "critical", "evidence": "você está louca, você inventa coisas"}
  ],
  "isAbusiveContent": true,
  "safetyWarning": "ATENÇÃO: Padrão de gaslighting detectado. Este tipo de comunicação é abusiva.",
  "transformed": "Precisamos conversar com calma sobre essa situação. Talvez seja útil ter um mediador profissional.",
  "warnings": [
    {"level": "critical", "message": "Esta mensagem contém gaslighting - técnica de manipulação psicológica que distorce a percepção da realidade da outra pessoa."}
  ],
  "suggestions": [
    {"type": "safety", "text": "Considere documentar esta comunicação e buscar apoio de profissionais especializados.", "icon": "🛡️"},
    {"type": "practical", "text": "Para assuntos importantes, utilize apenas comunicação escrita e com testemunhas (advogado, terapeuta).", "icon": "📝"}
  ],
  "emergencyRecommendation": "Se você está em situação de violência doméstica, ligue 180 (Central de Atendimento à Mulher) ou busque uma Delegacia da Mulher."
}

Mensagem: "Se você não deixar eu ver as crianças quando EU quiser, você vai se arrepender"
Resposta: {
  "severityLevel": "critical",
  "overallTone": "abusive",
  "detectedPatterns": [
    {"type": "threat", "severity": "critical", "evidence": "você vai se arrepender"},
    {"type": "control", "severity": "high", "evidence": "quando EU quiser"}
  ],
  "isAbusiveContent": true,
  "safetyWarning": "ALERTA DE SEGURANÇA: Ameaça detectada. Este conteúdo pode indicar risco.",
  "transformed": "Gostaria de conversar sobre um cronograma regular de visitação que funcione para todos, priorizando o bem-estar das crianças.",
  "warnings": [
    {"level": "critical", "message": "AMEAÇA DETECTADA. Ameaças não são aceitáveis e podem ser crime. Documente esta comunicação."}
  ],
  "suggestions": [
    {"type": "safety", "text": "Busque imediatamente orientação jurídica e considere medida protetiva se sentir-se em risco.", "icon": "⚖️"},
    {"type": "child_focus", "text": "A visitação deve seguir acordo judicial que proteja todos os envolvidos, especialmente as crianças.", "icon": "👶"}
  ],
  "emergencyRecommendation": "Em caso de ameaça ou risco imediato, entre em contato com a polícia (190) e busque uma medida protetiva."
}

IMPORTANTE: Sua resposta deve ser APENAS o JSON, sem texto adicional antes ou depois.`;
    }

    /**
     * Transform message using real AI or fallback to simulation
     */
    async transform(originalMessage) {
        // Try real AI first
        if (this.model) {
            try {
                const result = await this.transformWithGemini(originalMessage);
                return result;
            } catch (error) {
                console.warn('Gemini API failed, using fallback simulation:', error);
            }
        }

        // Fallback to simulation
        return this.transformWithSimulation(originalMessage);
    }

    /**
     * Transform using Google Gemini API
     */
    async transformWithGemini(originalMessage) {
        const prompt = `${this.getSystemPrompt()}

MENSAGEM A ANALISAR:
"${originalMessage}"

Analise esta mensagem no contexto de comunicação entre pessoas com histórico de violência doméstica ou conflito severo. Retorne APENAS o JSON com a análise completa.`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid JSON response from AI');
        }

        const analysis = JSON.parse(jsonMatch[0]);

        // Format to match our component structure
        return {
            original: originalMessage,
            transformed: analysis.transformed,
            analysis: {
                severityLevel: analysis.severityLevel,
                overallTone: analysis.overallTone,
                detectedPatterns: analysis.detectedPatterns || [],
                isAbusiveContent: analysis.isAbusiveContent,
                needsTransformation: analysis.isAbusiveContent || analysis.detectedPatterns.length > 0,
            },
            warnings: analysis.warnings || [],
            suggestions: analysis.suggestions || [],
            safetyWarning: analysis.safetyWarning,
            emergencyRecommendation: analysis.emergencyRecommendation,
            source: 'gemini-ai'
        };
    }

    /**
     * Fallback simulation (enhanced for domestic violence context)
     */
    async transformWithSimulation(originalMessage) {
        // Import the simulation transformer
        const { MessageTransformer } = await import('./MessageTransformer.js');
        const result = await MessageTransformer.transform(originalMessage);

        // Add extra context for domestic violence
        const enhanced = {
            ...result,
            source: 'simulation',
            safetyWarning: result.analysis.severityLevel === 'critical'
                ? 'AVISO: Em situações de violência doméstica, busque sempre apoio profissional (advogado, terapeuta, autoridades).'
                : null,
            emergencyRecommendation: result.analysis.severityLevel === 'critical'
                ? 'Se você está em risco, ligue 180 (Central de Atendimento à Mulher) ou 190 (Polícia).'
                : null
        };

        return enhanced;
    }

    /**
     * Check if AI is available
     */
    isAIAvailable() {
        return this.model !== null;
    }

    /**
     * Get AI status message
     */
    getStatusMessage() {
        if (this.isAIAvailable()) {
            return 'IA Real Ativa (Google Gemini) - Análise especializada em violência doméstica';
        }
        return 'Modo Simulação - Configure VITE_GEMINI_API_KEY para IA real';
    }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
