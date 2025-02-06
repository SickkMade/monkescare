import allWords from '../json/enlish.json'
import Word from './Word'
import Cursor from './Cursor';
import { useEffect, useState, useRef } from 'react'

const MAXOVERFLOW = 10;
function MainText() {
    const currentLocation = useRef({x:0,y:0});
    const words = useRef([])
    const wordIndex = useRef(0)
    const letterIndex = useRef(0)
    const [correctList, setCorrectList] = useState([]);

    const CreateAndSetNewWordList = () => {
        let arr = []
        let correctArr = []
        for(let i = 0; i < 250; i++){
            let word = allWords[Math.floor(Math.random()*allWords.length)]
            arr.push(word.split("")) //push random word 250 times
            correctArr.push(Array(word.length).fill(0))
        }
        setCorrectList(correctArr)
        words.current = arr
    }

    
    useEffect(()=>{
        const HandleKeyDown = (e) => {
            if(correctList === null || correctList.length == 0){
                console.error("correct list is unset")
                return
            }
            let arr = [...correctList]
            let currentWord = arr[wordIndex.current]
            let overflow = words.current[wordIndex.current].length - currentWord.length
            if(e.key === 'Backspace'){
                if(currentWord.length < words.current[wordIndex.current].length){
                    words.current[wordIndex.current].pop()
                }
                else if(letterIndex.current > 0){
                    arr[wordIndex.current][letterIndex.current-1] = 0;
                    letterIndex.current -= 1;
                }
            }
            else if(e.key === ' ' && letterIndex.current == currentWord.length){
                wordIndex.current += 1;
                letterIndex.current = 0;
            }
            else if(!/^[a-zA-Z]$/.test(e.key)){
                null
            }
            else if(letterIndex.current >= currentWord.length){
                if(overflow < MAXOVERFLOW){
                    words.current[wordIndex.current].push(e.key)
                }
            }
            else if(letterIndex.current <= currentWord.length && e.key === words.current[wordIndex.current][letterIndex.current]){
                arr[wordIndex.current][letterIndex.current] = 1;
                letterIndex.current += 1
            }
            else if(letterIndex.current <= currentWord.length){
                arr[wordIndex.current][letterIndex.current] = 2;
                letterIndex.current += 1
            }
            setCorrectList(arr)
        }

        let span = document.querySelector(`#id${wordIndex.current}-${letterIndex.current}`)
        if(span){
            let rect = span.getBoundingClientRect()
            currentLocation.current = {x:rect.x+'px', y:rect.y+'px'}
        }

        document.addEventListener('keydown', HandleKeyDown)
        return () => document.removeEventListener('keydown', HandleKeyDown)
    },[correctList])
    useEffect(()=>{
        CreateAndSetNewWordList();
    }, [])


  return (
    <>
    <Cursor currentLocation={currentLocation.current}/>
    <section id="main">
        {words.current.map((value, i)=>(
            <Word word={value} letterCorrectArr={correctList[i]} wordIndex={i} key={"word-"+i}/>
        ))}
    </section>
    </>
  )
}

export default MainText