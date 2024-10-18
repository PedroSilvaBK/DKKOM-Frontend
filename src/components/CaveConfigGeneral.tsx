import React from 'react'
import { motion, useAnimation } from 'framer-motion'

function CaveConfigGeneral() {
  const saveChangesAnimation = useAnimation()

  return (
    <div className='w-full h-full relative overflow-hidden'>
      <div>
        <label htmlFor="caveName">Cave Name</label>
        <input type="text" id="caveName" className='bg-primary-100 rounded-lg p-2 w-full outline-none' />
      </div>
      <div>
        <motion.div
          variants={{
            hidden: { bottom: '-100%' },
            visible: { bottom: 0 }
          }}
          initial='hidden'
          animate={saveChangesAnimation}
          transition={{ duration: 0.3 }}
          className='absolute bg-white w-full rounded-lg p-3 flex justify-between items-center'>
          <span>You sure you want to update the information?</span>
          <div className='flex gap-4'>
            <button className='text-primary-100 rounded-lg p-1'>Cancel</button>
            <button className='bg-primary-100 text-secondary-100 rounded-lg p-1 hover:bg-secondary-300 transition ease-all '>Save Changes</button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CaveConfigGeneral