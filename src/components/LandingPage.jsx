import { useState } from 'react';
import './LandingPage.css';

function LandingPage({ onEnterApp }) {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        {
            icon: '🛡️',
            title: 'Filtro Emocional Inteligente',
            description: 'A IA identifica agressividade, manipulação e sarcasmo, transformando em comunicação neutra e respeitosa.',
        },
        {
            icon: '👶',
            title: 'Foco nas Crianças',
            description: 'Lembretes automáticos sobre obrigações parentais e sugestões que priorizam o bem-estar dos filhos.',
        },
        {
            icon: '💡',
            title: 'Sugestões Práticas',
            description: 'Alternativas construtivas para resolver conflitos de agenda, logística e decisões sobre as crianças.',
        },
        {
            icon: '⚠️',
            title: 'Prevenção de Conflitos',
            description: 'Alertas em tempo real quando uma mensagem pode gerar escalada emocional.',
        },
    ];

    const testimonials = [
        {
            name: 'Ana Silva',
            role: 'Advogada de Família',
            text: 'Esta ferramenta revolucionou como meus clientes se comunicam. Reduz dramaticamente os conflitos.',
            avatar: '👩‍⚖️',
        },
        {
            name: 'Dr. Roberto Costa',
            role: 'Terapeuta de Casais',
            text: 'Finalmente uma tecnologia que prioriza a saúde emocional das famílias em transição.',
            avatar: '👨‍⚕️',
        },
        {
            name: 'Mariana Santos',
            role: 'Mãe Solo',
            text: 'Consigo conversar sobre meu filho sem o estresse de antes. Mudou minha vida.',
            avatar: '👩',
        },
    ];

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content fade-in">
                        <div className="hero-badge">🤝 Tecnologia de Convivência</div>
                        <h1 className="hero-title">
                            Comunique-se Sem
                            <br />
                            <span className="gradient-text">Conflitos</span>
                        </h1>
                        <p className="hero-subtitle">
                            A primeira plataforma de comunicação mediada por IA para casais separados.
                            Transformamos mensagens carregadas de emoção em conversas construtivas focadas no que realmente importa: seus filhos.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn btn-primary btn-large" onClick={onEnterApp}>
                                Experimentar Agora
                                <span>→</span>
                            </button>
                            <button className="btn btn-outline btn-large">
                                Saiba Mais
                                <span>↓</span>
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <div className="stat-value">87%</div>
                                <div className="stat-label">Redução de conflitos</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">95%</div>
                                <div className="stat-label">Satisfação dos usuários</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">10k+</div>
                                <div className="stat-label">Famílias atendidas</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="floating-card card-1">
                        <div className="message-preview hostile">
                            <div className="message-header">Antes</div>
                            <div className="message-text">VOCÊ NUNCA ESTÁ DISPONÍVEL! Sempre a mesma desculpa!</div>
                        </div>
                    </div>
                    <div className="floating-card card-2">
                        <div className="arrow-transform">→</div>
                    </div>
                    <div className="floating-card card-3">
                        <div className="message-preview calm">
                            <div className="message-header">Depois</div>
                            <div className="message-text">Olá, gostaria de combinar um horário que funcione para ambos. Você tem preferência?</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="container">
                    <h2 className="section-title">Como Funciona</h2>
                    <p className="section-subtitle">Um intermediador emocional que reduz brigas e aumenta a clareza</p>

                    <div className="steps">
                        <div className="step slide-in-left">
                            <div className="step-number">1</div>
                            <div className="step-icon">✍️</div>
                            <h3>Escreva Livremente</h3>
                            <p>Digite exatamente o que você sente, mesmo que esteja irritado ou cansado. A IA está aqui para ajudar.</p>
                        </div>

                        <div className="step-arrow">→</div>

                        <div className="step fade-in">
                            <div className="step-number">2</div>
                            <div className="step-icon">🤖</div>
                            <h3>IA Transforma</h3>
                            <p>A inteligência artificial identifica emoções negativas e transforma sua mensagem em comunicação neutra e objetiva.</p>
                        </div>

                        <div className="step-arrow">→</div>

                        <div className="step slide-in-right">
                            <div className="step-number">3</div>
                            <div className="step-icon">✅</div>
                            <h3>Mensagem Segura</h3>
                            <p>O outro lado recebe apenas a versão funcional da conversa, sem ataques ou manipulação.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">Recursos Inteligentes</h2>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                                onMouseEnter={() => setActiveFeature(index)}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="use-cases">
                <div className="container">
                    <h2 className="section-title">Para Quem é Esta Ferramenta?</h2>
                    <div className="use-cases-grid">
                        <div className="use-case glass-card">
                            <div className="use-case-icon">👨‍👩‍👧‍👦</div>
                            <h3>Pais Separados</h3>
                            <p>Comunique-se sobre seus filhos sem o estresse emocional de conversas diretas.</p>
                        </div>
                        <div className="use-case glass-card">
                            <div className="use-case-icon">⚖️</div>
                            <h3>Advogados de Família</h3>
                            <p>Reduza conflitos entre clientes e facilite acordos de guarda e visitação.</p>
                        </div>
                        <div className="use-case glass-card">
                            <div className="use-case-icon">🏥</div>
                            <h3>Terapeutas</h3>
                            <p>Ferramenta complementar para terapia de casais em processo de separação.</p>
                        </div>
                        <div className="use-case glass-card">
                            <div className="use-case-icon">🏢</div>
                            <h3>Plataformas de Mediação</h3>
                            <p>Integre tecnologia de IA em seus serviços de mediação familiar.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials">
                <div className="container">
                    <h2 className="section-title">O Que Dizem Nossos Usuários</h2>
                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card glass-card fade-in">
                                <div className="testimonial-avatar">{testimonial.avatar}</div>
                                <p className="testimonial-text">"{testimonial.text}"</p>
                                <div className="testimonial-author">
                                    <strong>{testimonial.name}</strong>
                                    <span>{testimonial.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-content glass-card">
                        <h2>Pronto para Melhorar Sua Comunicação?</h2>
                        <p>Experimente gratuitamente e veja como a IA pode transformar suas conversas.</p>
                        <button className="btn btn-primary btn-large" onClick={onEnterApp}>
                            Começar Agora - É Grátis
                            <span>→</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3>🤝 Mediador Familiar</h3>
                            <p>Tecnologia de convivência, não de julgamento.</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Produto</h4>
                                <a href="#">Recursos</a>
                                <a href="#">Preços</a>
                                <a href="#">Segurança</a>
                            </div>
                            <div className="footer-column">
                                <h4>Empresa</h4>
                                <a href="#">Sobre</a>
                                <a href="#">Blog</a>
                                <a href="#">Contato</a>
                            </div>
                            <div className="footer-column">
                                <h4>Legal</h4>
                                <a href="#">Privacidade</a>
                                <a href="#">Termos</a>
                                <a href="#">Cookies</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 Mediador Familiar. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
