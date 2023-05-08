function brandingFormat() {
    let host = global.config.dev ? global.config.hosts.development : global.config.hosts.production;
    let { hostName } = host; 
    return `<branding>
                <packingSlip>
                    <frontImage>${hostName}branding/packing-slip-front.jpg</frontImage>
                    <template>1</template>
                </packingSlip>
                <insertCard>
                    <outsideImage>${hostName}branding/card-insert-landscape.jpg</outsideImage>
                </insertCard>
                <sticker>
                    <frontImage>${hostName}branding/sticker-landscape.jpg</frontImage>
                </sticker>
            </branding>`
}

export default brandingFormat;