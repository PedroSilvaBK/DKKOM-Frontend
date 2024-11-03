import React from 'react'
import VoiceChannelListItem from './VoiceChannelListItem'
import { ChannelOverviewDTO } from '../api/CaveServiceApi'

function VoiceChannelList({toggleEditVoiceChannelMenu, channelsOverview}: {toggleEditVoiceChannelMenu: (channelOverview: ChannelOverviewDTO) => void, channelsOverview: ChannelOverviewDTO[] | undefined}) {
  return (
    <div>
      {
            channelsOverview && channelsOverview.map((channelOverview, index) => (
                <VoiceChannelListItem key={index} toggleEditVoiceChannelMenu={toggleEditVoiceChannelMenu} channelOverview={channelOverview} />
            ))
      }
    </div>
  )
}

export default VoiceChannelList