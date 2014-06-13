enyo.kind({
    name: "NativeUtils",
    kind: "enyo.Component",
    handlers: {
    },
    published: {
    },
    events: {
    },

    checkInternetConnection: function(){

        //this.log("Checking Internet Connection");
        //this.log("Device Platform: [" + device.platform + "]");            
        //this.log(enyo.platform);

        if(navigator.connection) {
            var networkState = navigator.connection.type;
            this.log(networkState);
            if(networkState == navigator.connection.NONE) {
                this.log("No Network Connection found");
                this.showError(this, { title: 'No Internet', message: 'This App requires an Internet connection. Please try again when you have signal or connected to Wi-Fi'});            
                return false;
            } else{
                return true;    
            }   
        } else{
            // can't check, defaults to true
            return true;
        }
    }
});

