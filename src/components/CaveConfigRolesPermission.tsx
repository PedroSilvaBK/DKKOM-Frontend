import React from 'react'
import IOSSwitch from './IOSSwitch'

function CaveConfigRolesPermission() {
    return (
        <div>
            <div className='flex justify-between'>
                <h1>Permission Name</h1>
                <IOSSwitch sx={{ m: 1 }} defaultChecked />
            </div>
            <div>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi aliquam eos, hic doloremque nesciunt magni cum consequuntur dignissimos consectetur quo fugit sint, corporis aperiam commodi?
            </div>
        </div>
    )
}

export default CaveConfigRolesPermission