import { FaWrench } from "react-icons/fa";
import { FaMountain } from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaFont } from "react-icons/fa";
import { FaHashtag } from "react-icons/fa";
import { FaAt } from "react-icons/fa";

function Toolbar() {
  return (
    <section id="toolbar">
    <div className="app--hoverable"><FaAt />punctuation</div>
    <div className="app--hoverable"><FaHashtag/>numbers</div>
    <div className="app--hoverable toolbar--line-left"><FaClock/>time</div>
    <div className="app--hoverable"><FaFont/>words</div>
    <div className="app--hoverable"><FaQuoteLeft/>quote</div>
    <div className="app--hoverable"><FaMountain/>zen</div>
    <div className="app--hoverable"><FaWrench/>custom</div>
    <div className="app--hoverable toolbar--line-left">change</div>
    </section>
  )
}

export default Toolbar