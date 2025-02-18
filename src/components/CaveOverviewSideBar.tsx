import { useState } from 'react'
import { IconButton } from '@mui/material';
import { motion } from 'framer-motion'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CaveOverviewCard from './CaveOverviewCard';
import CloseIcon from '@mui/icons-material/Close';
import caveServiceApi, { CaveOverview, CreateCaveRequest } from '../api/CaveServiceApi';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from './AuthProvider';
import SettingsMenu from './SettingsMenu';

function CaveOverviewSideBar({ setSelectedCave, userCavesOverview, setUserCavesOverview }: { setSelectedCave: (cave: any) => void, userCavesOverview: CaveOverview[], setUserCavesOverview: (caves: CaveOverview[]) => void }) {
    const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);
    const [activeMenu, setActiveMenu] = useState<'main' | 'create' | 'join'>('main');

    const { user } = useAuth();

    const [addCaveMenu, setAddCaveMenu] = useState<boolean>(false);


    const toggleAddCaveMenu = () => {
        setAddCaveMenu(!addCaveMenu);
    }
    const sideBarVariants = {
        hidden: { width: '6rem' },
        visible: { width: '20rem', transition: { duration: 0.3 } },
    };

    const toggleSideBar = () => {
        setSideBarOpen(!sideBarOpen);
    }

    const slideVariants = {
        hidden: { x: '100%' },
        visible: { x: '0%', transition: { duration: 0.3 } },
        exit: { x: '-100%', transition: { duration: 0.3 } },
    };

    const addCaveMenuVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
    };



    const initialValuesCreateCave = {
        cave_name: '',
        ownerId: '',
    }

    const validationSchemaCreateCave = Yup.object({
        cave_name: Yup.string().required('Required'),
    })

    const onSubmitCreateCave = (values: typeof initialValuesCreateCave) => {
        if (user) {
            createCave({ name: values.cave_name, ownerId: user.id });
        } else {
            console.error('User is null');
        }
    }

    const createCave = (createCaveRequest: CreateCaveRequest) => {
        caveServiceApi.createCave(createCaveRequest)
            .then((response) => {
                setUserCavesOverview([...userCavesOverview, { id: response.id, name: createCaveRequest.name }]);
                setSelectedCave(response.id);
                setAddCaveMenu(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }


    return (
        <div>
            <motion.div
                initial='hidden'
                variants={sideBarVariants}
                animate={sideBarOpen ? 'visible' : 'hidden'}
                className='h-screen sticky top-0 flex flex-col items-center justify-between gap-3 p-2'
            >
                <div>
                    <IconButton onClick={toggleSideBar}>
                        <ArrowForwardIosIcon style={{ fontSize: '1.5rem', color: 'white' }} className={`${sideBarOpen ? "rotate-90" : ""}`} />
                    </IconButton>
                </div>
                <div className='bg-primary-200 p-3 rounded-xl w-full h-screen overflow-y-scroll scrollbar-hide'>
                    <div className='flex flex-col gap-3'>
                        {
                            userCavesOverview.map((caveOverview) => (
                                <CaveOverviewCard key={caveOverview.id} isSideBarOpen={sideBarOpen} caveOverview={caveOverview} setSelectedCave={setSelectedCave} />
                            ))
                        }
                    </div>
                </div>
                <div className='w-full'>
                    <button type="button"
                        onClick={toggleAddCaveMenu}
                        className="w-full text-primary-100 bg-secondary-200 hover:bg-primary-200 hover:text-secondary-200 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center me-2  transition ease-all">
                        {sideBarOpen ? 'Add Cave' : '+'}
                    </button>
                </div>
                <SettingsMenu />
            </motion.div>
            {addCaveMenu && (
                <motion.div
                    initial='hidden'
                    animate='visible'
                    variants={addCaveMenuVariants}
                    className='absolute h-screen inset-0 grid place-items-center z-10'>
                    <div className='absolute bg-black opacity-30 h-full w-full' />
                    <div className='z-50 glass-morphism-login p-3 flex flex-col items-center gap-3 overflow-hidden w-[30rem]'>
                        <div className='w-full'>
                            {activeMenu === 'main' && (
                                <motion.div
                                    variants={slideVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="grid place-items-center grid-rows-2 gap-4"
                                >
                                    <div
                                        className="bg-primary-200 p-3 rounded-xl w-full flex justify-between items-center gap-4 hover:cursor-pointer"
                                        onClick={() => setActiveMenu('create')}
                                    >
                                        <h1 className="text-2xl text-center text-secondary-100 w-full">
                                            Create your own Cave!
                                        </h1>
                                        <ArrowForwardIosIcon style={{ fontSize: '1rem', color: 'white' }} />
                                    </div>
                                    <div
                                        className="bg-primary-200 p-3 rounded-xl w-full flex justify-between items-center hover:cursor-pointer"
                                        onClick={() => setActiveMenu('join')}
                                    >
                                        <h1 className="text-2xl text-center text-secondary-100 w-full">
                                            Join Cave!
                                        </h1>
                                        <ArrowForwardIosIcon style={{ fontSize: '1rem', color: 'white' }} />
                                    </div>
                                </motion.div>
                            )}

                            {activeMenu === 'create' && (
                                <motion.div
                                    variants={slideVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="p-3 bg-primary-200 rounded-xl w-full flex flex-col items-center gap-3"
                                >
                                    <h1 className="text-2xl text-center text-secondary-100">Create Your Cave!</h1>
                                    <Formik
                                        initialValues={initialValuesCreateCave}
                                        onSubmit={onSubmitCreateCave}
                                        validationSchema={validationSchemaCreateCave}
                                    >
                                        {({ handleSubmit }) => (
                                            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                                                <label htmlFor="cave_name" className="text-secondary-100">Cave Name</label>
                                                <Field
                                                    type="text"
                                                    id="cave_name"
                                                    name="cave_name"
                                                    placeholder="Cave Name"
                                                    className="p-2 rounded-lg"
                                                />
                                                <ErrorMessage
                                                    name="cave_name"
                                                    component="div"
                                                    className="text-red-500 text-sm"
                                                />

                                                <button type="submit"
                                                    className="w-full text-secondary-100 bg-primary-100 hover:bg-secondary-200 hover:text-primary-100 focus:outline-none focus:ring-4 font-medium rounded-xl text-sm px-5 py-2.5 text-center me-2 mb-2 transition ease-all"
                                                >
                                                    Create Cave
                                                </button>
                                            </form>
                                        )}
                                    </Formik>
                                    <button
                                        className="p-2 text-sm rounded-lg text-white self-start hover:underline"
                                        onClick={() => setActiveMenu('main')}
                                        type='button'
                                    >
                                        Back to Menu
                                    </button>
                                </motion.div>
                            )}

                            {activeMenu === 'join' && (
                                <motion.div
                                    variants={slideVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="p-3 bg-primary-200 rounded-xl w-full flex flex-col items-center gap-3"
                                >
                                    <h1 className="text-2xl text-center text-secondary-100">Join Cave!</h1>
                                    <form className="w-full flex flex-col gap-3">
                                        <input
                                            type="text"
                                            placeholder="Cave Invite Code"
                                            className="p-2 rounded-lg"
                                        />
                                        <button type="submit"
                                            className="w-full text-secondary-100 bg-primary-100 hover:bg-secondary-200 hover:text-primary-100 focus:outline-none focus:ring-4 font-medium rounded-xl text-sm px-5 py-2.5 text-center me-2 mb-2 transition ease-all"
                                        >Join Cave
                                        </button>
                                    </form>
                                    <button
                                        className="p-2 text-sm rounded-lg text-white self-start hover:underline"
                                        onClick={() => setActiveMenu('main')}
                                    >
                                        Back to Menu
                                    </button>
                                </motion.div>
                            )}

                        </div>
                        <div className='rounded-full hover:bg-primary-200 transition ease-all grid place-items-center hover:cursor-pointer w-fit'>
                            <IconButton onClick={toggleAddCaveMenu}>
                                <CloseIcon style={{ fontSize: '1.5rem', color: 'white' }} />
                            </IconButton>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

export default CaveOverviewSideBar