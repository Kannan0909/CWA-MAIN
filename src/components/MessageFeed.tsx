'use client';

import { useEffect, useRef } from 'react';

interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    read: boolean;
}

interface MessageFeedProps {
    messages: Message[];
}

export default function MessageFeed({ messages }: MessageFeedProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getSenderColor = (sender: string) => {
        switch (sender) {
            case 'Boss':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Family':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Agile':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSenderIcon = (sender: string) => {
        switch (sender) {
            case 'Boss':
                return '👔';
            case 'Family':
                return '👨‍👩‍👧‍👦';
            case 'Agile':
                return '🏃‍♂️';
            default:
                return '💬';
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white rounded-lg shadow-lg h-96 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Message Feed</h3>
                <p className="text-sm text-gray-600">Noise from Boss, Family & Agile</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <div className="text-4xl mb-2">📱</div>
                        <p>No messages yet...</p>
                        <p className="text-sm">Messages will appear here during the session</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`p-3 rounded-lg border-l-4 ${getSenderColor(message.sender)} animate-pulse`}
                        >
                            <div className="flex items-center space-x-2 mb-1">
                                <span className="text-lg">{getSenderIcon(message.sender)}</span>
                                <span className="font-semibold text-sm">{message.sender}</span>
                                <span className="text-xs opacity-75">{formatTime(message.timestamp)}</span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500 text-center">
                    Messages appear every 20-30 seconds
                </div>
            </div>
        </div>
    );
}
