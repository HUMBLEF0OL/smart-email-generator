'use client';

import { useState } from 'react';
import EmailOutput from './EmailOutput';

export default function EmailForm() {
    const [context, setContext] = useState('');
    const [tone, setTone] = useState('formal');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const generateEmail = async () => {
        if (!context.trim()) return;
        setLoading(true);
        setEmail('');

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context, tone }),
            });

            const data = await res.json();
            setEmail(data.result);
        } catch (err) {
            console.error('Error generating email:', err);
        } finally {
            setLoading(false);
        }
    };

    const regenerateEmail = async (context:string) => {
        try {
            debugger
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context, tone }),
            });

            const data = await res.json();
            return data.result;
        } catch (err) {
            console.error('Error regenerating email:', err);
            return 'Error regenerating email.';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="w-full">
                        <div className='flex justify-between items-end mb-2'>
                            <label className="block font-medium mb-2">Email Context</label>
                            <div className="sm:w-48 w-full">
                                <label className="block font-medium mb-2">Tone</label>
                                <select
                                    className="w-full p-2 border rounded-md bg-black text-white"
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                >
                                    <option value="formal">Formal</option>
                                    <option value="casual">Casual</option>
                                    <option value="friendly">Friendly</option>
                                    <option value="apologetic">Apologetic</option>
                                </select>
                            </div>
                        </div>
                        <textarea
                            className="w-full p-3 border rounded-md"
                            rows={6}
                            placeholder="Describe the purpose or content of the email..."
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                        />
                    </div>

                </div>

                <button
                    onClick={generateEmail}
                    disabled={loading || !context.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Generating...' : 'Generate Email'}
                </button>
            </div>

            {email && (
                <EmailOutput
                    content={email}
                    onRegenerate={(content=>{
                        return regenerateEmail(content);
                    })}
                />
            )}
        </div>
    );
}
