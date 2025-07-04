import { useState, useEffect } from "react";
export default function Error ( { message = "" }: { message: string; } )
{
    const [ errorMsg, setErrorMsg ] = useState( message );
    const timeOut = 5000;
    useEffect( () =>
    {
        if ( message )
        {
            setErrorMsg( message );
            const timer = setTimeout( () => setErrorMsg( "" ), timeOut );
            return () => clearTimeout( timer );
        }
    }, [ message ] );
    return (
        errorMsg ? (
            <div
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
                style={{ zIndex: 1000 }}
            >
                <p>{errorMsg}</p>
                <button
                    className="absolute top-1 right-1 text-white hover:text-gray-200"
                    onClick={() => setErrorMsg("")}
                >
                    &times;
                </button>
            </div>
        ) : null
    );
}
