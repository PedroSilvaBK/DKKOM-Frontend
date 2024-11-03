import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { Permission } from '../PermissionType';

function PermissionListItem({ permission, allow, deny, setFieldValue }: { permission: Permission, allow: number, deny: number, setFieldValue: any }) {
  const [selectedOption, setSelectedOption] = useState<string>('none')

  const setOption = () => {

    if ((permission.id & allow) === permission.id) {
      setSelectedOption('yes')
      return;
    }

    if ((permission.id & deny) === permission.id) {
      setSelectedOption('no')

      return;
    }

    setSelectedOption('none')
  }


  useEffect(() => {
    setOption()
  }, [allow, deny])


  const handleSelectionChange = (option: string) => {
    setSelectedOption(option)

    if (option === 'yes') {
      setFieldValue('allow', allow | permission.id)
      setFieldValue('deny', deny & ~permission.id)
    } else if (option === 'no') {
      setFieldValue('deny', deny | permission.id)
      setFieldValue('allow', allow & ~permission.id)
    }
    else if (option === 'none') {
      setFieldValue('allow', allow & ~permission.id)
      setFieldValue('deny', deny & ~permission.id)
    }
  }

  return (
    <div>
      <div className='flex items-center text-secondary-100 justify-between'>
        <h1>{permission.name}</h1>
        <div className="flex border rounded-lg">
          <div>
            <input onChange={
              () => handleSelectionChange('no')
            }
              type="radio" id={`${permission.id + "-no"}`} name={`${permission.id}-group`} checked={selectedOption == "no"} className="hidden peer" />
            <label htmlFor={`${permission.id + "-no"}`} className="w-8 h-8 flex justify-center items-center rounded-lg cursor-pointer peer-checked:bg-red-600 transition ease-all">
              <CloseIcon className={`${selectedOption == "no" ? "text-secondary-200" : "text-red-600"}`} />
            </label>
          </div>

          <div>
            <input
              onChange={
                () => handleSelectionChange('none')
              }
              type="radio" id={`${permission.id + "-none"}`} name={`${permission.id}-group`} className="hidden peer" checked={selectedOption === 'none'} />
            <label htmlFor={`${permission.id + "-none"}`} className="w-8 h-8 flex justify-center items-center rounded-lg cursor-pointer peer-checked:bg-gray-700 transition ease-all">
              <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3L8 21" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
              </svg>
            </label>
          </div>

          <div>
            <input
              onChange={
                () => handleSelectionChange('yes')
              }
              type="radio" id={`${permission.id + "-yes"}`} name={`${permission.id}-group`} checked={selectedOption == "yes"} className="hidden peer" />
            <label htmlFor={`${permission.id + "-yes"}`} className="w-8 h-8 flex justify-center items-center rounded-lg cursor-pointer peer-checked:bg-green-600 transition ease-all">
              <DoneIcon className={`${selectedOption == "yes" ? "text-secondary-200" : "text-green-600"}`} />
            </label>
          </div>
        </div>
      </div>
      <div>
        <span className='text-secondary-200'>
          {
            permission.description
          }
        </span>
      </div>
    </div>
  )
}

export default PermissionListItem