import { useState } from 'react';
import { MessageTransformer } from '../utils/MessageTransformer';
import './MessageBubble.css';

function MessageBubble({ message, isCurrentUser, userName, userColor }) {
    const [showDetails, setShowDetails] = useState(false);

    // System messages (welcome, info, etc.)
    if (message.sender === 'system') {
        return (
            <div className="message-bubble system-message">
                <div className="system-icon">ℹ️</div>
                <p>{message.text}</p>
            </div>
        );
    }

    // Regular messages
    const hasTransformation = message.transformed && message.original;
    const emotion = message.analysis ? MessageTransformer.getEmotionEmoji(message.analysis.overallTone) : '😊';
    const severityColor = message.analysis ? MessageTransformer.getSeverityColor(message.analysis.severityLevel) : '#10B981';

    return (
        <div className={`message-bubble ${isCurrentUser ? 'current-user' : 'other-user'}`}>
            <div className="message-header">
                <div className="user-info">
                    <div className="user-avatar" style={{ backgroundColor: userColor }}>
                        {userName[0]}
                    </div>
                    <span className="user-name" style={{ color: userColor }}>{userName}</span>
                </div>
                <span className="message-time">
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* If message was transformed */}
            {hasTransformation ? (
                <div className="transformation-container">
                    {/* Original message (only visible to sender) */}
                    {isCurrentUser && (
                        <div className="original-message">
                            <div className="message-label">
                                <span>Sua mensagem original</span>
                                <span className="emotion-badge">{emotion}</span>
                            </div>
                            <div className="message-content original">
                                {message.original}
                            </div>
                        </div>
                    )}

                    {/* Transformed message (what was actually sent) */}
                    <div className="transformed-message">
                        <div className="message-label">
                            <span>{isCurrentUser ? 'Mensagem enviada (transformada pela IA)' : 'Mensagem recebida'}</span>
                            {isCurrentUser && message.analysis?.needsTransformation && (
                                <span className="ai-badge">✨ Transformado pela IA</span>
                            )}
                        </div>
                        <div className="message-content transformed">
                            {message.transformed || message.text}
                        </div>
                    </div>

                    {/* Analysis details (expandable, only for sender) */}
                    {isCurrentUser && message.analysis?.needsTransformation && (
                        <div className="analysis-section">
                            <button
                                className="toggle-details"
                                onClick={() => setShowDetails(!showDetails)}
                            >
                                {showDetails ? '▼' : '▶'} Ver detalhes da transformação
                            </button>

                            {showDetails && (
                                <div className="analysis-details">
                                    {/* Warnings */}
                                    {message.analysis.warnings?.length > 0 && (
                                        <div className="warnings">
                                            {message.analysis.warnings.map((warning, idx) => (
                                                <div key={idx} className={`warning warning-${warning.level}`}>
                                                    <span className="warning-icon">⚠️</span>
                                                    {warning.message}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Detected patterns */}
                                    {message.analysis.detectedPatterns?.length > 0 && (
                                        <div className="detected-patterns">
                                            <strong>Padrões identificados:</strong>
                                            <div className="pattern-tags">
                                                {message.analysis.detectedPatterns.map((pattern, idx) => (
                                                    <span key={idx} className={`pattern-tag pattern-${pattern.severity}`}>
                                                        {pattern.type}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Suggestions */}
                                    {message.suggestions?.length > 0 && (
                                        <div className="suggestions">
                                            <strong>💡 Sugestões:</strong>
                                            {message.suggestions.map((suggestion, idx) => (
                                                <div key={idx} className="suggestion-item">
                                                    <span className="suggestion-icon">{suggestion.icon}</span>
                                                    {suggestion.text}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* Simple message (no transformation needed) */
                <div className="message-content simple">
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default MessageBubble;
