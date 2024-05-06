import ScoreBar from "./ScoreBar";
import Strength from "./Strength";
import Suggestion from "./Suggestion";
import Weakness from "./Weakness";

const YourAnalysis = () => {
    const resumeId = localStorage.getItem('resumeId');

    return (
        <>
         <div className="flex flex-col p-10 items-start  w-full text-gray-700 bg-white rounded-lg shadow-lg">
       <ScoreBar score={60} />
  </div>
  <div className="flex flex-col  items-end w-full p-10 text-gray-700 bg-white rounded-lg shadow-lg">
  < h2 className=" text-3xl font-bold text-gray-700">
				 Strength
			</h2>
  </div>
  <div className="flex flex-col p-10 items-end w-full text-gray-700 bg-white rounded-lg shadow-lg">
  < h2 className=" text-3xl font-bold text-gray-700">
				 Weakness
			</h2>
  </div>
  <div className="flex flex-col p-10 items-end w-full text-gray-700 bg-white rounded-lg shadow-lg">
    < h2 className=" text-3xl font-bold text-gray-700">
				 Suggestion
			</h2>
  </div></>
    )
}
export default YourAnalysis;
