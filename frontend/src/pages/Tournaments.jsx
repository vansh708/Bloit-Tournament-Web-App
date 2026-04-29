import { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, Button, Input, Chip, Spinner } from '@nextui-org/react';
import { Search, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tournaments?game=${search}`);
      setTournaments(res.data.tournaments);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTournaments();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleJoin = async (id) => {
    try {
      await api.post(`/tournaments/${id}/join`);
      alert("Joined successfully!");
      fetchTournaments();
    } catch (err) {
      alert(err.response?.data?.message || 'Error joining');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500">Live Tournaments</h1>
          <p className="text-gray-400 mt-2">Find and join the best tournaments</p>
        </div>
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[20rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Search by game..."
          size="sm"
          startContent={<Search size={18} />}
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" color="secondary"/></div>
      ) : tournaments.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No tournaments found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <Card key={t._id} className="bg-slate-900 border border-white/5 hover:border-pink-500/50 transition-colors">
              <CardBody className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold truncate pr-3">{t.title}</h3>
                  <Chip color={t.status === 'Upcoming' ? 'secondary' : 'default'} variant="flat">{t.status}</Chip>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <p><span className="text-gray-500">Game:</span> <span className="text-white">{t.game}</span></p>
                  <p><span className="text-gray-500">Date:</span> <span className="text-white">{new Date(t.date).toLocaleDateString()}</span></p>
                  <p><span className="text-gray-500">Organizer:</span> <span className="text-white">{t.organizer?.name}</span></p>
                  <p><span className="text-gray-500">Bracket:</span> <span className="text-white">{t.bracketType}</span></p>
                  <div className="w-full bg-slate-800 rounded-full h-2 mt-4">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-indigo-500 h-2 rounded-full" 
                      style={{ width: `${(t.participants.length / t.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1">{t.participants.length} / {t.maxParticipants} Joined</p>
                </div>
              </CardBody>
              <CardFooter className="pt-0 pb-6 px-4 flex gap-2">
                {user?.role === 'Player' && (
                  <Button 
                    className="flex-1 font-semibold" 
                    color="secondary" 
                    variant={t.participants.includes(user.id) ? "flat" : "shadow"}
                    isDisabled={t.participants.includes(user.id) || t.participants.length >= t.maxParticipants}
                    onClick={() => handleJoin(t._id)}
                  >
                    {t.participants.includes(user.id) ? 'Already Joined' : 'Join Tournament'}
                  </Button>
                )}
                {user?.role === 'Organizer' && (
                  <Button className="flex-1" color="default" variant="flat" isDisabled>
                    Organizer View
                  </Button>
                )}
                {(t.participants.includes(user?.id) || t.organizer?._id === user?.id || t.organizer === user?.id) && (
                  <Button 
                    isIconOnly 
                    color="secondary" 
                    variant="shadow" 
                    onClick={() => navigate(`/tournaments/${t._id}/chat`)}
                  >
                    <MessageSquare size={18} />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tournaments;
