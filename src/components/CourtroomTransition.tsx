'use client';

import { useEffect, useState } from 'react';

interface CourtroomTransitionProps {
    show: boolean;
}

export default function CourtroomTransition({ show }: CourtroomTransitionProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
        }
    }, [show]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-50 transition-all duration-2000 ${show ? 'opacity-100' : 'opacity-0'
            }`}>
            {/* Courtroom Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-900 via-red-800 to-red-900">
                {/* Courtroom Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Judge's Bench */}
                    <div className="text-center text-white">
                        <div className="text-6xl mb-4">⚖️</div>
                        <h1 className="text-4xl font-bold mb-2">COURTROOM</h1>
                        <p className="text-xl">Software Law Violation Detected</p>
                    </div>
                </div>

                {/* Gavel Animation */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-8xl animate-bounce">🔨</div>
                </div>

                {/* Verdict Text */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center text-white">
                    <div className="bg-red-900 bg-opacity-80 p-6 rounded-lg border-2 border-red-600">
                        <h2 className="text-2xl font-bold mb-2">VERDICT</h2>
                        <p className="text-lg">You have been found guilty of software law violations!</p>
                        <p className="text-sm mt-2 opacity-75">Return to your work desk and complete the tasks properly.</p>
                    </div>
                </div>

                {/* Fade out after 3 seconds */}
                <div className="absolute inset-0 bg-black opacity-0 animate-fade-in-delayed"></div>
            </div>

            <style jsx>{`
        @keyframes fade-in-delayed {
          0% { opacity: 0; }
          70% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 3s ease-in-out;
        }
      `}</style>
        </div>
    );
}
