import { Outlet } from 'react-router-dom'
import { Container } from './components/Container'
function App() {
  return <Container>
    <Outlet />
  </Container>
}

export default App
