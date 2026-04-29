import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, ScrollShadow } from '@nextui-org/react';
import { Send, ArrowLeft } from 'lucide-react';
import io from 'socket.io-client';
import api from '../api';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const TournamentChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [tournament, setTournament] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check auth
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch tournament details
    const fetchTournament = async () => {
      try {
        // Just fetching via tournament list or make a separate endpoint.
        const res = await api.get(`/tournaments`);
        const curr = res.data.tournaments.find(t => t._id === id);
        if (curr) {
          setTournament(curr);
          if (!curr.participants.includes(user.id) && curr.organizer._id !== user.id && curr.organizer !== user.id) {
            // Wait, logic is complex here if we only allow joined users. Let's just allow for simplicity or handle error cleanly
            console.warn("User might not be a participant");
          }
        }
      } catch (err) {
        console.error("Failed to load tournament detail");
      }
    };
    fetchTournament();

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${id}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();

    // Setup socket connection
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.emit('join_tournament_chat', id);

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    
    const messageData = {
      tournamentId: id,
      sender: user.id,
      senderName: user.name,
      content: newMessage.trim(),
    };
    
    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-4 flex items-center gap-4">
        <Button isIconOnly variant="light" onClick={() => navigate('/tournaments')}><ArrowLeft /></Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500">
          {tournament ? `${tournament.title} - Live Chat` : 'Tournament Chat'}
        </h1>
      </div>
      
      <Card className="flex-grow flex flex-col bg-slate-900 border border-white/10 overflow-hidden">
        <CardBody className="p-0 overflow-hidden">
          <ScrollShadow className="h-full p-4 flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 my-auto">No messages yet. Start the conversation!</div>
            ) : (
              messages.map((msg, index) => {
                const isMine = msg.sender === user.id || msg.sender?._id === user.id;
                return (
                  <div key={msg._id || index} className={`flex flex-col max-w-[75%] ${isMine ? 'self-end items-end' : 'self-start items-start'}`}>
                    <span className="text-xs text-gray-400 mb-1 px-1">{isMine ? 'You' : (msg.senderName || msg.sender?.name || 'Unknown')}</span>
                    <div className={`px-4 py-2 rounded-2xl ${isMine ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-gray-100 rounded-tl-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </ScrollShadow>
        </CardBody>
        <CardFooter className="bg-slate-950 border-t border-white/10 p-4">
          <form onSubmit={handleSendMessage} className="w-full flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              fullWidth
              variant="bordered"
              classNames={{ inputWrapper: "bg-slate-900 border-white/20" }}
            />
            <Button type="submit" color="secondary" variant="shadow" isIconOnly isDisabled={!newMessage.trim()}>
              <Send size={18} />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TournamentChat;
