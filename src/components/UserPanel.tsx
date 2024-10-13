import React from 'react'

function UserPanel() {
    return (
        <div className='bg-primary-200 p-3 text-secondary-100 font-semibold flex flex-col gap-4'>
            <div>
                <div>
                    Roles
                </div>
                <div className='mt-2 flex flex-col gap-2'>
                    <div className='flex items-center justify-between hover:bg-secondary-300 p-1 pl-2 hover:cursor-pointer rounded-xl'>
                        <div className='bg-white w-[2.5rem] h-[2.5rem] rounded-full'>

                        </div>
                        <h1 className='w-full text-center'>Usename</h1>
                    </div>
                    <div className='flex items-center justify-between hover:bg-secondary-300 p-1 pl-2 hover:cursor-pointer rounded-xl'>
                        <div className='bg-white w-[2.5rem] h-[2.5rem] rounded-full'>

                        </div>
                        <h1 className='w-full text-center'>Usename2</h1>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    Another Role
                </div>
                <div className='mt-2 flex flex-col gap-2'>
                    <div className='flex items-center justify-between hover:bg-secondary-300 p-1 pl-2 hover:cursor-pointer rounded-xl'>
                        <div className='bg-white w-[2.5rem] h-[2.5rem] rounded-full'>

                        </div>
                        <h1 className='w-full text-center'>Usename</h1>
                    </div>
                    <div className='flex items-center justify-between hover:bg-secondary-300 p-1 pl-2 hover:cursor-pointer rounded-xl'>
                        <div className='bg-white w-[2.5rem] h-[2.5rem] rounded-full'>

                        </div>
                        <h1 className='w-full text-center'>Usename2</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPanel