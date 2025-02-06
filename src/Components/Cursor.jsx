import PropTypes from "prop-types"
function Cursor({currentLocation}) {
  return (
    <div style={{'--cursor-x': currentLocation.x, '--cursor-y': currentLocation.y}}id="main--cursor"></div>
  )
}

Cursor.propTypes = {
    currentLocation: PropTypes.object,
}

export default Cursor