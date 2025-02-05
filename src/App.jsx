import RestartButton from './Components/RestartButton'
import Toolbar from './Components/Toolbar'
import Language from './Components/Language'

function App() {
  return (
    <>
    <header>header</header>
    <section id="center">
      <Toolbar />
      <Language />
      <RestartButton />
    </section>
    <footer>footer</footer>
    </>
  )
}

export default App