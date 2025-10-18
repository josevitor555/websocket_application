import { Users, Circle } from 'lucide-react';
import type { ChatUser } from '../../types/chat';

interface UserListProps {
  users: ChatUser[];
  currentUserId: string;
}

export function UserList({ users, currentUserId }: UserListProps) {
  const onlineUsers = users.filter(u => u.is_online && u.id !== currentUserId);

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A] h-full">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-5 h-5 text-background" />
        <h2 className="text-lg font-semibold text-[#E0E0E0]">
          Online ({onlineUsers.length})
        </h2>
      </div>

      <div className="space-y-3">
        {onlineUsers.length === 0 ? (
          <p className="text-[#A0A0A0] text-sm text-center py-8">
            Nenhum usuário online no momento
          </p>
        ) : (
          onlineUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#121212] border border-[#2A2A2A]"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                  <span className="text-[#E0E0E0] font-semibold text-sm">
                    {user.display_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <Circle className="w-3 h-3 text-[#22C55E] fill-[#22C55E] absolute bottom-0 right-0" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#E0E0E0] font-medium text-sm truncate">
                  {user.display_name}
                </p>
                <p className="text-[#A0A0A0] text-xs truncate">
                  @{user.username}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
