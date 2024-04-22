const CVPreview = () => {
    return (
        <>
            <div className="container">
                <p className="text-center mt-5 font-light italic text-sm text-gray-400">Preview your Resume here</p>
                <div
                    className="flex justify-center items-center mt-5 rounded-lg overflow-auto shadow-lg"
                    style={{
                        height: '560px', // Set a fixed height for the container
                        width: '100%', // Use the full width of the container
                    }}
                >
                    {/* Image as direct content of the div, which is scrollable */}
                    <img
                        src="https://standout-cv.com/wp-content/uploads/2023/10/Lettings-Administrator-CV-1.png"
                        alt="Resume Preview"
                        style={{
                            width: 'auto', // Maintain original image width
                            maxHeight: 'none', // Allow the image height to determine the scroll
                        }}
                    />
                </div>
            </div>
        </>
    );
}

export default CVPreview;
