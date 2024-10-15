function InviteLinkConfig() {
    return (
        <div className='mt-3 flex-col gap-4'
        >
            <div>
                <label htmlFor="expiration-time" className="block mb-2 text-sm font-medium text-secondary-100">Expire at</label>
                <select id="expiration-time" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="30m">30 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="6h">6 hours</option>
                    <option value="12h">12 hours</option>
                    <option value="1d">1 day</option>
                    <option value="7d">7 days</option>
                    <option value="never">Never</option>
                </select>
            </div>
            <div>
                <label htmlFor="max-uses" className="block mb-2 text-sm font-medium text-secondary-100">Max uses</label>
                <select id="max-uses" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="-1">Unlimited</option>
                    <option value="1">1 use</option>
                    <option value="5">5 uses</option>
                    <option value="10">10 uses</option>
                    <option value="25">25 uses</option>
                    <option value="50">50 uses</option>
                    <option value="100">100 uses</option>
                </select>
            </div>
        </div>
    )
}

export default InviteLinkConfig