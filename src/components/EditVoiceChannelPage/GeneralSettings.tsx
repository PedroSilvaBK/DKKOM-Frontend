import { motion, useAnimation } from 'framer-motion'

function GeneralSettings() {
  const saveChangesAnimation = useAnimation()

  return (
    <div className='flex gap-4 flex-col h-full relative overflow-hidden'>
    <h1 className='text-secondary-100 font-semibold'>General Settings</h1>
    <div>
      <form>
        <div>
          <label className='text-secondary-100'>Channel Name</label>
          <input type='text' className='bg-primary-100 text-secondary-100 rounded-lg p-1 w-full' />
        </div>
      </form>
    </div>
    <motion.div 
    variants={{
      hidden: { bottom: '-100%' },
      visible: { bottom: 0  }
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
  )
}

export default GeneralSettings