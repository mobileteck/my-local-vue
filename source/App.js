enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "onyx enyo-fit",
	components:[
		{kind: "Panels", arrangerKind: "CollapsingArranger", fit: true, name: "panels", draggable: true,	narrowFit: true, classes: "panels enyo-border-box", components: [
			{kind: "CinemaReader", name: "cinemas", onSelectCinema: "cinemaSelected"},
			{kind: "FilmReader", name: "films", onSelectFilm: "filmSelected"},
			{kind: "FilmDetail", name: "filmDetail", onShowSpinner: "showSpinner"}
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
		this.log(args);
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
	}
	
	
});
