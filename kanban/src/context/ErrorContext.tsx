import {useState, createContext, ReactNode, memo} from 'react'


type ErrorContextType = {
    errorC: string | null,
    setErrorC : (error: string | null) => void
}

export const ErrorContext = createContext<ErrorContextType>({
    errorC: null,
    setErrorC: () => {}
})

type errorContextProviderProps = {
    children: ReactNode;
}

export const ErrorComponent = memo(({errorC}: {errorC: string | null}) => {

    return (
        errorC !== null && errorC !== '' ? (<div className='flex items-center justify-center backdrop-blur-sm bg-primary-bg2 rounded-2xl text-white drop-shadow-xl p-5 absolute top-3 right-3'>
            <span>{errorC}</span>
        </div>) : null
    )
})

function ErrorContextProvider({children} : errorContextProviderProps) {
    const [errorC, setErrorC] = useState<string | null >(null);


    const setErrorState = (newError: string | null) =>  {
        setErrorC(newError)
        if(newError){
            setTimeout(()=> setErrorC(null), 2000)
        }
    }

  return (
    <ErrorContext.Provider value={{errorC, setErrorC: setErrorState}}>
        {children}
    </ErrorContext.Provider>
  )
}

export default ErrorContextProvider