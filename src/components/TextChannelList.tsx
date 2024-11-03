import React from 'react'
import TextChannelListItem from './TextChannelListItem'
import { ChannelOverviewDTO } from '../api/CaveServiceApi';


function TextChannelList({toggleEditTextChannelMenu, channelsOverview}: {toggleEditTextChannelMenu: (channelOverview: ChannelOverviewDTO) => void, channelsOverview: ChannelOverviewDTO[] | undefined}) {
  return (
    <div>
        {
          channelsOverview && channelsOverview.map((channelOverview, index) => (
            <TextChannelListItem key={index} toggleEditTextChannelMenu={toggleEditTextChannelMenu} channelOverview={channelOverview} />
          ))
        }
    </div>
  )
}

export default TextChannelList