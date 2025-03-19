import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import messageService from '../../services/message.services';
import { MdSend, MdAttachFile } from 'react-icons/md';
import authServices from '../../services/auth.services';

function InboxForm({ userId }) {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]); // Track selected files
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function fetchMessages() {
            try {
                setLoading(true);
                const user = await authServices.getUserById({ userId });
                const fetchedMessages = await messageService.getMessages(userId);
                setMessages(fetchedMessages.data);
                setReceiver(user.data); // Set receiver profile
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([]);
            }finally{
                setLoading(false);
            }
        }
        fetchMessages();
    }, [userId]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files.map(file => file.name)); // Store file names
        setValue('messageFiles', files); // Register files in the form
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
                setMessages((prevMessages) => [...prevMessages, sentMessage.data]);
                reset();
                setSelectedFiles([]); // Clear file selection
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return !loading ? (
        <div className="flex flex-col h-screen p-4">
            {/* Receiver Profile Section */}
            {receiver && (
                <div className="flex items-center p-4 bg-[#F2F4F7] rounded-lg mb-2">
                    <img
                        src={receiver.avatar}
                        alt={receiver.fullName}
                        className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-4">
                        <h2 className="text-lg font-semibold text-gray-800">{receiver.fullName}</h2>
                        <p className="text-sm text-gray-600">{receiver.username}</p>
                    </div>
                </div>
            )}

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto space-y-1">
                {messages.map((msg) => {
                    const isSentByUser = msg.sender?._id === userId;
                    return (
                        <div key={msg._id} className={`flex ${isSentByUser ? 'justify-start' : 'justify-end'}`}>
                            {isSentByUser && msg.sender?.avatar && (
                                <img src={msg.sender.avatar} alt={msg.sender.fullName} className="w-8 h-8 rounded-full" />
                            )}
                            <div className={`max-w-xs p-2 rounded-xl shadow-md ${isSentByUser ? 'bg-blue-500 text-[#F2F4F7]' : 'bg-[#6C48E3] text-[#F2F4F7]'}`}>
                                <p className="mt-2">{msg.message}</p>

                                {/* Display Attached Files */}
                                {msg.messageFiles?.length > 0 && (
                                    <div className="mt-2 space-y-2 ">
                                        {msg.messageFiles.map((file, index) => {
                                            const fileType = file.split('.').pop();
                                            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
                                                return <img key={index} src={file} alt="Attachment" className="w-32 h-32 rounded-lg" />;
                                            } else if (['mp4', 'webm', 'ogg'].includes(fileType)) {
                                                return (
                                                    <video key={index} controls className="w-32 h-32 rounded-lg">
                                                        <source src={file} type={`video/${fileType}`} />
                                                    </video>
                                                );
                                            } else if (fileType === 'pdf') {
                                                return <embed key={index} src={file} type="application/pdf" className="w-32 h-40 rounded-lg" />;
                                            } else {
                                                return (
                                                    <a key={index} href={file} target="_blank" rel="noopener noreferrer" className="text-blue-200 underline block">
                                                        {file.split('/').pop()}
                                                    </a>
                                                );
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
                <div className="mt-2 p-2 bg-gray-200 rounded-lg">
                    <p className="text-sm font-medium">Selected Files:</p>
                    <ul className="text-sm text-gray-700">
                        {selectedFiles.map((file, index) => (
                            <li key={index} className="mt-1">{file}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Message Input */}
            <form className="flex flex-row bg-white p-2 rounded-lg shadow-md mt-4" onSubmit={handleSubmit(handleSendMessage)}>
                <textarea
                    {...register('message')}
                    placeholder="Write a message..."
                    className="flex-1 border-none outline-none p-2 rounded-lg bg-gray-200 resize-none"
                />

                {/* File Upload Section */}
                <div className="flex items-center mt-2 space-x-2">
                    <input type="file" multiple className="hidden" id="file-input" onChange={handleFileChange} />
                    <label htmlFor="file-input" className="cursor-pointer bg-gray-300 px-3 py-1 rounded-lg text-gray-700 flex items-center space-x-2">
                        <MdAttachFile />
                    </label>
                    <button type="submit" className="bg-[#6C48E3] text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center space-x-2">
                        <MdSend />
                    </button>
                </div>
            </form>
        </div>
    ):(<div className='flex justify-center items-center h-screen'>No Message Selected</div>);
}

export default InboxForm;