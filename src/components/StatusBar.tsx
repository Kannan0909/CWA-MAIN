'use client';

interface StatusBarProps {
    phase: 'WORK' | 'COURT' | 'ENDED';
    timeLeft: string;
    completed: number;
    ignored: number;
    penalties: number;
}

export default function StatusBar({ phase, timeLeft, completed, ignored, penalties }: StatusBarProps) {
    const getStatusColor = () => {
        switch (phase) {
            case 'WORK':
                return 'bg-green-500';
            case 'COURT':
                return 'bg-red-500';
            case 'ENDED':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = () => {
        switch (phase) {
            case 'WORK':
                return 'Working';
            case 'COURT':
                return 'In Court';
            case 'ENDED':
                return 'Session Ended';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between">
                {/* Status Indicator */}
                <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor()}`}></div>
                    <span className="text-lg font-semibold">{getStatusText()}</span>
                </div>

                {/* Timer */}
                <div className="text-2xl font-mono font-bold text-gray-800">
                    {timeLeft}
                </div>

                {/* Counters */}
                <div className="flex items-center space-x-6">
                    <div className="text-center">
                        <div className="text-sm text-gray-600">Completed</div>
                        <div className="text-xl font-bold text-green-600">{completed}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-600">Ignored</div>
                        <div className="text-xl font-bold text-yellow-600">{ignored}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-600">Penalties</div>
                        <div className="text-xl font-bold text-red-600">{penalties}</div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${((300 - parseInt(timeLeft.replace(':', '').replace(':', ''))) / 300) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
