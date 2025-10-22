import { SectionList } from './SectionList';
import type { ChatSection } from './SectionList';

export function ChatSectionsExample() {
  // Dados mockados para seções de chat
  const chatSections: ChatSection[] = [
    {
      id: '1',
      title: 'Projeto WebSocket',
      icon: '💬',
      date: new Date(2023, 9, 22) // Hoje
    },
    {
      id: '2',
      title: 'Reunião de equipe',
      icon: '👥',
      date: new Date(2023, 9, 22) // Hoje
    },
    {
      id: '3',
      title: 'Discussão técnica',
      icon: '💻',
      date: new Date(2023, 9, 21) // Ontem
    },
    {
      id: '4',
      title: 'Planejamento',
      icon: '📅',
      date: new Date(2023, 9, 21) // Ontem
    },
    {
      id: '5',
      title: 'Feedback do cliente',
      icon: '✅',
      date: new Date(2023, 9, 20) // Antes de ontem
    }
  ];

  const handleSectionSelect = (sectionId: string) => {
    console.log(`Seção selecionada: ${sectionId}`);
    // Aqui você poderia navegar para a seção específica
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <SectionList 
        sections={chatSections} 
        onSectionSelect={handleSectionSelect} 
      />
    </div>
  );
}