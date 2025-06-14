import React, { useEffect, useState, useRef, use, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { MdSend, MdAttachFile, MdExitToApp} from 'react-icons/md';
import messageService from '../../services/message.services';
import authServices from '../../services/auth.services';
function InboxForm({ userId,refreshData }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [error, setError] = useState(null);
  const [sendingError, setSendingError] = useState(null);
  const [limit, setLimit] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const skipAutoScroll = useRef(false);
  const scrollToBottom = useCallback(() => {
    if (!skipAutoScroll.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    skipAutoScroll.current = false;
  }, [messages])


  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);
  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async function () {
      try {
        if (!userId) return;
        setError(null);
        setLoadingMore(true);
        const [userData, messagesData] = await Promise.all([
          authServices.getUserById({ userId }),
          messageService.getMessages(userId, limit * 10)
        ]);

        if (isMounted) {
          setReceiver(userData.data);
          setMessages(messagesData.data.messages);
          setHasMore(messagesData.data.messageCount > messages.length);
        }

      } catch (error) {
        if (isMounted) {
          setError(error.response?.data?.error || "Failed to load messages");
        }
      } finally {
        if (isMounted) setLoadingMore(false);
      }
    }

    fetchMessages();

    return () => { isMounted = false }; // Cleanup
  }, [userId, limit, refreshData]); // Only depend on userId

  // Add refresh capability
  // const refreshMessages = useCallback(async () => {
  //   try {
  //     const { data } = await messageService.getMessages(userId);
  //     setMessages(data);
  //   } catch (error) {
  //     setError(error.response?.data?.error || "Refresh failed");
  //   }
  // }, [userId]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files.map(file => file.name));
    setValue('messageFiles', files);
  };

  const handleSendMessage = async (data) => {
    try {
      setSendingError(null);
      setLoading(true);
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
        //setMessages(prev => [...prev, sentMessage.data]);
        reset();
        setSelectedFiles([]);
        refreshData();
      }
    } catch (error) {
      setSendingError(error.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-full">
  //       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6C48E3]"></div>
  //     </div>
  //   );
  // }

  const handleSeeMore = () => {
    skipAutoScroll.current = true;
    setLimit(limit + 1);
  };
  return !error ? (
    <div className="flex flex-col h-full bg-[var(--color-primary)">
      {/* Header */}
      {receiver && (
        <div className="flex items-center p-4 bg-[#F2F4F7] rounded-xl border-b border-gray-200">
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
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--color-primary)">

        {!loadingMore && hasMore ? (
  <button
    onClick={handleSeeMore}
    className="relative top-0 left-1/2 -translate-x-1/2 z-10
              bg-[#F2F4F7] hover:bg-white border border-gray-200
              rounded-full shadow-sm hover:shadow-md
              px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900
              transition-all duration-200 ease-in-out
              flex items-center gap-2
              backdrop-blur-sm"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-gray-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
    />
    </svg>
    Show older messages
  </button>
) : loadingMore ? (
  <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10
                 bg-white/90 border border-gray-200
                 rounded-full shadow-sm
                 p-2
                 backdrop-blur-sm">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 animate-spin text-gray-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  </div>
) : null}
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isSentByUser = msg.sender?._id !== userId;
            return (
              <React.Fragment key={index}>
                <div key={msg._id} className={`flex ${isSentByUser ? 'justify-end' : 'justify-start'} mb-3 px-4`}>
                  <div className={`flex flex-row items-end max-w-[80%]`}>
                    {/* Avatar */}
                    {!isSentByUser && receiver.avatar && (
                      <div className="flex-shrink-0 mr-2 mb-1">
                        <img
                          src={receiver.avatar}
                          alt={receiver.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`
        relative px-4 py-2 rounded-2xl text-sm
        ${isSentByUser
                          ? 'bg-[var(--color-primary)] rounded-br-none text-white'
                          : 'bg-[#E9E4FD] rounded-bl-none'
                        }
        shadow-sm
      `}
                    >
                      {/* Message text */}
                      <div className="whitespace-pre-wrap break-words">
                        {msg.message}
                      </div>

                      {/* Timestamp */}
                      <div className={`text-xs mt-1 flex ${isSentByUser ? 'justify-end' : 'justify-start'}`}>
                        <span className={`${isSentByUser ? 'bg-[var(--color-primary)] text-white' : 'bg-[#E9E4FD]'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Attachments */}
                      {msg.messageFiles?.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.messageFiles.map((file, index) => {
                            const extension = file.split('.').pop()?.toLowerCase() || '';
                            const imageTypes = ['jpg', 'jpeg', 'png', 'gif'];
                            const videoTypes = ['mp4', 'webm', 'ogg'];
                            //const pdfTypes = ['pdf'];

                            return (
                              <div
                                key={index}
                                className={`
                  overflow-hidden rounded-lg border
                  ${isSentByUser
                                    ? 'border-gray-200'
                                    : 'border-[rgba(255,255,255,0.1)]'
                                  }
                `}
                              >
                                {imageTypes.includes(extension) ? (
                                  <img
                                    src={file}
                                    alt="Attachment"
                                    className="max-w-full max-h-60 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                  />
                                ) : videoTypes.includes(extension) ? (
                                  <video controls className="max-w-full max-h-60 bg-black">
                                    <source src={file} type={`video/${extension}`} />
                                  </video>
                                ) : (
                                  <a
                                    href={file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`
                      flex items-center p-3 hover:bg-opacity-10 transition-colors
                      ${isSentByUser
                                        ? 'text-[var(--color-card)] hover:bg-gray-200'
                                        : 'text-red hover:bg-[rgba(255,255,255,0.1)]'
                                      }
                    `}
                                  >
                                    <svg className="mr-2 flex-shrink-0 w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                    </svg>
                                    <span className="truncate">{file.split('/').pop()}</span>
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {(index % 3 === 0 || index === messages.length - 1) && (
                  <div ref={index === messages.length - 1 ? messagesEndRef : null} />
                )}
              </React.Fragment>

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
      {sendingError && <p className="text-red-500 text-center">{sendingError || 'Failed to send message'}</p>}

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 bg-white border-t border-[var(--color-background]">
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
      <form onSubmit={handleSubmit(handleSendMessage)} className="rounded-xl p-3 bg-[var(--color-background] border-t border-[var(--color-card)]">
        <div className="flex items-center">
          <label className="cursor-pointer p-2 text-gray-500 hover:text-[#6C48E3]">
            <MdAttachFile size={20} />
            <input type="file" multiple className="hidden" onChange={handleFileChange} />
          </label>
          {!loading ? (<textarea
            {...register('message')}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-1 focus:ring-[#6C48E3] resize-none"
            rows="1"
          />) : (
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Sending</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <button
            type={`${watch('message') ? 'submit' : 'button'}`}
            className={`bg-[#6C48E3] text-white p-2 rounded-full hover:bg-[#5a3ac9] transition ${watch('message') == '' || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <MdSend size={20} />
          </button>
        </div>
      </form>
    </div>
  ) : typeof error === 'string' ? (
    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-start">
      <MdExitToApp className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-medium">Error getting message</h3>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  ):null;
}


export default InboxForm;