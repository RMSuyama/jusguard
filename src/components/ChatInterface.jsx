import { useState, useRef, useEffect } from 'react';
import { MessageTransformer } from '../utils/MessageTransformer';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import './ChatInterface.css';

function ChatInterface({ onBack }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'system',
            text: 'Bem-vindo ao Mediador Familiar! Aqui você pode se comunicar de forma segura e construtiva. A IA transformará suas mensagens para garantir uma conversa respeitosa.',
            timestamp: new Date(),
        }
    ]);

    const [currentUser, setCurrentUser] = useState('user1'); // Simula dois usuários
    const [isTyping, setIsTyping] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Toggle dark mode
    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [darkMode]);

    const handleSendMessage = async (originalText, transformedText, analysis) => {
        // Add user's message (what they typed)
        const userMessage = {
            id: messages.length + 1,
            sender: currentUser,
            original: originalText,
            transformed: transformedText,
            analysis: analysis,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);

        // Simulate typing indicator
        setIsTyping(true);

        // Simulate response after a delay
        setTimeout(() => {
            const responses = [
                'Obrigado por compartilhar. Vou verificar minha agenda e te respondo em breve.',
                'Entendi. Vou pensar sobre isso e podemos conversar mais detalhadamente.',
                'Parece uma boa ideia. Vamos combinar os detalhes?',
                'Compreendo sua preocupação. Vamos encontrar uma solução juntos.',
                'Perfeito! Vou organizar isso e confirmo com você.',
            ];

            const responseMessage = {
                id: messages.length + 2,
                sender: currentUser === 'user1' ? 'user2' : 'user1',
                text: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, responseMessage]);
            setIsTyping(false);
        }, 2000);
    };

    const switchUser = () => {
        setCurrentUser(prev => prev === 'user1' ? 'user2' : 'user1');
    };

    const getUserName = (userId) => {
        return userId === 'user1' ? 'Ana' : 'Carlos';
    };

    const getUserColor = (userId) => {
        return userId === 'user1' ? '#4A90E2' : '#50C878';
    };

    return (
        <div className="chat-interface">
            {/* Header */}
            <header className="chat-header glass-card">
                <div className="header-left">
                    <button className="btn-icon" onClick={onBack} title="Voltar">
                        ←
                    </button>
                    <div className="chat-info">
                        <h2>Conversa Mediada</h2>
                        <div className="participants">
                            <span className="participant" style={{ color: getUserColor('user1') }}>
                                👤 Ana
                            </span>
                            <span className="divider">•</span>
                            <span className="participant" style={{ color: getUserColor('user2') }}>
                                👤 Carlos
                            </span>
                        </div>
                    </div>
                </div>

                <div className="header-right">
                    <div className="current-user-badge" style={{ backgroundColor: getUserColor(currentUser) }}>
                        Você: {getUserName(currentUser)}
                        <button className="btn-switch" onClick={switchUser} title="Alternar usuário (demo)">
                            ⇄
                        </button>
                    </div>

                    <button
                        className="btn-icon"
                        onClick={() => setDarkMode(!darkMode)}
                        title={darkMode ? "Modo claro" : "Modo escuro"}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </header>

            {/* Messages Area */}
            <div className="messages-container" ref={chatContainerRef}>
                <div className="messages-wrapper">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isCurrentUser={message.sender === currentUser}
                            userName={getUserName(message.sender)}
                            userColor={getUserColor(message.sender)}
                        />
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="typing-indicator">
                            <div className="typing-bubble">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <p className="typing-text">{getUserName(currentUser === 'user1' ? 'user2' : 'user1')} está digitando...</p>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message Composer */}
            <div className="composer-container">
                <MessageComposer onSendMessage={handleSendMessage} currentUser={currentUser} />
            </div>

            {/* Info Sidebar */}
            <aside className="info-sidebar glass-card">
                <h3>💡 Dicas</h3>
                <div className="tip-card">
                    <div className="tip-icon">🛡️</div>
                    <p>A IA filtra automaticamente linguagem agressiva ou manipulativa.</p>
                </div>
                <div className="tip-card">
                    <div className="tip-icon">👶</div>
                    <p>Mantenha o foco no bem-estar das crianças.</p>
                </div>
                <div className="tip-card">
                    <div className="tip-icon">🤝</div>
                    <p>Busque sempre soluções práticas e construtivas.</p>
                </div>
                <div className="tip-card">
                    <div className="tip-icon">⚠️</div>
                    <p>Você será alertado se a mensagem pode gerar conflito.</p>
                </div>
            </aside>
        </div>
    );
}

export default ChatInterface;
