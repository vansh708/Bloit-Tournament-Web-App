import { useState } from 'react';
import { Card, CardBody, Button, Input, Select, SelectItem } from '@nextui-org/react';
import api from '../api';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    title: '', game: '', date: '', maxParticipants: 16, bracketType: 'Single Elimination'
  });
  
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tournaments', formData);
      alert('Tournament created successfully');
      setFormData({ title: '', game: '', date: '', maxParticipants: 16, bracketType: 'Single Elimination' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create tournament');
    }
  };

  if (!user) return <div className="p-10 text-center">Please login to view dashboard.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-900 border border-white/10 md:col-span-1">
          <CardBody className="flex flex-col items-center justify-center py-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-full mb-4 flex items-center justify-center text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-400">{user.role}</p>
            {user.role === 'Player' && <p className="text-sm mt-2 px-3 py-1 bg-slate-800 rounded-full">{user.skillLevel}</p>}
          </CardBody>
        </Card>

        {user.role === 'Organizer' && (
          <Card className="bg-slate-900 border border-white/10 md:col-span-2">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold mb-6">Create New Tournament</h3>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required variant="bordered" />
                  <Input label="Game" value={formData.game} onChange={e => setFormData({...formData, game: e.target.value})} required variant="bordered" />
                  <Input type="date" label="Date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required variant="bordered" />
                  <Input type="number" label="Max Participants" value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: Number(e.target.value)})} required variant="bordered" />
                </div>
                <Select label="Bracket Type" variant="bordered" selectedKeys={[formData.bracketType]} onChange={e => setFormData({...formData, bracketType: e.target.value})}>
                  <SelectItem key="Single Elimination" value="Single Elimination">Single Elimination</SelectItem>
                  <SelectItem key="Double Elimination" value="Double Elimination">Double Elimination</SelectItem>
                  <SelectItem key="Round Robin" value="Round Robin">Round Robin</SelectItem>
                </Select>
                <Button type="submit" color="secondary" variant="shadow">Create Tournament</Button>
              </form>
            </CardBody>
          </Card>
        )}
        
        {user.role === 'Player' && (
          <Card className="bg-slate-900 border border-white/10 md:col-span-2">
            <CardBody className="p-6 flex flex-col justify-center items-center text-center">
              <h3 className="text-xl font-bold mb-2">My Tournaments</h3>
              <p className="text-gray-400 mb-6">You can view live tournaments to join from the Tournaments page.</p>
              <Button as="a" href="/tournaments" color="secondary" variant="shadow">Browse Tournaments</Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
