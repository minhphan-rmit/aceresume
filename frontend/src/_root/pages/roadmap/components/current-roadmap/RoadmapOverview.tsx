const RoadmapOverview = ({roadmap}) => {
    return (<>
    <div><h2 className="text-3xl font-bold text-gray-700">
                Roadmap Overview
            </h2>
            <details className="open:row-span-2 text-sm text-gray-600 text-left">
            <summary className="mt-2 text-md text-gray-700 text-left cursor-pointer"> Job Description </summary>

            <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg text-left "> {roadmap.job_description}</p></details>
            <p className="mt-2 text-sm text-grey-600 bg-gray-50 p-3 rounded-lg text-left shadow-sm"> {roadmap.roadmap.summary}</p>

       </div>
    </>)
}
export default RoadmapOverview
