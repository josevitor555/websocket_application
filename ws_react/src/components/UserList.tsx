import { Users, Circle, User } from 'lucide-react';
import { motion, easeOut } from 'framer-motion';
import type { ChatUser } from '../../types/chat';

interface UserListProps {
  users: ChatUser[];
  currentUserId: string;
  typingUser?: string; // Adicionando a propriedade para o usuário que está digitando
}

export function UserList({ users, currentUserId, typingUser }: UserListProps) {
  // Separar o usuário atual dos demais usuários online
  const currentUser = users.find(u => u.id === currentUserId);
  const otherOnlineUsers = users.filter(u => u.is_online && u.id !== currentUserId);
  
  // Contar todos os usuários online (incluindo o usuário atual)
  const totalOnlineUsers = users.filter(u => u.is_online).length;
  
  // Verificar se o usuário que está digitando é um usuário real (presente na lista de usuários)
  const isTypingUserReal = typingUser && users.some(u => 
    u.display_name === typingUser || 
    u.username === typingUser ||
    `User_${u.id.substring(0, 8)}` === typingUser
  );

  // Animation variants for slide-in from left effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2 // Increased stagger for more subtle effect
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -30 // Start position from the left
    },
    visible: {
      opacity: 1,
      x: 0, // End position at original location
      transition: {
        duration: 0.8, // Slower animation for subtle effect
        ease: easeOut
      }
    }
  };

  return (
    <motion.div 
      className="bg-transparent rounded-2xl p-6 border border-[#2A2A2A] h-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-background" />
          <h2 className="text-lg font-semibold text-[#E0E0E0]">
            Online ({totalOnlineUsers})
          </h2>
        </div>
        
        {/* Indicador de usuário digitando no canto superior direito - apenas para usuários reais */}
        {typingUser && typingUser !== currentUser?.display_name && isTypingUserReal && (
          <motion.div 
            className="text-xs text-[#A0A0A0] italic whitespace-nowrap overflow-hidden"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="truncate">{typingUser} está digitando...</span>
          </motion.div>
        )}
      </div>

      <div className="space-y-3">
        {totalOnlineUsers === 0 ? (
          <motion.p 
            className="text-[#A0A0A0] text-sm text-center py-8"
            variants={itemVariants}
          >
            Nenhum usuário online no momento
          </motion.p>
        ) : (
          <>
            {/* Exibir o usuário atual primeiro, se estiver online */}
            {currentUser && currentUser.is_online && (
              <motion.div 
                className="flex items-center gap-3 p-3 rounded-xl bg-white/10"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ 
                  delay: 0,
                  duration: 0.8,
                  ease: easeOut
                }}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                    <User className="w-5 h-5 text-[#121212]" />
                  </div>
                  <Circle className="w-3 h-3 text-[#22C55E] fill-[#22C55E] absolute bottom-0 right-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#E0E0E0] font-medium text-base truncate">
                    {currentUser.display_name} (Você)
                  </p>
                  <p className="text-[#A0A0A0] text-xs truncate">
                    @{currentUser.username}
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Exibir os demais usuários online */}
            {otherOnlineUsers.map((user, index) => (
              <motion.div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#121212] border border-[#2A2A2A]"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ 
                  delay: (currentUser && currentUser.is_online ? 1 : 0) + index * 0.1,
                  duration: 0.8,
                  ease: easeOut
                }}
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
              </motion.div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}