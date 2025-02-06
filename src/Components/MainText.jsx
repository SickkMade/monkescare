import allWords from '../json/enlish.json'
import Word from './Word'
import Cursor from './Cursor';
import { useEffect, useState, useRef } from 'react'

const MAXOVERFLOW = 10;
function MainText() {
    const currentLocation = useRef({ x: -10000, y: 0 });
    const words = useRef([])
    const wordIndex = useRef(0)
    const letterIndex = useRef(0)
    const correctList = useRef([])
    const [cursorIndex, setCursorIndex] = useState(0)

    const CreateAndSetNewWordList = () => {
        words.current = []
        correctList.current = []
        for (let i = 0; i < 250; i++) {
            let word = allWords[Math.floor(Math.random() * allWords.length)]
            words.current.push(word.split("")) //push random word 250 times
            correctList.current.push(Array(word.length).fill(0))
        }
        setCursorIndex(prevValue => prevValue +1); //force reflow is craaaaaaazy
    }


    useEffect(() => {
        const HandleKeyDown = (e) => {
            if (!correctList.current?.length) {
                console.error("Correct list is unset");
                return;
            }
            setCursorIndex(prevValue => prevValue +1); //force reflow is craaaaaaazy

            const wordIdx = wordIndex.current;
            const currentWord = correctList.current[wordIdx];
            const displayedWord = words.current[wordIdx];
            const overflow = displayedWord.length - currentWord.length;

            if (e.key === 'Backspace') {
                if (overflow > 0) displayedWord.pop();
                else if (letterIndex.current > 0) currentWord[--letterIndex.current] = 0;
                return
            }

            if (e.key === ' ' && letterIndex.current === currentWord.length) {
                wordIndex.current++;
                letterIndex.current = 0;
                return;
            }

            if (!/^[a-zA-Z]$/.test(e.key)) return;

            if (letterIndex.current >= currentWord.length) {
                if (overflow < MAXOVERFLOW) displayedWord.push(e.key);
                return;
            }

            currentWord[letterIndex.current] = e.key === displayedWord[letterIndex.current] ? 1 : 2;
            letterIndex.current++;
        };

        let span = document.querySelector(`#id${wordIndex.current}-${letterIndex.current}`)
        if (span) {
            let rect = span.getBoundingClientRect()
            if (letterIndex.current >= correctList.current[wordIndex.current].count) {
                currentLocation.current = { x: rect.right + 'px', y: rect.y + 'px' }
            } else {
                currentLocation.current = { x: rect.left + 'px', y: rect.y + 'px' }
            }
        }
        document.addEventListener('keydown', HandleKeyDown)
        return () => document.removeEventListener('keydown', HandleKeyDown)
    }, [cursorIndex])
    useEffect(() => {
        CreateAndSetNewWordList();
    }, [])


    return (
        <>
            <Cursor currentLocation={currentLocation.current} />
            <section id="main">
                {words.current.map((value, i) => (
                    <Word word={value} letterCorrectArr={correctList.current[i]} wordIndex={i} key={"word-" + i} />
                ))}
            </section>
        </>
    )
}

export default MainText