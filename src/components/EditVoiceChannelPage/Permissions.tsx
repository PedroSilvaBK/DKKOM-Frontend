import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { motion, useAnimation } from 'framer-motion'
import { IconButton } from '@mui/material';
import PermissionList from './PermissionList';
import caveServiceApi, { CaveRoleOverview, ChannelEntity } from '../../api/CaveServiceApi';
import { useCave } from '../CaveProvider';
import ChannelServiceApi, { ChannelPermissionType, ChannelRole, CreateChannelRoleRequest } from '../../api/ChannelService';
import { useFormik } from 'formik';

function Permissions({ selectedChannel }: { selectedChannel: ChannelEntity | null }) {
    const saveChangesAnimation = useAnimation()
    const { selectedCaveBaseInfo } = useCave()

    const [rolesOverview, setRolesOverview] = useState<CaveRoleOverview[]>([])
    const [channelRoles, setChannelRoles] = useState<ChannelRole[]>([])

    const [selectedChannelRole, setSelectedChannelRole] = useState<ChannelRole | null>(null)

    const [searchRoleMenuOpen, setSearchRoleMenuOpen] = useState<boolean>(false)
    const toggleSearchRoleMenu = () => {
        setSearchRoleMenuOpen(prev => {
            if (!prev) {
                getCaveRolesOverview()
            }

            return !prev
        })
    }

    const getCaveRolesOverview = () => {
        if (selectedCaveBaseInfo) {
            caveServiceApi.getCaveRolesOverview(selectedCaveBaseInfo.caveId).then((response) => {
                setRolesOverview(response.caveRoles)
            }).catch((error) => {
                console.error(error)
            })
        }
    }

    const getChannelRoles = () => {
        if (selectedChannel) {
            ChannelServiceApi.getChannelRoles(selectedChannel.id).then((response) => {
                setChannelRoles(response.channelRoles)
                setSelectedChannelRole(response.channelRoles[0])
            }).catch((error) => {
                console.error(error)
            })
        }
    }

    useEffect(() => {
        if (selectedChannel) {
            getChannelRoles()
        }
    }, [selectedChannel])

    const initialValues = {
        entityName: selectedChannelRole?.entityName,
        allow: selectedChannelRole?.allow || 0,
        deny: selectedChannelRole?.deny || 0,
        type: selectedChannelRole?.type,
        channelId: selectedChannelRole?.channelId,
        id: selectedChannelRole?.id,
        entityId: selectedChannelRole?.entityId
    }
    const handleSubmit = (values: any) => {
        const channelRole: ChannelRole = {
            entityName: values?.entityName,
            allow: values?.allow || 0,
            deny: values?.deny || 0,
            type: values?.type,
            channelId: values?.channelId,
            id: values.id,
            entityId: values?.entityId
        }

        ChannelServiceApi.updateChannelRole(channelRole).then((response) => {
            if (response) {
                setChannelRoles(channelRoles.map(role => role.id === channelRole.id ? channelRole : role))
            }
        }).catch((error) => {
            console.error(error)
        })

        saveChangesAnimation.start('hidden')
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        enableReinitialize: true
    })

    useEffect(() => {
        if (formik.dirty) {
            saveChangesAnimation.start('visible')
        } else {
            saveChangesAnimation.start('hidden')
        }
    }, [formik.values])

    const createChannelRole = (request: ChannelEntity, type: ChannelPermissionType) => {
        const createChannelRoleRequest: CreateChannelRoleRequest = {
            channelId: selectedChannel?.id || '',
            entityId: request.id,
            entityName: request.name,
            allow: 0,
            type: type,
            deny: 0,
        }

        console.log(createChannelRoleRequest)

        ChannelServiceApi.createChannelRole(createChannelRoleRequest).then((response) => {
            setChannelRoles(prev => [...prev, {
                id: response.id,
                channelId: response.channelId,
                entityId: response.entityId,
                type: response.type,
                entityName: response.entityName,
                allow: response.allow,
                deny: response.deny
            }])
        }).catch((error) => {
            console.error(error)
        })
    }

    const handleOnClickCancel = () => {
        formik.resetForm()
        saveChangesAnimation.start('hidden')
    }


    const handleSetSelectedChannelRole = (role: ChannelRole) => {
        setSelectedChannelRole(role)
    }


    return (
        <div className='flex flex-col gap-4 w-full h-full relative overflow-hidden'>
            <h1 className='text-secondary-100 font-semibold'>Permissions</h1>
            <form onSubmit={formik.handleSubmit}>
                <div className='flex gap-4'>
                    <div className='flex flex-col gap-3 w-[15rem] relative'>
                        <div className='flex items-center'>
                            <h2 className='text-secondary-100 text-sm font-semibold'>Roles / Members</h2>
                            <IconButton onClick={toggleSearchRoleMenu}>
                                <AddIcon className='text-secondary-100' />
                            </IconButton>
                        </div>
                        <div className='text-secondary-100 flex items-center flex-col gap-2'>
                            {
                                channelRoles.map((role, index) => (
                                    <div key={index}
                                    onClick={() => handleSetSelectedChannelRole(role)} 
                                     className={`hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center ${role.id === selectedChannelRole?.id ? "bg-secondary-300" : ""}`}>
                                        <span>{role.entityName}</span>
                                    </div>
                                ))
                            }
                        </div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, display: 'none' },
                                visible: { opacity: 1, display: 'block' }
                            }}
                            initial='hidden'
                            animate={searchRoleMenuOpen ? 'visible' : 'hidden'}
                            className='absolute bg-primary-100 top-8 p-1 rounded-xl flex flex-col gap-2'>
                            <input type="text" className='bg-primary-200 text-secondary-100 rounded-lg p-1' placeholder='Search Roles / Members' />
                            <div className='flex flex-col items-center gap-2 max-h-[13rem] overflow-y-scroll'>
                                {
                                    rolesOverview.map((role, index) => (
                                        <span key={index}
                                            onClick={() => { createChannelRole(role, ChannelPermissionType.CAVE_ROLE) }}
                                            className='text-secondary-100 hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>{role.name}</span>
                                    ))
                                }
                            </div>
                        </motion.div>
                    </div>
                    <div className='flex flex-col gap-3 h-[35rem] overflow-y-scroll'>
                        <h2 className='text-secondary-100 text-sm font-semibold'>Channel Permissions</h2>
                        <PermissionList setFieldValue={formik.setFieldValue} values={formik.values} />
                    </div>
                </div>
                <motion.div
                    variants={{
                        hidden: { bottom: '-100%' },
                        visible: { bottom: 0 }
                    }}
                    initial='hidden'
                    animate={saveChangesAnimation}
                    transition={{ duration: 0.3 }}
                    className='absolute bg-white w-full rounded-lg p-3 flex justify-between items-center'>
                    <span className='text-black'>You sure you want to update the information?</span>
                    <div className='flex gap-4'>
                        <button type='button'
                        onClick={handleOnClickCancel}
                         className='text-primary-100 rounded-lg p-1'>Cancel</button>
                        <button type='submit' className='bg-primary-100 text-secondary-100 rounded-lg p-1 hover:bg-secondary-300 transition ease-all '>Save Changes</button>
                    </div>
                </motion.div>
            </form>
        </div>
    )
}

export default Permissions