import React,{forwardRef,useId} from 'react'

function Input({
    label,
    error,
    className="",
    type="text",
    ...props
},ref) {
    const id = useId();
    return (
         <div className='w-full'>
            {label && <label
             className="inline-block mb-1 pl-1" 
             htmlFor={id}>{label}</label>}

            <input
             type={type}
             className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-[#6C48E3] ${className}`}
             ref={ref}
             {...props}
             id={id}
             />
            </div>
    )
}

export default forwardRef(Input)
