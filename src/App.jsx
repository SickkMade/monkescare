import RestartButton from './Components/RestartButton'
import Toolbar from './Components/Toolbar'
import Language from './Components/Language'
import MainText from './Components/MainText'
import Logo from './Components/Logo'

function App() {
  return (
    <>
    <Logo />
    <section id="center">
      <Toolbar />
      <Language />
      <MainText/>
      <RestartButton />
    </section>
    </>
  )
}

export default App