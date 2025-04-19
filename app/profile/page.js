

export default function Profile() {
    return (
        <div className="flex bg-amber-600 ">
            <div className="bg-gray-100 w-1/3 h-100% rounded-3xl border-red-600 border-2 p-2.5 m-3">
            User profile
            </div>
            <div className="flex flex-col w-1/3 ">
                <div className="bg-gray-100 h-60 rounded-3xl border-red-600 border-2 p-2.5 m-3">
                    Add emergency contact
                </div>
                <div className="bg-gray-100 h-60 rounded-3xl border-red-600 border-2 p-2.5 m-3">
                    current emergency contact
            </div>
            </div>
            <div className="bg-gray-100 w-1/3  rounded-3xl border-red-600 border-2 p-2.5 m-3">
            User profile
            </div>
            
        </div>
        
    )
}