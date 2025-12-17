"use client";

import { useState } from 'react';

type Message = {
    role: 'user' | 'bot';
    content: string;
};

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: 'Hi there! I am your personal shopping assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsLoading(true);

        // Simulate AI response for now (would connect to real API later)
        setTimeout(() => {
            let botResponse = "I can help you with that!";
            const lowerInput = userMessage.toLowerCase();

            if (lowerInput.includes('shoe') || lowerInput.includes('sneaker')) {
                botResponse = "Check out our new Nebula Sneakers in the Footwear collection. They are trending right now!";
            } else if (lowerInput.includes('return') || lowerInput.includes('refund')) {
                botResponse = "We offer a 30-day return policy on all unworn items. You can initiate a return from your profile.";
            } else if (lowerInput.includes('shipping')) {
                botResponse = "Shipping is free for orders over $200. Standard shipping takes 3-5 business days.";
            } else if (lowerInput.includes('recommend') || lowerInput.includes('suggest')) {
                botResponse = "Based on your interest in streetwear, I'd highly recommend the Obsidian Hoodie. It's a best-seller!";
            } else {
                botResponse = "I'm still learning! Try asking about our products, shipping, or returns.";
            }

            setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-bounce-subtle"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-80 sm:w-96 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-primary p-4 flex justify-between items-center text-primary-foreground">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <h3 className="font-semibold">Luxe AI Stylist</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-primary/80 p-1 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-secondary text-secondary-foreground rounded-tl-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-secondary text-secondary-foreground p-3 rounded-2xl rounded-tl-none text-sm">
                                    <span className="flex space-x-1">
                                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border bg-card">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about styles, sizing..."
                                className="flex-1 bg-muted px-4 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
