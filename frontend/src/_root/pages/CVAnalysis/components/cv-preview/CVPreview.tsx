import React from 'react';

const CVPreview = ({fileUrl}) => {
    const uploadedFileUrl = fileUrl ? fileUrl : localStorage.getItem('uploadedFileUrl');
    return (
        <>
            <div className="container">
                <p className="text-center mt-5 font-light italic text-sm text-gray-400">Preview your Resume here</p>

                    {/* Image as direct content of the div, which is scrollable */}
                    <iframe
                        src={uploadedFileUrl}
                        title="CV Preview"
                        className='rounded-lg h-[560px] w-full mt-4'

                    />

            </div>
        </>
    );
}

export default CVPreview;
