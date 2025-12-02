/**
 * AI Message Transformer - Sophisticated Simulation
 * Transforms emotional/aggressive messages into neutral, constructive communication
 */

export class MessageTransformer {
    // Dictionary of aggressive/emotional patterns and their neutral alternatives
    static aggressivePatterns = [
        // Accusations and attacks
        { pattern: /voc[eê]\s+(nunca|sempre|jamais|só)/gi, severity: 'high', type: 'accusation' },
        { pattern: /voc[eê]\s+é\s+(um|uma)\s+\w+/gi, severity: 'high', type: 'insult' },
        { pattern: /(idiota|burro|estúpido|imbecil|otário)/gi, severity: 'critical', type: 'insult' },

        // Manipulation and guilt-tripping
        { pattern: /(se voc[eê]|caso voc[eê]).*ent[aã]o/gi, severity: 'medium', type: 'manipulation' },
        { pattern: /por sua culpa/gi, severity: 'high', type: 'blame' },
        { pattern: /você está arruinando/gi, severity: 'high', type: 'blame' },

        // Sarcasm and passive-aggression
        { pattern: /(claro|óbvio|como sempre).*n[eé]\?/gi, severity: 'medium', type: 'sarcasm' },
        { pattern: /que surpresa/gi, severity: 'low', type: 'sarcasm' },
        { pattern: /parab[ée]ns/gi, severity: 'medium', type: 'sarcasm' },

        // Threats and ultimatums
        { pattern: /(se n[aã]o|caso n[aã]o).*vou/gi, severity: 'critical', type: 'threat' },
        { pattern: /última vez/gi, severity: 'high', type: 'ultimatum' },

        // Generalizations
        { pattern: /sempre/gi, severity: 'low', type: 'generalization' },
        { pattern: /nunca/gi, severity: 'low', type: 'generalization' },
        { pattern: /toda vez/gi, severity: 'low', type: 'generalization' },

        // Dismissive language
        { pattern: /tanto faz/gi, severity: 'medium', type: 'dismissive' },
        { pattern: /n[aã]o me importo/gi, severity: 'medium', type: 'dismissive' },
        { pattern: /problema seu/gi, severity: 'high', type: 'dismissive' },
    ];

    // Phrases that focus on the child (positive reinforcement)
    static childFocusedPhrases = [
        "O mais importante é o bem-estar da criança.",
        "Vamos pensar no que é melhor para nosso filho/filha.",
        "Nosso foco deve ser facilitar a rotina das crianças.",
        "Podemos encontrar uma solução que beneficie a criança?",
    ];

    // Constructive alternative suggestions
    static constructiveSuggestions = [
        "Que tal tentarmos outro horário?",
        "Você prefere X ou Y?",
        "Podemos conversar sobre alternativas?",
        "Há alguma flexibilidade nisso?",
        "Vamos encontrar um meio-termo?",
    ];

    /**
     * Main transformation method
     */
    static async transform(originalMessage) {
        const analysis = this.analyzeMessage(originalMessage);
        const transformed = this.neutralizeMessage(originalMessage, analysis);
        const suggestions = this.generateSuggestions(originalMessage, analysis);

        return {
            original: originalMessage,
            transformed: transformed,
            analysis: analysis,
            suggestions: suggestions,
            warnings: this.generateWarnings(analysis),
        };
    }

    /**
     * Analyze message for emotional content and problematic patterns
     */
    static analyzeMessage(message) {
        const emotions = {
            anger: 0,
            frustration: 0,
            sarcasm: 0,
            manipulation: 0,
            dismissiveness: 0,
        };

        let severityLevel = 'low';
        const detectedPatterns = [];

        // Check each pattern
        this.aggressivePatterns.forEach(({ pattern, severity, type }) => {
            if (pattern.test(message)) {
                detectedPatterns.push({ type, severity });

                // Update emotion scores
                if (type === 'insult' || type === 'threat') emotions.anger += 3;
                if (type === 'accusation' || type === 'blame') emotions.frustration += 2;
                if (type === 'sarcasm') emotions.sarcasm += 2;
                if (type === 'manipulation') emotions.manipulation += 3;
                if (type === 'dismissive') emotions.dismissiveness += 2;

                // Update severity
                if (severity === 'critical') severityLevel = 'critical';
                else if (severity === 'high' && severityLevel !== 'critical') severityLevel = 'high';
                else if (severity === 'medium' && severityLevel === 'low') severityLevel = 'medium';
            }
        });

        // Check for all caps (SHOUTING)
        const capsPercentage = (message.match(/[A-Z]/g) || []).length / message.length;
        if (capsPercentage > 0.5) {
            emotions.anger += 2;
            detectedPatterns.push({ type: 'shouting', severity: 'medium' });
        }

        // Check for excessive punctuation (!!!, ???)
        if (/[!?]{2,}/.test(message)) {
            emotions.frustration += 1;
            detectedPatterns.push({ type: 'emphasis', severity: 'low' });
        }

        return {
            emotions,
            severityLevel,
            detectedPatterns,
            overallTone: this.calculateOverallTone(emotions),
            needsTransformation: detectedPatterns.length > 0 || severityLevel !== 'low',
        };
    }

    /**
     * Calculate overall emotional tone
     */
    static calculateOverallTone(emotions) {
        const total = Object.values(emotions).reduce((a, b) => a + b, 0);
        if (total === 0) return 'calm';
        if (total <= 2) return 'slightly_tense';
        if (total <= 5) return 'tense';
        if (total <= 8) return 'hostile';
        return 'very_hostile';
    }

    /**
     * Neutralize the message by removing aggressive patterns
     */
    static neutralizeMessage(message, analysis) {
        let neutralized = message;

        // If message is calm, return with minor improvements
        if (!analysis.needsTransformation) {
            return this.addPoliteness(message);
        }

        // Remove insults and replace with neutral statements
        neutralized = neutralized.replace(
            /(idiota|burro|estúpido|imbecil|otário|incompetente)/gi,
            ''
        );

        // Convert accusations to observations
        neutralized = neutralized.replace(
            /voc[eê]\s+(nunca|sempre)\s+(\w+)/gi,
            (match, freq, action) => {
                if (freq.toLowerCase() === 'nunca') return `às vezes não ${action}`;
                if (freq.toLowerCase() === 'sempre') return `frequentemente ${action}`;
                return action;
            }
        );

        // Remove blame and convert to concerns
        neutralized = neutralized.replace(
            /por sua culpa/gi,
            'gostaria de encontrar uma solução para'
        );

        // Remove threats and convert to requests
        neutralized = neutralized.replace(
            /(se n[aã]o|caso n[aã]o).*vou\s+(\w+)/gi,
            'preciso que consideremos'
        );

        // Remove sarcasm markers
        neutralized = neutralized.replace(
            /(claro|óbvio|como sempre).*n[eé]\?/gi,
            ''
        );

        // Convert ultimatums to requests
        neutralized = neutralized.replace(
            /(última vez|aviso|atenção)/gi,
            'gostaria de destacar'
        );

        // Remove excessive caps
        if ((message.match(/[A-Z]/g) || []).length / message.length > 0.5) {
            neutralized = neutralized.toLowerCase();
            neutralized = neutralized.charAt(0).toUpperCase() + neutralized.slice(1);
        }

        // Remove excessive punctuation
        neutralized = neutralized.replace(/[!?]{2,}/g, '.');

        // Clean up and add politeness
        neutralized = this.cleanupMessage(neutralized);
        neutralized = this.addPoliteness(neutralized);

        // Add child-focused reminder if appropriate
        if (analysis.severityLevel === 'high' || analysis.severityLevel === 'critical') {
            const childReminder = this.childFocusedPhrases[
                Math.floor(Math.random() * this.childFocusedPhrases.length)
            ];
            neutralized = `${neutralized}\n\n${childReminder}`;
        }

        return neutralized;
    }

    /**
     * Add polite language to message
     */
    static addPoliteness(message) {
        // Add "por favor" if it's a request
        if (/poderia|pode|consegue|dá para/i.test(message) && !/por favor/i.test(message)) {
            message = message.replace(/\?/, ', por favor?');
        }

        // Start with greeting if message is very short
        const politePrefixes = ['Olá,', 'Oi,', 'Bom dia,'];
        if (message.length < 50 && !/^(olá|oi|bom dia)/i.test(message)) {
            const prefix = politePrefixes[Math.floor(Math.random() * politePrefixes.length)];
            message = `${prefix} ${message}`;
        }

        return message;
    }

    /**
     * Clean up the neutralized message
     */
    static cleanupMessage(message) {
        // Remove extra spaces
        message = message.replace(/\s+/g, ' ').trim();

        // Fix punctuation spacing
        message = message.replace(/\s+([.,!?])/g, '$1');

        // Ensure sentence starts with capital
        message = message.charAt(0).toUpperCase() + message.slice(1);

        // Ensure ends with punctuation
        if (!/[.!?]$/.test(message)) {
            message += '.';
        }

        return message;
    }

    /**
     * Generate practical suggestions based on message content
     */
    static generateSuggestions(message, analysis) {
        const suggestions = [];

        // If asking about scheduling
        if (/quando|horário|dia|hora/i.test(message)) {
            suggestions.push({
                type: 'alternative',
                text: 'Que tal sugerirmos 2-3 opções de horário para facilitar?',
                icon: '📅',
            });
        }

        // If discussing logistics
        if (/buscar|levar|pegar|deixar/i.test(message)) {
            suggestions.push({
                type: 'practical',
                text: 'Podemos criar um calendário compartilhado para organizar isso?',
                icon: '🗓️',
            });
        }

        // If there's conflict
        if (analysis.severityLevel === 'high' || analysis.severityLevel === 'critical') {
            suggestions.push({
                type: 'mediation',
                text: 'Talvez seja útil focar em encontrar uma solução prática.',
                icon: '🤝',
            });
        }

        // Always add child-focused suggestion
        suggestions.push({
            type: 'child_focus',
            text: this.childFocusedPhrases[Math.floor(Math.random() * this.childFocusedPhrases.length)],
            icon: '👶',
        });

        return suggestions;
    }

    /**
     * Generate warnings about potential escalation
     */
    static generateWarnings(analysis) {
        const warnings = [];

        if (analysis.severityLevel === 'critical') {
            warnings.push({
                level: 'critical',
                message: 'Esta mensagem contém linguagem muito agressiva. Recomendamos reformular completamente.',
            });
        } else if (analysis.severityLevel === 'high') {
            warnings.push({
                level: 'high',
                message: 'Esta mensagem pode gerar conflito. Sugerimos revisar antes de enviar.',
            });
        } else if (analysis.severityLevel === 'medium') {
            warnings.push({
                level: 'medium',
                message: 'Algumas partes da mensagem podem ser mal interpretadas.',
            });
        }

        // Check for specific patterns
        if (analysis.detectedPatterns.some(p => p.type === 'threat')) {
            warnings.push({
                level: 'critical',
                message: 'Ameaças não ajudam na comunicação construtiva.',
            });
        }

        if (analysis.emotions.manipulation > 2) {
            warnings.push({
                level: 'high',
                message: 'Evite linguagem manipulativa. Seja direto e honesto.',
            });
        }

        return warnings;
    }

    /**
     * Get emotion emoji based on tone
     */
    static getEmotionEmoji(tone) {
        const emojiMap = {
            'calm': '😊',
            'slightly_tense': '😐',
            'tense': '😟',
            'hostile': '😠',
            'very_hostile': '🤬',
        };
        return emojiMap[tone] || '😊';
    }

    /**
     * Get severity color
     */
    static getSeverityColor(severity) {
        const colorMap = {
            'low': '#10B981',
            'medium': '#F59E0B',
            'high': '#EF4444',
            'critical': '#991B1B',
        };
        return colorMap[severity] || '#10B981';
    }
}
