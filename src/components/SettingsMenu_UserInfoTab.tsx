import { useFormik } from 'formik'
import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import UserServiceApi, { User } from '../api/UserServiceApi';
import { useAuth } from './AuthProvider';
import MessageServiceApi from '../api/MessageServiceApi';

function SettingsMenu_UserInfoTab() {
    const saveChangesAnimation = useAnimation()
    const { user, login, logout } = useAuth()

    const [userInfo, setUserInfo] = useState<User | null>(null)

    useEffect(() => {
        getUserInfo()
    }, [])

    const getUserInfo = () => {
        if (!user) {
            return;
        }

        UserServiceApi.getUserById(user.id).then((response) => {
            setUserInfo(response);
        }).catch((error) => {
            console.error(error);
        })
    }

    const deleteAccount = () => {
        if (user?.id){
            UserServiceApi.deleteUser(user.id).then((response) => {
                console.log(response)
                logout()
            }).catch((error) => {
                console.error(error);
            })
        }
    }

    const updateUserInfo = (userInfo: User) => {
        UserServiceApi.updateUser(userInfo).then(() => {
            UserServiceApi.getNewToken().then((token) => {
                login(token)
            })
        }).catch((error) => {
            console.error(error);
        })
    }

    const initialValues = {
        username: userInfo?.username || '',
        name: userInfo?.name || ''
    }

    const validationSchema = Yup.object({
        username: Yup.string()
            .required('Username is required')
            .min(2, 'Username must be at least 2 characters'),
        name: Yup.string()
            .required('Name is required')
            .min(2, 'Name must be at least 2 characters')
    });

    const handleSubmit = (values: any) => {
        values.id = user?.id
        console.log(values)
        updateUserInfo(values)

        const updatedUser: User = {
            id: user?.id || '',
            username: values.username,
            name: values.name,
            email: userInfo?.email || ''
        }
        
        console.log(updatedUser)
        setUserInfo(updatedUser)
        
        saveChangesAnimation.start('hidden')
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: handleSubmit
    })

    useEffect(() => {
        if (formik.dirty) {
            saveChangesAnimation.start('visible')
        } else {
            saveChangesAnimation.start('hidden')
        }
    }, [formik.values])

    const cancelSubmit = () => {
        formik.resetForm()
        saveChangesAnimation.start('hidden')
    }

    const handleDeleteAccount = () => {
        deleteAccount()
    }

    const handleExportAccount = async () => {
        if (!user?.id) {
            return;
        }

        try {

            const blob = await MessageServiceApi.exportMessages(user.id);

            // Create a URL for the Blob and trigger download
            const fileName = `user_messages_${user.id}.json`;
            const fileURL = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = fileURL;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Optionally, revoke the object URL after some time
            setTimeout(() => window.URL.revokeObjectURL(fileURL), 100);
        } catch (err: any) {
            console.error(err);
        }
    }

    return (
        <div className='h-full overflow-hidden relative'>
            <h1 className="text-lg font-bold">User Info</h1>
            <hr className="mb-3" />
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                <div className='gap-4 flex flex-col'>
                    <div>
                        <label htmlFor="username" className="text-secondary-100 font-semibold">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`bg-primary-100 rounded-lg p-2 w-full outline-none ${formik.touched.username && formik.errors.username
                                ? "border border-red-500"
                                : ""
                                }`}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <div className="text-red-500 text-sm">{formik.errors.username}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="username" className="text-secondary-100 font-semibold">
                            Email
                        </label>
                        <input
                            type="text"
                            name="email"
                            disabled={true}
                            value={userInfo?.email}
                            className={`bg-primary-100 rounded-lg p-2 w-full outline-none`}
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="text-secondary-100 font-semibold">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`bg-primary-100 rounded-lg p-2 w-full outline-none ${formik.touched.name && formik.errors.name
                                ? "border border-red-500"
                                : ""
                                }`}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-500 text-sm">{formik.errors.name}</div>
                        )}
                        <div className='mt-4'>
                            <button type='button' onClick={handleExportAccount} className='w-full p-2 bg-red-500 rounded-2xl outline-none hover:bg-primary-200 hover:border-1 hover:border-red-500 border-2 border-transparent hover:text-red-500  transition-all ease-all'>Export Messages</button>
                        </div>
                        <div className='mt-4'>
                            <button type='button' onClick={handleDeleteAccount} className='w-full p-2 bg-red-500 rounded-2xl outline-none hover:bg-primary-200 hover:border-1 hover:border-red-500 border-2 border-transparent hover:text-red-500  transition-all ease-all'>Delete Account</button>
                        </div>
                    </div>
                </div>
                <motion.div
                    variants={{
                        hidden: { display: "none", bottom: '-20%' },
                        visible: { display: "initial", bottom: 0 }
                    }}
                    initial='hidden'
                    animate={saveChangesAnimation}
                    transition={{ duration: 0.3 }}
                    className='absolute bg-white w-full rounded-lg p-3 justify-between items-center text-primary-100'>
                    <div className='flex items-center'>
                        <span className='flex-grow text-center'>You sure you want to update the information?</span>
                        <div className='flex gap-4'>
                            <button type='button' onClick={cancelSubmit} className='text-primary-100 rounded-lg p-1'>Cancel</button>
                            <button type='submit' className='bg-primary-100 text-secondary-100 rounded-lg p-1 hover:bg-secondary-300 transition ease-all '>Save Changes</button>
                        </div>
                    </div>
                </motion.div>
            </form>
        </div>
    )
}

export default SettingsMenu_UserInfoTab