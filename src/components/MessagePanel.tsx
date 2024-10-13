import React from 'react'
import AddIcon from '@mui/icons-material/Add';

function MessagePanel() {
    return (
        <div className='bg-primary-100 text-secondary-100 flex flex-col justify-between'>
            <div className='h-full'>
                <div className='hover:bg-secondary-300 '>
                    <div className='flex gap-3 mt-6 p-3'>
                        <div className='bg-white w-[3rem] h-[3rem] rounded-full'>

                        </div>
                        <div className='w-full'>
                            <h2>Username</h2>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus officia error expedita ratione perferendis ipsam labore repudiandae ipsum debitis, hic maiores, aliquid autem recusandae explicabo repellendus.</p>
                        </div>
                    </div>
                </div>
                <div className='hover:bg-secondary-300 '>
                    <div className='flex gap-3 mt-6 p-3'>
                        <div className='bg-white w-[3rem] h-[3rem] rounded-full'>

                        </div>
                        <div className='w-full'>
                            <h2>Username</h2>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni, nihil!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='p-3'>
                <div className='bg-primary-200 rounded-xl p-1 gap-2 flex items-center overflow-y-auto max-h-[50vh] '>
                    <div className='ml-2 sticky top-0 h-full'>
                        <AddIcon />
                    </div>
                    <div
                        contentEditable="true"
                        role="textbox"
                        aria-multiline="true"
                        className="w-full bg-primary-200 text-secondary-100 text-lg p-3 outline-none "
                        style={{
                            minHeight: '44px',
                            overflowWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                        placeholder="Write a message"
                    ></div>
                    {/* <input type="text" placeholder='write a message' className="w-full h-full bg-primary-200 text-secondary-100 text-lg p-3 outline-none" /> */}
                </div>
            </div>
        </div>
    )
}

export default MessagePanel