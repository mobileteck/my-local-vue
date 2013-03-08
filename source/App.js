enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "onyx enyo-fit",
	components:[
		{kind: "Panels", arrangerKind: "CollapsingArranger", fit: true, name: "panels", draggable: true,	narrowFit: true, classes: "panels enyo-border-box", components: [
			{kind: "aboutView"},
			{kind: "CinemaReader", name: "cinemas", onSelectCinema: "cinemaSelected", onCheckInternetConnection: "checkInternetConnection", onShowAbout: "showAbout"},
			{kind: "FilmReader", name: "films", onSelectFilm: "filmSelected", onCheckInternetConnection: "checkInternetConnection"},
			{kind: "FilmDetail", name: "filmDetail", onShowSpinner: "showSpinner", onCheckInternetConnection: "checkInternetConnection"}
		]},
		{name: "spinner", kind: "onyx.Popup", centered: true, floating: true, scrim: true, autoDismiss: false, components: [
				{kind: "onyx.Spinner"}
		]},
		{kind: "enyo.Signals", ondeviceready: "deviceready"}, // for PhoneGap
		{kind: "enyo.Signals", onbackbutton: "backHandler"} // for WebOS and browser esc
	],

	deviceready: function() {
		enyo.dispatcher.listen(document, "backbutton");
	},

	create: function() {
		this.inherited(arguments);
		this.next();
	},
		
	cinemaSelected: function(inSender, args) {
		this.$.films.setCinema(args.cinema);
		if(args.clicked){
			this.next();
		}
	},
	
	filmSelected: function(inSender, args){
		this.$.filmDetail.setFilm(args.film);
		if(args.clicked){
			this.next();
		}
	},

	showSpinner: function(inSender, args){
		if(args.show) {
			this.$.spinner.show();
		} else{
			this.$.spinner.hide();
		}
		
	},

	next: function(){
		if(enyo.dom.getWindowWidth() < 600){
			this.log("next");
			this.$.panels.next();
			//this.$.panels.getActive().reflow();
		}
	},

	backHandler: function() {
		this.log("backHandler");
		if(enyo.dom.getWindowWidth() < 600){
			this.log("next");
			this.$.panels.previous();
			//this.$.panels.getActive().reflow();
		}
	},

	checkInternetConnection: function(){
		//this.log("Checking Internet Connection");
		if(navigator.connection) {
			var networkState = navigator.connection.type;
			this.log(networkState);
			if(networkState === navigator.connection.NONE || networkState === "none") {
				this.log("No Network Connection found");
				this.showBanner('No Internet Connection');			
				return false;
			} else{
				return true;	
			}	
		} else{
			// can't check, defaults to true
			return true;
		}
	},

	showBanner: function(message) {
    	if(enyo.platform.webos) {
    		if(message) {
    			navigator.notification.showBanner(message);
	   		}
    	}

    },

    showAbout: function() {
		this.$.panels.setIndex(0);
    }
	
});
