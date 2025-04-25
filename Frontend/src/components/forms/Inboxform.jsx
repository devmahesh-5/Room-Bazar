import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { MdSend, MdAttachFile } from 'react-icons/md';
import messageService from '../../services/message.services';
import authServices from '../../services/auth.services';

function InboxForm({ userId }) {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        async function fetchMessages() {
            try {
                setLoading(true);
                const user = await authServices.getUserById({ userId });
                const fetchedMessages = await messageService.getMessages(userId);
                setMessages(fetchedMessages.data);
                setReceiver(user.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        }
        if (userId) {
            fetchMessages();
        }
    }, [userId]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files.map(file => file.name));
        setValue('messageFiles', files);
    };

    const handleSendMessage = async (data) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                if (key === 'messageFiles' && data[key]?.length > 0) {
                    data[key].forEach(file => formData.append('messageFiles', file));
                } else {
                    formData.append(key, data[key]);
                }
            }

            const sentMessage = await messageService.sendMessage(userId, formData);
            if (sentMessage) {
                setMessages(prev => [...prev, sentMessage.data]);
                reset();
                setSelectedFiles([]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6C48E3]"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#F2F4F7]">
            {/* Header */}
            {receiver && (
                <div className="flex items-center p-4 bg-gray-200 rounded-xl border-b border-gray-200">
                    <img
                        src={receiver.avatar}
                        alt={receiver.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                        <h3 className="font-medium text-gray-900">{receiver.fullName}</h3>
                        <p className="text-xs text-gray-500">Online</p>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length > 0 ? (
                    messages.map((msg) => {
                        const isSentByUser = msg.sender?._id === userId;
                        return (
                            <div key={msg._id} className={`flex ${isSentByUser ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isSentByUser ? 'bg-white' : 'bg-[#6C48E3] text-white'}`}>
                                    {msg.sender?.avatar && isSentByUser && (
                                        <div className="flex items-center mb-1">
                                            <img src={msg.sender.avatar} alt={msg.sender.fullName} className="w-6 h-6 rounded-full mr-2" />
                                            <span className="text-xs font-medium">{msg.sender.fullName}</span>
                                        </div>
                                    )}
                                    <p className="text-sm">{msg.message}</p>
                                    
                                    {msg.messageFiles?.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {msg.messageFiles.map((file, index) => {
                                                const fileType = file.split('.').pop().toLowerCase();
                                                return (
                                                    <div key={index} className="bg-black bg-opacity-10 rounded p-2">
                                                        {['jpg', 'jpeg', 'png', 'gif'].includes(fileType) ? (
                                                            <img src={file} alt="Attachment" className="max-w-full h-auto rounded" />
                                                        ) : ['mp4', 'webm', 'ogg'].includes(fileType) ? (
                                                            <video controls className="max-w-full h-auto rounded">
                                                                <source src={file} type={`video/${fileType}`} />
                                                            </video>
                                                        ) : fileType === 'pdf' ? (
                                                            <embed src={file} type="application/pdf" className="w-full h-40 rounded" />
                                                        ) : (
                                                            <a href={file} target="_blank" rel="noopener noreferrer" 
                                                               className="text-[#6C48E3] underline text-sm">
                                                                {file.split('/').pop()}
                                                            </a>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p>No messages yet</p>
                        <p className="text-sm">Send a message to start the conversation</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* File Preview */}
            {selectedFiles.length > 0 && (
                <div className="px-4 py-2 bg-white border-t border-gray-200">
                    <div className="flex items-center overflow-x-auto space-x-2">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1 text-xs">
                                <span className="truncate max-w-xs">{file}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit(handleSendMessage)} className="rounded-xl p-3 bg-gray-300 border-t border-gray-200">
                <div className="flex items-center">
                    <label className="cursor-pointer p-2 text-gray-500 hover:text-[#6C48E3]">
                        <MdAttachFile size={20} />
                        <input type="file" multiple className="hidden" onChange={handleFileChange} />
                    </label>
                    <textarea
                        {...register('message')}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-200 rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-1 focus:ring-[#6C48E3] resize-none"
                        rows="1"
                    />
                    <button
                        type="submit"
                        className="bg-[#6C48E3] text-white p-2 rounded-full hover:bg-[#5a3ac9] transition"
                    >
                        <MdSend size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default InboxForm;