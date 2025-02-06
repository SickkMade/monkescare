import RestartButton from './Components/RestartButton'
import Toolbar from './Components/Toolbar'
import Language from './Components/Language'
import MainText from './Components/MainText'

function App() {
  return (
    <>
    <header>header</header>
    <section id="center">
      <Toolbar />
      <Language />
      <MainText/>
      <RestartButton />
    </section>
    <footer>footer</footer>
    </>
  )
}

export default App