import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { CreateChannelRequest } from '../api/ChannelService';

function CaveCreateChannelMenu({ toggleCreateChannelMenuOpen, createChannel }: { toggleCreateChannelMenuOpen: () => void, createChannel: (createChannelRequest: CreateChannelRequest) => void }) {

    const initialValues = {
        channelType: '',
        channelName: ''
    }

    const validationSchema = Yup.object({
        channelType: Yup.string().required('Channel type is required'),
        channelName: Yup.string()
            .required('Channel name is required')
            .min(2, 'Channel name must be at least 2 characters'),
    });

    const handleSubmit = (values: any) => {
        createChannel(values);
        toggleCreateChannelMenuOpen();
    }

    return (
        <div>
            <div
                className='absolute z-30 h-screen w-screen inset-0 grid place-items-center'>
                <div className='absolute bg-black opacity-30 h-full w-full' />
                <div className='z-40 glass-morphism p-3 w-[30rem]'>
                    <div className="p-3 bg-primary-200 rounded-lg flex flex-col gap-4">
                        <div className='flex items-center justify-between'>
                            <h1 className='text-secondary-100 font-semibold'>Create a channel</h1>
                            <IconButton onClick={toggleCreateChannelMenuOpen}>
                                <CloseIcon className='text-secondary-100' />
                            </IconButton>
                        </div>
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                            {({ values, handleSubmit, setFieldValue }) => (
                                <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                    <div>
                                        <h2 className="text-secondary-200 font-semibold">CHANNEL TYPE</h2>
                                        <div className="flex flex-col gap-3">
                                            <div>
                                                <input
                                                    type="radio"
                                                    id="text-channel"
                                                    name="channelType"
                                                    value="text-channel"
                                                    checked={values.channelType === 'TEXT_CHANNEL'}
                                                    onChange={() => setFieldValue('channelType', 'TEXT_CHANNEL')}
                                                    className="hidden peer"
                                                />
                                                <label
                                                    htmlFor="text-channel"
                                                    className="flex justify-between p-3 items-center rounded-lg cursor-pointer bg-primary-100 peer-checked:bg-secondary-300 transition ease-all"
                                                >
                                                    <h1>Text-Channel</h1>
                                                    {values.channelType === 'TEXT_CHANNEL' ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
                                                </label>
                                            </div>

                                            <div>
                                                <input
                                                    type="radio"
                                                    id="voice-channel"
                                                    name="channelType"
                                                    value="voice-channel"
                                                    checked={values.channelType === 'VOICE_CHANNEL'}
                                                    onChange={() => setFieldValue('channelType', 'VOICE_CHANNEL')}
                                                    className="hidden peer"
                                                />
                                                <label
                                                    htmlFor="voice-channel"
                                                    className="flex justify-between p-3 items-center rounded-lg cursor-pointer bg-primary-100 peer-checked:bg-secondary-300 transition ease-all"
                                                >
                                                    <h1>Voice-Channel</h1>
                                                    {values.channelType === 'VOICE_CHANNEL' ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
                                                </label>
                                            </div>
                                        </div>
                                        <ErrorMessage name="channelType" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <h2 className="text-secondary-100 font-semibold">CHANNEL NAME</h2>
                                        <Field
                                            type="text"
                                            name="channelName"
                                            placeholder="Enter channel name"
                                            className="w-full text-seocndary p-2 bg-primary-300 rounded-lg"
                                        />
                                        <ErrorMessage name="channelName" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full bg-primary-100 hover:bg-secondary-300 transition ease-all text-secondary-100 p-2 rounded-lg"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaveCreateChannelMenu