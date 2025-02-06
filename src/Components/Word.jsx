import PropTypes from 'prop-types';
import { useCallback } from 'react';

function Word({word, letterCorrectArr, wordIndex}) {
    const SetClass = useCallback((value) => {
        if(value===undefined){
            return 'overflow'
        }
        if(value === 0){
            return ''
        }
        else if(value === 1){
            return 'typed'
        }
        else if (value ===2){
            return 'incorrect'
        } else{
            console.error("Error, lettercorrectarr passed through an invalid value, 0-2 please")
        }
    }, [])
  return (
    <span className="maintext--word">
    {word.map((char, i)=>(
        <span className={`word--char ${SetClass(letterCorrectArr[i])}`} id={`id${wordIndex}-${i}`} key={'word-'+wordIndex+'char-'+i}>{char}</span>
    ))}
    </span>
  )
}

Word.propTypes = {
    word: PropTypes.array,
    letterCorrectArr: PropTypes.array,
    wordIndex: PropTypes.number,
}

export default Word