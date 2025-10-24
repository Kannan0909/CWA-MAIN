import React from 'react';
import styles from '../court-room/court-room.module.css';
import { Message } from '../messages';

interface MessageCenterProps {
    currentPopup: Message | null;
    messageHistory: Message[];
    showMessageHistory: boolean;
    formatMessageTime: (message: Message) => string;
    onClosePopup: () => void;
    onToggleHistory: () => void;
    onStartFixing?: (taskId: string) => void;
    activeTask?: string | null;
}

const MessageCenter: React.FC<MessageCenterProps> = ({
    currentPopup,
    messageHistory,
    showMessageHistory,
    formatMessageTime,
    onClosePopup,
    onToggleHistory,
    onStartFixing,
    activeTask
}) => {
    return (
        <div className={styles.messageCenter}>
            {currentPopup && (
                <div className={styles.messagePopup}>
                    <div className={styles.popupHeader}>
                        <span className={`${styles.popupSource} ${currentPopup.source === 'Ethical/Legal' ? 'bg-red-100 text-red-800' :
                            currentPopup.source === 'Court Order' ? 'bg-red-200 text-red-900' :
                                currentPopup.source === 'Boss' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                            }`}>
                            {currentPopup.source}
                        </span>
                        <button
                            onClick={onClosePopup}
                            className={styles.closePopup}
                        >
                            ×
                        </button>
                    </div>
                    <p className={styles.popupText}>{currentPopup.text}</p>
                    {currentPopup.isCritical && currentPopup.penaltyKey && currentPopup.penaltyKey !== 'Distraction' && onStartFixing && (
                        <button
                            onClick={() => onStartFixing(currentPopup.penaltyKey!)}
                            className={styles.fixButton}
                        >
                            Fix This
                        </button>
                    )}
                </div>
            )}

        </div>
    );
};

export default MessageCenter;