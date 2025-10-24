'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';

interface Task {
    id: string;
    title: string;
    description: string;
    code: string;
    solution: string;
    violation: string;
}

interface SessionTask {
    id: string;
    status: 'pending' | 'notice' | 'urgent' | 'completed' | 'failed';
    output?: string;
    penalty: number;
    task: Task;
}

interface CodeEditorProps {
    task: SessionTask;
    userCode: string;
    onCodeChange: (code: string) => void;
    onComplete: (output: string) => void;
    onShowSolution: () => void;
    onSave: (output: string) => void;
}

export default function CodeEditor({
    task,
    userCode,
    onCodeChange,
    onComplete,
    onShowSolution,
    onSave
}: CodeEditorProps) {
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState<string | null>(null);

    const getStatusColor = () => {
        switch (task.status) {
            case 'pending':
                return 'border-gray-300';
            case 'notice':
                return 'border-yellow-400 bg-yellow-50';
            case 'urgent':
                return 'border-red-400 bg-red-50';
            case 'completed':
                return 'border-green-400 bg-green-50';
            case 'failed':
                return 'border-red-600 bg-red-100';
            default:
                return 'border-gray-300';
        }
    };

    const getStatusText = () => {
        switch (task.status) {
            case 'pending':
                return 'Pending';
            case 'notice':
                return 'Notice - Fix Required';
            case 'urgent':
                return 'Urgent - Court Risk';
            case 'completed':
                return 'Completed';
            case 'failed':
                return 'Failed';
            default:
                return 'Unknown';
        }
    };

    const handleValidate = async () => {
        setIsValidating(true);
        setValidationResult(null);

        try {
            // Simulate validation logic
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Basic validation - check if code has been modified
            if (userCode === task.task.code) {
                setValidationResult('❌ No changes detected. Please modify the code to fix the issue.');
            } else if (userCode.includes('alt=') && task.task.title.includes('alt')) {
                setValidationResult('✅ Validation passed! Alt attribute has been added.');
            } else if (userCode.includes('validation') && task.task.title.includes('validation')) {
                setValidationResult('✅ Validation passed! Input validation has been implemented.');
            } else if (userCode.includes('bcrypt') && task.task.title.includes('login')) {
                setValidationResult('✅ Validation passed! Secure authentication implemented.');
            } else if (userCode.includes('process.env') && task.task.title.includes('database')) {
                setValidationResult('✅ Validation passed! Secure database connection configured.');
            } else {
                setValidationResult('⚠️ Code modified but validation inconclusive. Please review your changes.');
            }
        } catch (error) {
            setValidationResult('❌ Validation failed. Please try again.');
        } finally {
            setIsValidating(false);
        }
    };

    const handleComplete = () => {
        if (validationResult?.includes('✅')) {
            onComplete(userCode);
        } else {
            alert('Please validate your code first and ensure it passes validation.');
        }
    };

    const handleSave = () => {
        onSave(userCode);
        alert('Code saved successfully!');
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg border-2 ${getStatusColor()} transition-all duration-300`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{task.task.title}</h2>
                        <p className="text-sm text-gray-600 mt-1">{task.task.description}</p>
                        <div className="mt-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    task.status === 'failed' ? 'bg-red-100 text-red-800' :
                                        task.status === 'urgent' ? 'bg-red-100 text-red-800' :
                                            task.status === 'notice' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                }`}>
                                {getStatusText()}
                            </span>
                            {task.penalty > 0 && (
                                <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                                    Penalty: {task.penalty} points
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        Violation: {task.task.violation}
                    </div>
                </div>
            </div>

            {/* Code Editor */}
            <div className="p-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Code:
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <Editor
                            height="300px"
                            defaultLanguage="javascript"
                            value={userCode}
                            onChange={(value) => onCodeChange(value || '')}
                            theme="vs-light"
                            options={{
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                fontSize: 14,
                                lineNumbers: 'on',
                                wordWrap: 'on'
                            }}
                        />
                    </div>
                </div>

                {/* Validation Result */}
                {validationResult && (
                    <div className={`p-3 rounded-lg mb-4 ${validationResult.includes('✅') ? 'bg-green-50 border border-green-200' :
                            validationResult.includes('❌') ? 'bg-red-50 border border-red-200' :
                                'bg-yellow-50 border border-yellow-200'
                        }`}>
                        <p className="text-sm">{validationResult}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <button
                        onClick={handleValidate}
                        disabled={isValidating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isValidating ? 'Validating...' : 'Validate Fix'}
                    </button>

                    <button
                        onClick={handleComplete}
                        disabled={task.status === 'completed'}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Complete Task
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Save Progress
                    </button>

                    <button
                        onClick={onShowSolution}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Show Solution (+Penalty)
                    </button>
                </div>
            </div>
        </div>
    );
}
