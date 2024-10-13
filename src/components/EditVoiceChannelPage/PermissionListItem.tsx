import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

function PermissionListItem({ permission }: { permission: string }) {
  const [selectedOption, setSelectedOption] = React.useState<string>('none')

  return (
    <div>
      <div className='flex items-center text-secondary-100 justify-between'>
        <h1>{permission}</h1>
        <div className="flex border rounded-lg">
          <div>
            <input onClick={
              () => setSelectedOption('no')
            }
              type="radio" id={`${permission + "-no"}`} name={`${permission}-group`} className="hidden peer" />
            <label htmlFor={`${permission + "-no"}`} className="w-8 h-8 flex justify-center items-center rounded-lg cursor-pointer peer-checked:bg-red-600 transition ease-all">
              <CloseIcon className={`${selectedOption == "no" ? "text-secondary-200" : "text-red-600"}`} />
            </label>
          </div>

          <div>
            <input
              onClick={
                () => setSelectedOption('none')
              }
              type="radio" id={`${permission + "-none"}`} name={`${permission}-group`} className="hidden peer" defaultChecked={selectedOption === 'none'} />
            <label htmlFor={`${permission + "-none"}`} className="w-8 h-8 flex justify-center items-center rounded-lg cursor-pointe peer-checked:bg-gray-700 transition ease-all">
              <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3L8 21" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </label>
          </div>

          <div>
            <input
              onClick={
                () => setSelectedOption('yes')
              }
              type="radio" id={`${permission + "-yes"}`} name={`${permission}-group`} className="hidden peer" />
            <label htmlFor={`${permission + "-yes"}`} className="w-8 h-8 flex justify-center items-center rounded-lg cursor-pointer peer-checked:bg-green-600 transition ease-all">
              <DoneIcon className={`${selectedOption == "yes" ? "text-secondary-200" : "text-green-600"}`} />
            </label>
          </div>
        </div>
      </div>
      <div>
        <span className='text-secondary-200'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, tenetur magnam in ea, eum corrupti iste, quae assumenda laborum modi similique enim beatae minus nesciunt!
        </span>
      </div>
    </div>
  )
}

export default PermissionListItem