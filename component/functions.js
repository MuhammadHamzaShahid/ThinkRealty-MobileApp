const ThinkRealtyFunctions = {
    ByteToSizeUnits: function(bytes){
        if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(1) + " GB"; }
        else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(1) + " MB"; }
        else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(1) + " KB"; }
        else if (bytes > 1)           { bytes = bytes + " bytes"; }
        else if (bytes == 1)          { bytes = bytes + " byte"; }
        else                          { bytes = "0 bytes"; }
        return bytes;
    },
    UpdateUserMeta : function(Key, Value){
        global.database.transaction((tx) => {
            tx.executeSql("UPDATE `thinkrealty_current_user` SET `user_value` = '"+Value+"' WHERE `user_key` = '"+Key+"'",
                [],
                (tx, success) => {
                    if(!success.rowsAffected){
                        tx.executeSql("INSERT INTO `thinkrealty_current_user` (`user_key`, user_value) VALUES ('"+Key+"','"+Value+"')");
                    }
                }
            )
        })
    },
    UpdateDetailMeta : function(id, Key, Value, Label){
        global.database.transaction((tx) => {
            tx.executeSql("UPDATE `thinkrealty_detail_inquires` SET `meta_value` = '"+Value+"', `meta_label` = '"+Label+"' WHERE  `meta_key` = '"+Key+"' AND `detail_id` = '"+id+"'",
                [],
                (tx, success) => {
                    if(!success.rowsAffected){
                        tx.executeSql("INSERT INTO `thinkrealty_detail_inquires` (`detail_id`, `meta_key`, `meta_value`, `meta_label`) VALUES ('"+id+"', '"+Key+"','"+Value+"', '"+Label+"')");
                    }
                }
            )
        })
    },
    JsonStringify: function(text, to, from){
        if(text && to && from){
            return text.split(to).join(from);
        }
        return console.log('ERROR => JsonStringify expected 3 parameters');
    },
    MillisToMinutesAndSeconds: function(millis){
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    },
    TimeStampAMPM: function(TimeStamp, AMPM = true){
        let date = new Date(TimeStamp);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let strTime = '';
        if(AMPM){
            hours = hours % 12;
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours ? hours : 12;
            minutes = minutes.toString().padStart(2, '0');
            strTime = hours + ':' + minutes + ' ' + ampm;
        }
        else{
            hours = hours % 24;
            minutes = minutes.toString().padStart(2, '0');
            strTime = hours + ':' + minutes;
        }
        return strTime;
    }
}
export default ThinkRealtyFunctions;