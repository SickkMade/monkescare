import allWords from '../json/enlish.json'
import Word from './Word'
import Cursor from './Cursor';
import { useEffect, useState, useRef } from 'react'
import Timer from './Timer';

const MAXOVERFLOW = 10;
function MainText() {
    const currentLocation = useRef({ x: -10000, y: 0 });
    const words = useRef([])
    const isTimer = useRef(false);
    const wordIndex = useRef(0)
    const letterIndex = useRef(0)
    const correctList = useRef([])
    const [cursorIndex, setCursorIndex] = useState(0)
    const [isShowTime, setIsShowTime] = useState(false);

    const lastWordsIndex = useRef([]) // pop and push for inde of prev words
    const textContainerRef = useRef(null);
    const videoRef = useRef(null);

    const CreateAndSetNewWordList = () => {
        words.current = []
        correctList.current = []
        for (let i = 0; i < 250; i++) {
            let word = allWords[Math.floor(Math.random() * allWords.length)]
            words.current.push(word.split("")) //push random word 250 times
            correctList.current.push(Array(word.length).fill(0))
        }
        setCursorIndex(prevValue => prevValue + 1); //force reflow is craaaaaaazy
    }

    const handleCursor = (overflow) => {
        // time out shinanigans
        setTimeout(() => {
            const span = document.querySelector(`#id${wordIndex.current}-${letterIndex.current + overflow}`) || 
            document.querySelector(`#id${wordIndex.current}-${letterIndex.current + overflow - 1}`)||
            document.querySelector(`#id${wordIndex.current}-${letterIndex.current + overflow - 2}`);
            if (span) {
                const rect = span.getBoundingClientRect();
                if (letterIndex.current >= correctList.current[wordIndex.current].length) {
                    currentLocation.current = { x: rect.right + 'px', y: rect.y + 'px' };
                } else {
                    currentLocation.current = { x: rect.left + 'px', y: rect.y + 'px' };
                }
                setCursorIndex(prev => prev + 1);
            }
        }, 0);
    };

    //WHY CALLED TWICE?
    useEffect(() => {
        const HandleKeyDown = (e) => {
            if (!correctList.current?.length) {
                console.error("Correct list is unset");
                return;
            }
            setCursorIndex(prevValue => prevValue + 1); //force reflow is craaaaaaazy

            const wordIdx = wordIndex.current;
            const currentWord = correctList.current[wordIdx];
            const displayedWord = words.current[wordIdx];
            const overflow = words.current[wordIndex.current].length - correctList.current[wordIndex.current].length;
            if (overflow < MAXOVERFLOW) handleCursor(overflow);
            else if (overflow === MAXOVERFLOW && e.key === 'Backspace') handleCursor(overflow);
            //IVE PLAYED THESE GAMES BEFORE

            if (e.key === 'Backspace') {
                if(letterIndex.current === 0 && lastWordsIndex.current.length > 0){
                    wordIndex.current-=1
                    letterIndex.current = lastWordsIndex.current.pop()+1;
                }
                if (overflow > 0) displayedWord.pop();
                else if (letterIndex.current > 0) currentWord[--letterIndex.current] = 0;
                return 
            }

            if (e.key === ' ' && letterIndex.current > 0) {
                if(letterIndex.current < displayedWord.length) lastWordsIndex.current.push(letterIndex.current)
                wordIndex.current++;
                letterIndex.current = 0;
                handleCursor(0)
                return;
            }

            if (!/^[a-zA-Z]$/.test(e.key)) return;

            isTimer.current = true;

            if (letterIndex.current >= currentWord.length) {
                if (overflow < MAXOVERFLOW) displayedWord.push(e.key);
                return;
            }

            currentWord[letterIndex.current] = e.key === displayedWord[letterIndex.current] ? 1 : 2;
            letterIndex.current++;

            if(wordIndex.current > 10){
                setIsShowTime(true);
                playFullscreenVideo();
            }

        };

        document.addEventListener('keydown', HandleKeyDown)
        return () => document.removeEventListener('keydown', HandleKeyDown)
    }, [cursorIndex])
    useEffect(() => {
        CreateAndSetNewWordList();

        const rect = textContainerRef.current.getBoundingClientRect();
        currentLocation.current = { x: rect.left + 'px', y: rect.y + 'px' };

        setCursorIndex(prevValue => prevValue + 1); //force reflow is craaaaaaazy
    }, [])

    const playFullscreenVideo = async () => {
        try {
            if (videoRef.current) {
                if (videoRef.current.requestFullscreen) {
                     videoRef.current.requestFullscreen();
                } else if (videoRef.current.webkitRequestFullscreen) {
                     videoRef.current.webkitRequestFullscreen();
                } else if (videoRef.current.msRequestFullscreen) {
                     videoRef.current.msRequestFullscreen();
                }
    
                 videoRef.current.play();
            }
        } catch (error) {
            console.error('Error playing fullscreen video:', error);
        }
    };
    
    const handleVideoEnd = async () => {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            await document.msExitFullscreen();
        }
        window.location.reload();
    }


    return (
        <>
            <Cursor currentLocation={currentLocation.current} />
            {isTimer.current && <Timer func={playFullscreenVideo}/>}
            <section id="main" ref={textContainerRef}>
                {words.current.map((value, i) => (
                    <Word word={value} letterCorrectArr={correctList.current[i]} wordIndex={i} key={"word-" + i} />
                ))}
            </section>
            <div className={isShowTime ? 'showtime' : ''}>
                <video
                    ref={videoRef}
                    id="app--video"
                    playsInline
                    preload="auto"
                    onEnded={handleVideoEnd}
                >
                    <source src="https://github.com/SickkMade/monkescare/raw/refs/heads/main/public/video1.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </>
    )
}

export default MainText

