// Style css
import './App.css'

// Shadcn components
import { Button } from "@/components/ui/button"

const App = () => {

  return (
    <div className='app flex flex-col justify-center items-center gap-2'>
      <h1 className='hover:underline'> Aplicação Exemplo de Websocket. </h1>
      <Button onClick={() => alert('Hello World!')}> Iniciar Conversa </Button>
    </div>
  )
}

export default App;
