'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, AlertCircle, FileText, CheckCheck } from 'lucide-react';
import { sendChatMessage } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  id: number;
  sender: string; // "recruiter" or "candidate"
  recipient: string; // "recruiter" or "candidate"
  message: string;
  createdAt: Date;
}

interface ChatTabProps {
  messages: ChatMessage[];
  currentUser: {
    name: string;
    role: 'candidate' | 'employer';
  };
  activeContactName: string | null;
  onSelectContactName: (name: string | null) => void;
  locale: 'vi' | 'en';
  candidates?: any[];
  partners?: any[];
  jobs?: any[];
}

export default function ChatTab({ 
  messages, 
  currentUser, 
  activeContactName, 
  onSelectContactName, 
  locale,
  candidates = [],
  partners = [],
  jobs = []
}: ChatTabProps) {
  const router = useRouter();
  const [typedMessage, setTypedMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group or determine who the contact list consists of dynamically
  const contacts = React.useMemo(() => {
    if (currentUser.role === 'candidate') {
      return [{ id: 'recruiter', name: 'Lê Minh Tuấn (Recruiter)', role: 'recruiter', lastMsg: locale === 'vi' ? 'Hẹn gặp em vào phỏng vấn nhé' : 'See you at the interview' }];
    }

    // Recruiter view: merge candidates and partner clients
    const candidateContacts = candidates.map(c => {
      const candidateMsgs = messages.filter(m => 
        (m.sender === 'recruiter' && m.recipient === c.name) || 
        (m.sender === c.name && m.recipient === 'recruiter') ||
        (c.name === 'Nguyễn Văn A' && (
          (m.sender === 'recruiter' && m.recipient === 'candidate') ||
          (m.sender === 'candidate' && m.recipient === 'recruiter')
        ))
      );
      const lastMsgText = candidateMsgs.length > 0 
        ? candidateMsgs[candidateMsgs.length - 1].message 
        : (locale === 'vi' ? 'Nhấp để bắt đầu trò chuyện' : 'Click to start chat');

      return {
        id: `candidate_${c.id}`,
        name: c.name,
        role: 'candidate',
        lastMsg: lastMsgText.length > 30 ? lastMsgText.substring(0, 30) + '...' : lastMsgText
      };
    });

    const partnerContacts = partners.map(p => {
      const partnerMsgs = messages.filter(m => 
        (m.sender === 'recruiter' && m.recipient === p.name) || 
        (m.sender === p.name && m.recipient === 'recruiter')
      );
      const lastMsgText = partnerMsgs.length > 0 
        ? partnerMsgs[partnerMsgs.length - 1].message 
        : (locale === 'vi' ? 'Đại diện đối tác cung ứng' : 'Startup client representative');

      return {
        id: `partner_${p.id}`,
        name: p.name,
        role: 'partner',
        lastMsg: lastMsgText.length > 30 ? lastMsgText.substring(0, 30) + '...' : lastMsgText
      };
    });

    const list = [...candidateContacts, ...partnerContacts];

    // Ensure Nguyễn Văn A exists as default fallback contact if candidate list is empty
    if (list.length === 0) {
      list.push({
        id: 'candidate_default',
        name: 'Nguyễn Văn A',
        role: 'candidate',
        lastMsg: locale === 'vi' ? 'Xác nhận lịch phỏng vấn ạ' : 'Interview confirmed'
      });
    }

    return list;
  }, [candidates, partners, messages, currentUser.role, locale]);

  useEffect(() => {
    // Default to select first contact if none active
    if (!activeContactName && contacts.length > 0) {
      onSelectContactName(contacts[0].name);
    }
  }, [activeContactName, contacts, onSelectContactName]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;
    setIsSending(true);

    const result = await sendChatMessage({
      sender: currentUser.role === 'candidate' ? 'candidate' : 'recruiter',
      recipient: currentUser.role === 'candidate' ? 'recruiter' : (activeContactName || 'candidate'),
      message: text,
    });

    if (result.success) {
      setTypedMessage('');
      router.refresh();
    } else {
      alert(locale === 'vi' ? 'Không thể gửi tin nhắn. Vui lòng thử lại!' : 'Failed to send message. Please try again!');
    }
    setIsSending(false);
  };

  const handleTextFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(typedMessage);
  };

  // Instant message templates for recruiter/candidate
  const templates = currentUser.role === 'employer'
    ? (locale === 'vi'
      ? [
          'Chào em, anh thấy hồ sơ rất tốt. Cho anh hẹn phỏng vấn online vào chiều thứ 3 tuần sau lúc 14h nhé?',
          'Chào em, anh gửi lời mời nhận việc (Offer) chính thức qua email. Em check giúp anh nhé!',
          'Cảm ơn em đã tham gia phỏng vấn hôm nay. Team sẽ phản hồi kết quả trong vòng 3 ngày làm việc.',
        ]
      : [
          'Hi, I reviewed your CV and it looks great. Can we schedule an online interview next Tuesday at 2 PM?',
          'Hi, I have sent you the official offer letter via email. Please check and let me know!',
          'Thank you for attending the interview today. We will get back to you with the results within 3 working days.',
        ])
    : (locale === 'vi'
      ? [
          'Dạ em đã nhận được lịch phỏng vấn và xin xác nhận tham gia ạ. Em cảm ơn!',
          'Dạ em đã nhận được thư mời làm việc (Offer) và sẽ phản hồi sớm nhất qua email ạ.',
          'Em cảm ơn anh/chị đã tạo cơ hội cho em được trao đổi phỏng vấn hôm nay ạ.',
        ]
      : [
          'Hi, I received the interview details and confirm my participation. Thank you!',
          'Hi, I received the offer letter and will reply via email as soon as possible.',
          'Thank you for giving me the opportunity to interview with you today.',
        ]);

  // Filter messages for current selected conversation
  const filteredMessages = React.useMemo(() => {
    if (currentUser.role === 'candidate') {
      return messages;
    }

    if (!activeContactName) return [];

    return messages.filter(msg => {
      const isExchanged = 
        (msg.sender === 'recruiter' && msg.recipient === activeContactName) ||
        (msg.sender === activeContactName && msg.recipient === 'recruiter');

      // Fallback for default seed messages
      if (activeContactName === 'Nguyễn Văn A') {
        return isExchanged || 
          (msg.sender === 'recruiter' && msg.recipient === 'candidate') ||
          (msg.sender === 'candidate' && msg.recipient === 'recruiter');
      }

      return isExchanged;
    });
  }, [messages, activeContactName, currentUser.role]);

  return (
    <div className="container">
      <div className="chat-layout">
        {/* Contacts list Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">{locale === 'vi' ? 'Trò chuyện' : 'Conversations'}</div>
          <div className="contact-list">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`contact-item ${activeContactName === contact.name ? 'active' : ''}`}
                onClick={() => onSelectContactName(contact.name)}
              >
                <div className="avatar-circle" style={{ width: '40px', height: '40px' }}>
                  {contact.name.charAt(0)}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-last-msg">{contact.lastMsg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Thread Area */}
        {activeContactName ? (
          <div className="chat-window">
            <div className="chat-window-header">
              <div className="avatar-circle" style={{ width: '38px', height: '38px' }}>
                {activeContactName.charAt(0)}
              </div>
              <div className="chat-header-name">{activeContactName}</div>
            </div>

            {/* Messages Feed */}
            <div className="chat-messages-container" ref={scrollRef}>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => {
                  const isSentByMe =
                    (currentUser.role === 'candidate' && msg.sender === 'candidate') ||
                    (currentUser.role === 'employer' && msg.sender === 'recruiter');

                  return (
                    <div
                      key={msg.id}
                      className={`msg-wrapper ${isSentByMe ? 'sent' : 'received'}`}
                    >
                      <div className="msg-bubble">
                        <div>{msg.message}</div>
                        <div
                          style={{
                            fontSize: '9px',
                            textAlign: 'right',
                            marginTop: '4px',
                            opacity: 0.7,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '2px',
                          }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isSentByMe && <CheckCheck size={10} />}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="chat-empty-state">
                  <MessageSquare size={36} />
                  {locale === 'vi' ? 'Chưa có tin nhắn nào. Hãy bắt đầu cuộc hội thoại!' : 'No messages yet. Start the conversation!'}
                </div>
              )}
            </div>

            {/* Quick Template Messages */}
            <div style={{ background: 'var(--surface)', padding: '10px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>{locale === 'vi' ? 'Mẫu tin nhắn nhanh:' : 'Quick templates:'}</span>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {templates.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    style={{
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '11.5px',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all var(--transition-fast)',
                    }}
                    onClick={() => handleSendMessage(tpl)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {tpl.length > 35 ? tpl.substring(0, 35) + '...' : tpl}
                  </button>
                ))}
              </div>
            </div>

            {/* Message input bar */}
            <form onSubmit={handleTextFormSubmit} className="chat-input-composer">
              <input
                type="text"
                className="chat-input"
                placeholder={locale === 'vi' ? 'Nhập tin nhắn trò chuyện tuyển dụng...' : 'Type a message for recruitment chat...'}
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={!typedMessage.trim() || isSending}
                className="chat-send-btn"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        ) : (
          <div className="chat-window">
            <div className="chat-empty-state">
              <AlertCircle size={40} />
              {locale === 'vi' ? 'Chọn một liên hệ từ danh sách bên trái để bắt đầu trò chuyện.' : 'Select a contact from the sidebar to start chatting.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
