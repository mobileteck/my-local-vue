enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "onyx enyo-fit",
	components:[
		{kind: "Panels", arrangerKind: "CollapsingArranger", fit: true, name: "panels", draggable: true,	narrowFit: true, classes: "panels enyo-border-box", components: [
			{kind: "aboutView", onOK: "showCinemaList"},
			{kind: "CinemaReader", name: "cinemas", onSelectCinema: "cinemaSelected", onShowAbout: "showAbout", onBack: "backHandler"},
			{kind: "FilmReader", name: "films", onSelectFilm: "filmSelected", onBack: "backHandler"},
			{kind: "FilmDetail", name: "filmDetail", onShowSpinner: "showSpinner", onBack: "backHandler"}
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
		this.showCinemaList();
	},
		
	cinemaSelected: function(inSender, args) {
		this.log(args);
		this.$.films.setCinema(args.cinema);
		if(args.clicked){
			this.$.panels.setIndex(2);
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

	showCinemaList: function(){
		this.log("showCinemaList");
		this.$.panels.setIndex(1);
	},

	next: function(){
		//if(Panels.isScreenNarrow) { 
		if(enyo.dom.getWindowWidth() < 800){
			this.log("next");
			this.$.panels.next();
			//this.$.panels.getActive().reflow();
		}
	},

	backHandler: function() {
		this.log("backHandler");
		//if(enyo.dom.getWindowWidth() < 800){
		//if(Panels.isScreenNarrow) { 	
			this.log("previous");
			this.$.panels.previous();
			//this.$.panels.getActive().reflow();
		//}
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
