import { useState, useEffect } from 'react';
import aiService from '../utils/AIService';
import { MessageTransformer } from '../utils/MessageTransformer';
import './MessageComposer.css';

function MessageComposer({ onSendMessage, currentUser }) {
    const [message, setMessage] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [transformation, setTransformation] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    // Analyze message as user types (debounced)
    useEffect(() => {
        if (message.trim().length < 3) {
            setAnalysis(null);
            setTransformation(null);
            setShowPreview(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                const result = await aiService.transform(message);
                setAnalysis(result.analysis);
                setTransformation(result);
                setShowPreview(true);
            } catch (error) {
                console.error('AI transformation error:', error);
                // Show error to user
                setTransformation({
                    transformed: message,
                    analysis: { severityLevel: 'low', needsTransformation: false, overallTone: 'calm' },
                    warnings: [{ level: 'medium', message: 'Erro ao processar mensagem. Tente novamente.' }]
                });
                setShowPreview(true);
            }
        }, 300); // Debounce 300ms

        return () => clearTimeout(timeoutId);
    }, [message]);

    const handleSend = () => {
        if (message.trim().length === 0) return;

        const transformedText = transformation?.transformed || message;

        onSendMessage(message, transformedText, analysis, transformation?.suggestions);

        // Clear the input
        setMessage('');
        setAnalysis(null);
        setTransformation(null);
        setShowPreview(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const getSeverityClass = () => {
        if (!analysis) return '';
        switch (analysis.severityLevel) {
            case 'critical': return 'severity-critical';
            case 'high': return 'severity-high';
            case 'medium': return 'severity-medium';
            default: return 'severity-low';
        }
    };

    const getEmotionEmoji = (tone) => {
        const emojiMap = {
            'calm': '😊',
            'slightly_tense': '😐',
            'tense': '😟',
            'hostile': '😠',
            'very_hostile': '🤬',
            'abusive': '🚨'
        };
        return emojiMap[tone] || '😊';
    };

    return (
        <div className="message-composer">
            {/* Live Preview Panel */}
            {showPreview && transformation && (
                <div className={`preview-panel ${getSeverityClass()}`}>
                    <div className="preview-header">
                        <h4>
                            {analysis?.needsTransformation ? (
                                <>
                                    <span className="preview-icon">✨</span>
                                    IA está transformando sua mensagem...
                                    {transformation.source === 'gemini-ai' && <span className="ai-badge-small">🤖 IA Real</span>}
                                </>
                            ) : (
                                <>
                                    <span className="preview-icon">✅</span>
                                    Mensagem está bem escrita!
                                </>
                            )}
                        </h4>
                        <button
                            className="close-preview"
                            onClick={() => setShowPreview(false)}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Safety Warning (for domestic violence context) */}
                    {transformation.safetyWarning && (
                        <div className="safety-warning critical">
                            🛡️ <strong>ATENÇÃO:</strong> {transformation.safetyWarning}
                        </div>
                    )}

                    {/* Warnings */}
                    {transformation.warnings?.length > 0 && (
                        <div className="preview-warnings">
                            {transformation.warnings.map((warning, idx) => (
                                <div key={idx} className={`preview-warning warning-${warning.level}`}>
                                    <span className="warning-icon">⚠️</span>
                                    {warning.message}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Emergency Recommendation */}
                    {transformation.emergencyRecommendation && (
                        <div className="emergency-recommendation">
                            <span className="emergency-icon">🚨</span>
                            <div>
                                <strong>AJUDA DISPONÍVEL:</strong> {transformation.emergencyRecommendation}
                            </div>
                        </div>
                    )}

                    {/* Transformation */}
                    {analysis?.needsTransformation && (
                        <div className="preview-transformation">
                            <div className="preview-label">Mensagem que será enviada:</div>
                            <div className="preview-text">
                                {transformation.transformed}
                            </div>
                        </div>
                    )}

                    {/* Emotion Analysis */}
                    {analysis && (
                        <div className="preview-emotions">
                            <div className="emotion-indicator">
                                <span className="emotion-emoji">
                                    {getEmotionEmoji(analysis.overallTone)}
                                </span>
                                <span className="emotion-label">
                                    Tom: <strong>{getToneLabel(analysis.overallTone)}</strong>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {transformation.suggestions?.length > 0 && (
                        <div className="preview-suggestions">
                            <div className="suggestions-header">💡 Sugestões:</div>
                            {transformation.suggestions.slice(0, 2).map((suggestion, idx) => (
                                <div key={idx} className="preview-suggestion">
                                    <span className="suggestion-icon">{suggestion.icon}</span>
                                    <span className="suggestion-text">{suggestion.text}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Input Area */}
            <div className="composer-input-area">
                <textarea
                    className="message-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem... A IA irá transformá-la em uma comunicação neutra e construtiva."
                    rows={3}
                />

                <div className="composer-footer">
                    <div className="composer-info">
                        <span className="char-count">
                            {message.length} caracteres
                        </span>
                        {analysis && (
                            <span className={`severity-badge ${getSeverityClass()}`}>
                                {getToneLabel(analysis.overallTone)}
                            </span>
                        )}
                    </div>

                    <button
                        className="btn btn-primary send-button"
                        onClick={handleSend}
                        disabled={message.trim().length === 0}
                    >
                        <span>Enviar</span>
                        <span className="send-icon">→</span>
                    </button>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="quick-tips">
                <span className="tip-icon">💭</span>
                <span className="tip-text">
                    {aiService.isAIAvailable()
                        ? '🤖 IA Real ativa - Especializada em detectar padrões de violência doméstica'
                        : 'Escreva livremente! A IA filtra automaticamente linguagem agressiva ou manipulativa.'
                    }
                </span>
            </div>
        </div>
    );
}

// Helper function
function getToneLabel(tone) {
    const labels = {
        'calm': 'Calmo',
        'slightly_tense': 'Leve tensão',
        'tense': 'Tenso',
        'hostile': 'Hostil',
        'very_hostile': 'Muito hostil',
        'abusive': 'Abusivo',
    };
    return labels[tone] || 'Neutro';
}

export default MessageComposer;
