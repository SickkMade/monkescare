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
    const [isShowTime, setIsShowTime] = useState(false);

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
            const span = document.querySelector(`#id${wordIndex.current}-${letterIndex.current + overflow}`) || document.querySelector(`#id${wordIndex.current}-${letterIndex.current + overflow - 2}`);
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

            if(wordIndex.current > 15){
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
                    await videoRef.current.requestFullscreen();
                } else if (videoRef.current.webkitRequestFullscreen) {
                    await videoRef.current.webkitRequestFullscreen();
                } else if (videoRef.current.msRequestFullscreen) {
                    await videoRef.current.msRequestFullscreen();
                }
    
                await videoRef.current.play();
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
            <section id="main" ref={textContainerRef}>
                {words.current.map((value, i) => (
                    <Word word={value} letterCorrectArr={correctList.current[i]} wordIndex={i} key={"word-" + i} />
                ))}
            </section>
            <div className={isShowTime ? 'showtime' : ''}>
                <video
                    ref={videoRef}
                    id="app--video"
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