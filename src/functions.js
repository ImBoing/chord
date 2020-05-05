const data = require('./config')
module.exports = {
    channelAdvertiseCheck(channelID) {
        if (data.advertisingChannels.indexOf(channelID) >= 0) {
            return true
        } else return false
    },
    channelPromoCheck(channelID) {
        if (data.selfPromotionChannels.indexOf(channelID) >= 0) {
            return true
        } else return false
    },
    selfPromo(channelID, message) {
        if (!message) return false
        let messageSplitter = message.split(' ')
        if (data.selfPromotionChannels.indexOf(channelID) >= 0) {
            let checkMessage = /(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/img
            for (const singleMessage of messageSplitter) {
                if (checkMessage.test(singleMessage)) {
                    if (messageSplitter.length > 5) { return false } else return true
                }
            }
        } else return false
    },
    serverAdvertising(channelID, message) {
        if (!message) return false
        let messageSplitter = message.split(' ')
        if (data.advertisingChannels.indexOf(channelID) >= 0) {
            let checkMessage = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/img
            for (const singleMessage of messageSplitter) {
                if (checkMessage.test(singleMessage)) {
                    if (messageSplitter.length > 5) { return false } else return true
                }
            }
        } else return false
    }
}