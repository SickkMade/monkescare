import allWords from '../json/enlish.json'
import Word from './Word'
import { useEffect, useState } from 'react'

const MAXOVERFLOW = 10;
function MainText() {
    const [words, setWords] = useState([])
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
    const [correctList, setCorrectList] = useState(0);

    const CreateAndSetNewWordList = () => {
        let arr = []
        let correctArr = []
        for(let i = 0; i < 250; i++){
            let word = allWords[Math.floor(Math.random()*allWords.length)]
            arr.push(word.split("")) //push random word 250 times
            correctArr.push(Array.from(word).fill(0))
        }
        setCorrectList(correctArr)
        setWords(arr)
    }
    useEffect(()=>{
        const HandleKeyDown = (e) => {
            
        }
        CreateAndSetNewWordList();
        document.addEventListener('keydown', HandleKeyDown)
        return document.removeEventListener('keydown', HandleKeyDown)
    },[])
  return (
    <section id="main">
        {words.map((value, i)=>(
            <Word word={value} letterCorrectArr={correctList[i]} wordIndex={i} key={"word-"+i}/>
        ))}
    </section>
  )
}

export default MainText