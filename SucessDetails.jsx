// SucessDetails.jsx

import React from "react";

export default function SuccessDetails(props) {
  const { rollTimes, toggleShowDetails, newTime,bestTime } = props;

  return (
    <div className="details">
      <p onClick={toggleShowDetails} className="back">
        Go back
      </p>
      <h1>You rolled {rollTimes} times😉 </h1>
      <h1>
        It took you {newTime} to win
      </h1>
      <p>
        Best Time: {bestTime && bestTime}
      </p>
    </div>
  );
}
