'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Conversation {
  id: number;
  status: string;
  created_at: string;
  messages: Message[];
  meta?: {
    sender?: {
      name: string;
      email?: string;
    };
  };
}

interface Message {
  id: number;
  content: string;
  message_type: number; // 0 = incoming (user), 1 = outgoing (agent)
  created_at: string;
  sender?: {
    name: string;
  };
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // 获取所有对话
  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/chat/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.data?.payload || []);
      } else {
        toast.error('无法加载对话列表');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('加载对话失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取某个对话的消息
  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await fetch(`/api/admin/chat/messages/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.payload || data || []);
      } else {
        toast.error('无法加载消息');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('加载消息失败');
    }
  };

  // 发送回复
  const handleSendReply = async () => {
    if (!selectedConversation || !replyText.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/admin/chat/messages/${selectedConversation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyText }),
      });

      if (response.ok) {
        setReplyText('');
        await fetchMessages(selectedConversation);
        toast.success('回复已发送');
      } else {
        toast.error('发送失败');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('发送失败');
    } finally {
      setIsSending(false);
    }
  };

  // 选择对话
  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id);
    fetchMessages(id);
  };

  // 初始加载
  useEffect(() => {
    fetchConversations();
    // 每 10 秒刷新一次对话列表
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  // 自动刷新消息
  useEffect(() => {
    if (selectedConversation) {
      const interval = setInterval(() => {
        fetchMessages(selectedConversation);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">客服管理后台</h1>
          <p className="text-gray-600 mt-2">查看和回复用户消息</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
          {/* 对话列表 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
              <h2 className="font-semibold">对话列表</h2>
              <button
                onClick={fetchConversations}
                className="text-white/80 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">加载中...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">暂无对话</div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conv.id ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">
                          {conv.meta?.sender?.name || '访客'}
                        </div>
                        {conv.meta?.sender?.email && (
                          <div className="text-sm text-gray-500">{conv.meta.sender.email}</div>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        conv.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {conv.status === 'open' ? '进行中' : '已关闭'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(conv.created_at).toLocaleString('zh-CN')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 消息区域 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-900">对话 #{selectedConversation}</h3>
                </div>

                {/* 消息列表 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500">暂无消息</div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.message_type === 0 ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[70%] ${
                          msg.message_type === 0
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-purple-600 text-white'
                        } rounded-lg p-3`}>
                          {msg.sender && (
                            <div className="text-xs opacity-75 mb-1">
                              {msg.sender.name}
                            </div>
                          )}
                          <div>{msg.content}</div>
                          <div className="text-xs opacity-75 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString('zh-CN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 回复框 */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendReply()}
                      placeholder="输入回复..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={isSending}
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={isSending || !replyText.trim()}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSending ? '发送中...' : '发送'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p>选择一个对话开始回复</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
