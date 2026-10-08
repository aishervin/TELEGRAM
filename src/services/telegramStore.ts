import { useState, useEffect, useCallback } from 'react';
import { 
  Chat, 
  CurrentUser, 
  FolderCategory, 
  Message, 
  MessageReaction, 
  ThemeType, 
  CallState, 
  Sticker 
} from '../types/telegram';
import { CURRENT_USER, INITIAL_CHATS, INITIAL_MESSAGES } from '../data/mockData';
import { soundEngine } from './audioSimulator';

const STORAGE_KEY_CHATS = 'teleshen_chats_v3';
const STORAGE_KEY_MSGS = 'teleshen_msgs_v3';
const STORAGE_KEY_THEME = 'teleshen_theme_v3';
const STORAGE_KEY_USER = 'teleshen_user_v3';

export function useTelegramStore() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CHATS);
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MSGS);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeChatId, setActiveChatId] = useState<string>('teleshen-channel');
  const [activeFolder, setActiveFolder] = useState<FolderCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeType;
    return saved || 'default';
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const [replyMessage, setReplyMessage] = useState<Message | null>(null);

  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    chat: null,
    status: 'calling',
    duration: 0,
    isMuted: false,
    isVideoEnabled: false,
    isSpeakerOn: true,
  });

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  // Call timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState.isActive && callState.status === 'connected') {
      timer = setInterval(() => {
        setCallState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState.isActive, callState.status]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const activeMessages = (messages[activeChatId] || []);

  const selectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
    setReplyMessage(null);
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
  }, []);

  const sendMessage = useCallback((content: string, type: Message['type'] = 'text', extra?: Partial<Message>) => {
    if (!content.trim() && type === 'text') return;

    const newMsg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
      isOutgoing: true,
      type,
      replyTo: replyMessage ? {
        id: replyMessage.id,
        senderName: replyMessage.senderName,
        text: replyMessage.content.slice(0, 50) + (replyMessage.content.length > 50 ? '...' : ''),
      } : undefined,
      ...extra,
    };

    soundEngine.playSent();

    setMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    setReplyMessage(null);

    // Bot automated reply simulation if chatting with TELESHEN Bot
    if (activeChatId === 'teleshen-bot') {
      setTimeout(() => {
        let botResponse = '⚡ Command received. All systems operational.';
        const trimmed = content.trim().toLowerCase();

        if (trimmed.startsWith('/status')) {
          botResponse = '🟢 **TELESHΞN™ Edge Core**: ONLINE\n• Engine: React 19 + TypeScript + Vite\n• Sync Repo: aishervin/teleshen\n• Edge Latency: 12ms (Cloudflare London/Frankfurt POP)\n• Protocol: MTProto Encrypted WebSocket Bridge';
        } else if (trimmed.startsWith('/deploy')) {
          botResponse = '🚀 **Deployment Status**:\n• Commit: 2026-10-07 refactor build\n• Target: GitHub `aishervin/teleshen`\n• Cloudflare Pages: Ready for automatic continuous deployment.';
        } else if (trimmed.startsWith('/help')) {
          botResponse = '📋 **TELESHΞN™ Available Commands**:\n• `/status` - Check client and edge network health\n• `/deploy` - Inspect Cloudflare & GitHub deployment\n• `/theme` - View theme details\n• `/clear` - Reset local mock cache';
        } else if (trimmed.startsWith('/theme')) {
          botResponse = '🎨 **Theme Selector**:\nTELESHΞN™ supports 5 themes: Classic Dark, Midnight OLED, Emerald Green, Cyber Violet, and Clean Light. Change them in Settings!';
        } else {
          botResponse = `🤖 Received: "${content}". I am the TELESHΞN™ automation bot. Type \`/help\` to inspect available edge operations.`;
        }

        const botMsg: Message = {
          id: `msg_bot_${Date.now()}`,
          chatId: 'teleshen-bot',
          senderId: 'teleshen_bot',
          senderName: 'TELESHΞN™ Assistant Bot',
          content: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
          isOutgoing: false,
          type: 'text',
        };

        setMessages(prev => ({
          ...prev,
          'teleshen-bot': [...(prev['teleshen-bot'] || []), botMsg],
        }));
        soundEngine.playReceive();
      }, 700);
    }
  }, [activeChatId, currentUser, replyMessage]);

  const sendVoiceNote = useCallback((durationSeconds: number, waveform: number[]) => {
    sendMessage('Voice message', 'voice', {
      duration: durationSeconds,
      waveform: waveform.length ? waveform : [30, 45, 60, 80, 50, 70, 90, 65, 40, 85, 95, 60, 45, 75, 55, 30, 65, 45, 30, 50],
    });
  }, [sendMessage]);

  const sendSticker = useCallback((sticker: Sticker) => {
    sendMessage(sticker.emoji, 'sticker', {
      mediaUrl: sticker.url,
      mediaName: sticker.packName,
    });
    setIsStickerPickerOpen(false);
  }, [sendMessage]);

  const toggleReaction = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map(msg => {
        if (msg.id !== messageId) return msg;

        const currentReactions: MessageReaction[] = msg.reactions || [];
        const existing = currentReactions.find(r => r.emoji === emoji);

        let nextReactions: MessageReaction[];
        if (existing) {
          if (existing.hasReacted) {
            nextReactions = currentReactions
              .map(r => r.emoji === emoji ? { ...r, count: r.count - 1, hasReacted: false } : r)
              .filter(r => r.count > 0);
          } else {
            nextReactions = currentReactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, hasReacted: true } : r);
          }
        } else {
          nextReactions = [...currentReactions, { emoji, count: 1, hasReacted: true }];
        }

        return { ...msg, reactions: nextReactions };
      });

      return { ...prev, [activeChatId]: updated };
    });
  }, [activeChatId]);

  const pinMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map(m => ({
        ...m,
        isPinned: m.id === message.id,
      }));
      return { ...prev, [activeChatId]: updated };
    });

    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, pinnedMessage: message } : c));
  }, [activeChatId]);

  const unpinMessage = useCallback(() => {
    setMessages(prev => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map(m => ({ ...m, isPinned: false }));
      return { ...prev, [activeChatId]: updated };
    });
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, pinnedMessage: undefined } : c));
  }, [activeChatId]);

  const deleteMessage = useCallback((messageId: string) => {
    setMessages(prev => {
      const chatMsgs = prev[activeChatId] || [];
      return { ...prev, [activeChatId]: chatMsgs.filter(m => m.id !== messageId) };
    });
  }, [activeChatId]);

  const toggleMute = useCallback((chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, isMuted: !c.isMuted } : c));
  }, []);

  const togglePinChat = useCallback((chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, isPinned: !c.isPinned } : c));
  }, []);

  const startCall = useCallback((chat: Chat) => {
    setCallState({
      isActive: true,
      chat,
      status: 'calling',
      duration: 0,
      isMuted: false,
      isVideoEnabled: false,
      isSpeakerOn: true,
    });

    // Simulate answer after 2.5s
    setTimeout(() => {
      setCallState(prev => prev.isActive ? { ...prev, status: 'connected' } : prev);
    }, 2500);
  }, []);

  const endCall = useCallback(() => {
    setCallState(prev => ({ ...prev, status: 'ended' }));
    setTimeout(() => {
      setCallState({
        isActive: false,
        chat: null,
        status: 'calling',
        duration: 0,
        isMuted: false,
        isVideoEnabled: false,
        isSpeakerOn: true,
      });
    }, 500);
  }, []);

  const updateProfile = useCallback((updated: Partial<CurrentUser>) => {
    setCurrentUser(prev => ({ ...prev, ...updated }));
  }, []);

  const createChat = useCallback((newChat: Partial<Chat>) => {
    const id = `chat_${Date.now()}`;
    const chat: Chat = {
      id,
      title: newChat.title || 'New Group',
      avatar: newChat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      type: newChat.type || 'group',
      unreadCount: 0,
      categories: ['all', newChat.type === 'channel' ? 'channels' : 'groups'],
      memberCount: newChat.type === 'channel' ? 1 : 2,
      bio: newChat.bio || 'Created with TELESHΞN™ Web Client',
      ...newChat,
    };
    setChats(prev => [chat, ...prev]);
    setMessages(prev => ({
      ...prev,
      [id]: [
        {
          id: `msg_init_${Date.now()}`,
          chatId: id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          content: `${chat.title} created by ${currentUser.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
          isOutgoing: true,
          type: 'service',
        }
      ]
    }));
    setActiveChatId(id);
    setIsNewChatModalOpen(false);
  }, [currentUser]);

  return {
    currentUser,
    chats,
    activeChat,
    activeChatId,
    activeMessages,
    activeFolder,
    searchQuery,
    theme,
    isDrawerOpen,
    isSettingsOpen,
    isChatInfoOpen,
    isStickerPickerOpen,
    isNewChatModalOpen,
    replyMessage,
    callState,
    setSearchQuery,
    setActiveFolder,
    setTheme,
    setIsDrawerOpen,
    setIsSettingsOpen,
    setIsChatInfoOpen,
    setIsStickerPickerOpen,
    setIsNewChatModalOpen,
    setReplyMessage,
    setCallState,
    selectChat,
    sendMessage,
    sendVoiceNote,
    sendSticker,
    toggleReaction,
    pinMessage,
    unpinMessage,
    deleteMessage,
    toggleMute,
    togglePinChat,
    startCall,
    endCall,
    updateProfile,
    createChat,
  };
}
