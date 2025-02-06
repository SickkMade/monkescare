import RestartButton from './Components/RestartButton'
import Toolbar from './Components/Toolbar'
import Language from './Components/Language'
import MainText from './Components/MainText'

function App() {
  return (
    <>
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