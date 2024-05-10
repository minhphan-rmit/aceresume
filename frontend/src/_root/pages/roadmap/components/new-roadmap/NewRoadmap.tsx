import { useState } from "react";

const NewRoadmap = () => {

     // State to manage dropdown visibility
     const [isOpen, setIsOpen] = useState(false);
     const

     // Toggle dropdown visibility
     const toggleDropdown = () => setIsOpen(!isOpen);
    return (
        <div className="w-full bg-white h-full rounded-lg  flex flex-col items-center p-10">
            <div className=" w-full  bg-white rounded-xl z-10 flex flex-row items-center justify-between gap-10">
		<div className=" ">
			<h2 className="mt-5 text-3xl font-bold text-gray-900">
				 Create your personalized roadmap!
			</h2>
			<p className="mt-2 text-sm text-gray-400 text-left">Don't know what separates you from your dream career? Our AI Roadmap Generator will help you identify gaps in your skillset based on your resume and tell you how to become the ideal candidate for the job you want.</p>

<p className="mt-2 text-sm text-gray-400 text-left">Enter the name of your desired job description and the AI will recommend books and resources that will help you grow into the professional you dream to be. <span className="italic">(Only works in English.)</span></p>
		</div>
        <form className="mt-8 space-y-3 w-full" action="#" method="POST">
                    <div className="grid grid-cols-1 space-y-2 ">
                        <label className="text-sm font-bold text-gray-500 tracking-wide">Title</label>


        <input className=" w-full text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" type="text" placeholder="Name your Roadmap"/>


           </div>
                    <div className="grid grid-cols-1 space-y-2">
                                    <label className="text-sm font-bold text-gray-500 tracking-wide">Job Description</label>
                        <div className="flex items-center justify-center w-full">

                            <textarea className="resize-y rounded-md flex flex-col  border-4 border-dashed w-full h-60 p-10 group text-left"></textarea>


                        </div>
                    </div>

                    <div>
                        <button type="submit" className="my-5 w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">
                        Generate
                    </button>
                    </div>
        </form>
	</div>
</div>
    );
}
export default NewRoadmap;
