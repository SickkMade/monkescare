import allWords from '../json/enlish.json'
import Word from './Word'
import { useEffect, useState, useRef } from 'react'

const MAXOVERFLOW = 10;
function MainText() {
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
            console.log(letterIndex.current +' '+ correctList[wordIndex.current].length)
            let arr = [...correctList]
            if(e.key === 'Backspace'){
                if(letterIndex.current > 0){
                    arr[wordIndex.current][letterIndex.current-1] = 0;
                    letterIndex.current -= 1;
                }
                
            }
            else if(letterIndex.current > correctList[wordIndex.current].length){
                null;
            }
            else if(e.key === ' ' && letterIndex.current == words.current[wordIndex.current].length){
                wordIndex.current += 1;
                letterIndex.current = 0;
            }
            else if(letterIndex.current >= words.current[wordIndex.current].length && /^[a-zA-Z]$/.test(e.key)){
                words.current[words.current[wordIndex.current].push(e.key)]
            }
            else if(e.key === words.current[wordIndex.current][letterIndex.current]){
                arr[wordIndex.current][letterIndex.current] = 1;
                letterIndex.current += 1
            }
            else{
                arr[wordIndex.current][letterIndex.current] = 2;
                letterIndex.current += 1
            }
            setCorrectList(arr)
        }

        document.addEventListener('keydown', HandleKeyDown)
        return () => document.removeEventListener('keydown', HandleKeyDown)
    },[correctList])
    useEffect(()=>{
        CreateAndSetNewWordList();
    }, [])


  return (
    <section id="main">
        {words.current.map((value, i)=>(
            <Word word={value} letterCorrectArr={correctList[i]} wordIndex={i} key={"word-"+i}/>
        ))}
    </section>
  )
}

export default MainText