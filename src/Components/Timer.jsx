import { useState, useEffect } from "react"
import PropTypes from "prop-types";
function Timer({func}) {
    const [counter, setCounter] = useState(30);
    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        if(counter === 0) func();
      }, [counter]);
  return (
    <span className="app--timer">{counter}</span>
  )
}

Timer.propTypes = {
    func: PropTypes.func,
}

export default Timer