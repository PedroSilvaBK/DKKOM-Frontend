import { motion, useAnimation } from 'framer-motion'
import CaveConfigRolesTab_RoleList from './CaveConfigRolesTab_RoleList';
import caveServiceApi, { CaveRole, CreateCaveRoleRequest } from '../api/CaveServiceApi';
import { useEffect, useState } from 'react';
import { useCave } from './CaveProvider';
import CaveConfigRolesTab_Permissions from './CaveConfigRolesTab_Permissions';
import { useFormik } from 'formik';

function CaveConfigRolesTab() {
    const saveChangesAnimation = useAnimation()

    const { selectedCaveBaseInfo } = useCave();

    const [Roles, setRoles] = useState<CaveRole[]>([])
    const [selectedRole, setSelectedRole] = useState<CaveRole | null>(null)

    useEffect(() => {
        if (selectedCaveBaseInfo) {
            getCaveRoles(selectedCaveBaseInfo.caveId)
        }
    }, [])

    const createCaveRole = (request: CreateCaveRoleRequest) => {
        caveServiceApi.createCaveRole(request)

            .then((response) => {
                setRoles([...Roles, response])
            }).catch((error) => {
                console.error(error);
            })
    }

    const getCaveRoles = (caveId: string) => {
        caveServiceApi.getCaveRoles(caveId)
            .then((response) => {
                setRoles(response.caveRoles)
                setSelectedRole(response.caveRoles[0])
            }).catch((error) => {
                console.error(error);
            })
    }

    const initalValues = {
        id: selectedRole?.id,
        name: selectedRole?.name,
        permissions: selectedRole?.permissions,
        caveId: selectedCaveBaseInfo?.caveId || '',
    }
    
    const handleSubmit = (values: any) => {
        const updatedCaveRole: CaveRole = {
            id: values.id,
            name: values.name,
            permissions: values.permissions,
            caveId: selectedCaveBaseInfo?.caveId || '',
        }

        caveServiceApi.updateCaveRole(updatedCaveRole)
        .then((response) => {
            if (response) {
                setRoles(Roles.map(role => role.id === updatedCaveRole.id ? updatedCaveRole : role))
            }
        })
        .finally(() => {
            saveChangesAnimation.start('hidden');
        });
    }

    const formik = useFormik({
        initialValues: initalValues,
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

    const cancelSubmit = () => {
        formik.resetForm()

        saveChangesAnimation.start('hidden')
    }

    const handleRoleSelection = (role: CaveRole) => {
        console.log(role)
        setSelectedRole(role);
    };    

    return (
        <div className='w-full h-full relative overflow-hidden'>
            <div>
                <h1>Roles</h1>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className='flex gap-4 h-full w-full'>
                    <CaveConfigRolesTab_RoleList createCaveRole={createCaveRole} Roles={Roles} selectedRole={selectedRole} handleRoleSelection={handleRoleSelection} />
                    {
                        selectedRole && <CaveConfigRolesTab_Permissions selectedRole={formik.values} setFieldValue={formik.setFieldValue} />
                    }
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
                    <span className='text-primary-200'>You sure you want to update the information?</span>
                    <div className='flex gap-4'>
                        <button type='button' onClick={cancelSubmit} className='text-primary-100 rounded-lg p-1'>Cancel</button>
                        <button type='submit' className='bg-primary-100 text-secondary-100 rounded-lg p-2 hover:bg-secondary-300 transition ease-all '>Save Changes</button>
                    </div>
                </motion.div>
            </form>
        </div>
    )
}


export default CaveConfigRolesTab