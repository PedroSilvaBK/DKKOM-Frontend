import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { CaveInviteExpiration, CreateCaveInviteRequest } from '../api/CaveServiceApi';

function CaveInviteMenu({ toggleCreateInviteMenuOpen, createInvite }: { toggleCreateInviteMenuOpen: () => void, createInvite: (values: CreateCaveInviteRequest) => Promise<string> }) {
    const [inviteLinkConfigOpen, setInviteLinkConfigOpen] = useState<boolean>(false);
    const [inviteLink, setInviteLink] = useState<string>('');

    const toggleInviteLinkConfigOpen = () => {
        setInviteLinkConfigOpen(!inviteLinkConfigOpen);
    }

    const frontEndUrl = import.meta.env.VITE_FRONTEND_URL;

    const initialValuesCreateInvite = {
        inviteLinkExpireTime: 'ONE_DAY',
        inviteLinkMaxUses: '10',
    }

    const validationSchemaCreateInvite = Yup.object({
        inviteLinkExpireTime: Yup.string().required('Required'),
        inviteLinkMaxUses: Yup.string().required('Required'),
    })

    useEffect(() => {
        onSubmitCreateInvite(initialValuesCreateInvite)
    }, [])

    const onSubmitCreateInvite = (values: typeof initialValuesCreateInvite) => {
        createInvite({
            caveId: 'caveId',
            caveInviteExpiration: values.inviteLinkExpireTime as CaveInviteExpiration,
            maxUses: parseInt(values.inviteLinkMaxUses),
        }).then((inviteId) => {
            setInviteLink(`${frontEndUrl}/invite/${inviteId}`)
        });
    }

    const copyInviteToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
    }

    return (
        <div
            className='absolute z-30 h-screen w-screen inset-0 grid place-items-center'>
            <div className='absolute bg-black opacity-30 h-full w-full' />
            <div className='z-40 glass-morphism p-3 w-[30rem]'>
                <div className="p-3 bg-primary-200 rounded-lg">
                    <div className='flex flex-col gap-3'>
                        <div className='flex items-center justify-between'>
                            <h1 className='text-secondary-100 font-semibold'>Invite People to the cave</h1>
                            <IconButton onClick={toggleCreateInviteMenuOpen}>
                                <CloseIcon className='text-secondary-100' />
                            </IconButton>
                        </div>
                        <input type="text" placeholder='Enter friend name' className='w-full p-2 bg-primary-300 rounded-lg' />
                    </div>
                    <hr className='my-3' />
                    <div>

                    </div>
                    <div className='flex flex-col gap-1'>
                        <h3 className='font-semibold'>Or send a invitation link</h3>
                        <div className='flex gap-3'>
                            <input type="text" placeholder='https://discord.gg/invite' className='w-full p-2 bg-primary-300 rounded-lg text-black' value={inviteLink} />
                            <button className='bg-primary-100 hover:bg-secondary-300 transition ease-all text-secondary-100 p-2 rounded-lg' onClick={copyInviteToClipboard}>Copy</button>
                        </div>
                        <div>
                            <a onClick={toggleInviteLinkConfigOpen} className='text-sm font-thin hover:underline hover:cursor-pointer'>change invite settings</a>
                        </div>
                        <motion.div className='mt-3'
                            variants={{
                                open: { display: 'initial' },
                                closed: { display: 'none' }
                            }}
                            initial='closed'
                            animate={inviteLinkConfigOpen ? 'open' : 'closed'}
                        >
                            <Formik
                                initialValues={initialValuesCreateInvite}
                                validationSchema={validationSchemaCreateInvite}
                                onSubmit={onSubmitCreateInvite}
                            >
                                {({ handleSubmit }) => (
                                    <Form onSubmit={handleSubmit} className='mt-3 flex-col gap-4'>
                                        <div>
                                            <label htmlFor="expiration-time" className="block mb-2 text-sm font-medium text-secondary-100">Expire at</label>
                                            <Field
                                                as='select'
                                                id="expiration-time"
                                                name="inviteLinkExpireTime"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                                <option value="THIRTY_MINUTES">30 minutes</option>
                                                <option value="ONE_HOUR">1 hour</option>
                                                <option value="SIX_HOURS">6 hours</option>
                                                <option value="TWELVE_HOURS">12 hours</option>
                                                <option value="ONE_DAY">1 day</option>
                                                <option value="SEVEN_DAYS">7 days</option>
                                                <option value="NEVER">Never</option>
                                            </Field>
                                        </div>
                                        <div>
                                            <label htmlFor="max-uses" className="block mb-2 text-sm font-medium text-secondary-100">Max uses</label>
                                            <Field
                                                as='select'
                                                name="inviteLinkMaxUses"
                                                id="max-uses"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                                <option value="-1">Unlimited</option>
                                                <option value="1">1 use</option>
                                                <option value="5">5 uses</option>
                                                <option value="10">10 uses</option>
                                                <option value="25">25 uses</option>
                                                <option value="50">50 uses</option>
                                                <option value="100">100 uses</option>
                                            </Field>
                                        </div>
                                        <div className="mt-3">
                                            <button
                                                type="submit"
                                                className="w-full bg-primary-100 hover:bg-secondary-300 transition ease-all text-secondary-100 p-2 rounded-lg"
                                            >
                                                Generate Link
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaveInviteMenu