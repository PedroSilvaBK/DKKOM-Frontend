import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { AnimationControls, motion, useAnimation } from 'framer-motion'

interface CaveOverviewCardProps {
    isSideBarOpen: boolean;
}

function CaveOverviewCard({ isSideBarOpen }: CaveOverviewCardProps) {
    const text: string = 'CAVE'
    const animationControls: AnimationControls = useAnimation()

    const showArrow = () => {
        animationControls.start('visible')
    }

    const hideArrow = () => {
        animationControls.start('hidden')
    }

    return (
        <div>
            <div onMouseEnter={showArrow} onMouseLeave={hideArrow} className='w-full overflow-hidden relative bg-secondary-100 rounded-lg p-3 text-center hover:cursor-pointer'>
                <div>
                    <motion.div
                        initial='hidden'
                        variants={
                            {
                                hidden: { left: '-2rem' },
                                visible: { left: 0 }
                            }
                        }
                        transition={{ duration: 0.3 }}
                        animate={animationControls}
                        className='absolute transition ease-all'>
                        <ArrowForwardIosIcon />
                    </motion.div>
                </div>
                <div>
                    {isSideBarOpen ? text : text[0]}
                </div>
            </div>
        </div>
    )
}

export default CaveOverviewCard