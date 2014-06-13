enyo.kind({
	name: "FilmDetail",
	kind: "FittableRows",
	fit: true,
	classes: "enyo-fit dark-scene",
	published: {
		film: ""
	},
	events: {
		onShowSpinner: "",
		onBack: ""
	},
	components: [
		{kind: "onyx.Toolbar", name: "detailHeader", layoutKind: "FittableColumnsLayout", style: "height: 50px;", components: [
			{name: "backButton", kind: "onyx.Button", content: "Back", ontap: "doBack"},
			{kind: "Control", content: "Film Name", name: "header", style: "margin-left: 10px;"}
		]},
		{kind: "Scroller", name: "scroller",  classes: "enyo-scroller", thumb: false, fit: true, touch: true, horizontal: "hidden", components: [	
			{kind: "FittableColumns", style: "margin: 10px;", name: "fc31", components: [
					{kind: "Image", style: "width: 88px; height: 130px;", name: "filmImage"},
					{kind: "FittableRows", style: "padding-left: 10px;", content: "fittableRows2", fit: true, name: "fittableRows2", components: [
							{kind: "FittableColumns", content: "fittableColumns2", name: "fittableColumns2", components: [
									{kind: "Control", classes: "well", content: "Length:", allowHtml: true, layoutKind: "BaseLayout", name: "filmTime"},
									{kind: "Image", style: "margin-left: 5px; width: 19px; height: 19px;", name: "filmCert"}
								]},
							{kind: "Control", classes: "well", content: "Director:", allowHtml: true, layoutKind: "BaseLayout", name: "filmDirector"},
							{kind: "Control", classes: "well", content: "Cast:", allowHtml: true, layoutKind: "BaseLayout", name: "filmCast"},
							{kind: "Image", name: "filmTrailer", src: "assets/video_play_small.png", showing: false, ontap: "playTrailer"}
						]}
				]},
			{kind: "Control", style: "font-size: 16px; margin: 10px 10px 10px 10px;", content: "Cast:", allowHtml: true, layoutKind: "BaseLayout", name: "filmSynopsis"},
			{kind: "onyx.GroupboxHeader", content: "Film Schedule"},
			{kind: "Repeater", rowsPerPage: 15, count: 15, strategyKind: "TouchScrollStrategy", fit: true, name: "list", onSetupItem: "getScheduleItem", components: [
				{kind: "Control", classes: "item enyo-border-box", layoutKind: "FittableRowsLayout", name: "fc35", components: [
					{kind: "Control", classes: "filmScheduleDivider", showing: false, name: "date"},
					{kind: "Control", classes: "filmScheduleEntry", name: "time", ontap: "listItemClick"}
				]},
			]}
		]},	
		{kind: "onyx.Toolbar", name: "mt30", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
				{content: "", style: "height: 32px;"},
				{kind: "onyx.Grabber", name: "gr30"}
		]},
		{name: "nativeUtils", kind: "NativeUtils"}
	],
	create: function() {
		this.inherited(arguments);
		this.resetData();
	},
	
	filmChanged: function() {
      this.loadFilmDetails();
	},

	
	resetData: function() {
			this.scheduleListModel = {
			listTitle: $L('Select Show Time'),
			filmImage: "",
			filmTitle: "",
			filmTime: "",
			filmCert: "",
			filmDirector: "",
			filmCast: "",
			filmSynopsis: "",
			items: []
		};
	},
	
	loadFilmDetails: function(){
		this.doShowSpinner({show: true});
		var url = serviceURL + "/" + this.film.u;
		this.log("Loading Film details from " + url);
		if(this.$.nativeUtils.checkInternetConnection()){
			new enyo.Ajax({url: url, handleAs: "text"}).go().response(this, "gotResults").error(this, "gotFailure");	
		} else{
			this.doShowSpinner({show: false});
		}			
		
	},
	
	cleanString: function(a) {
		return a.replace(/\t/g, "").replace(/^\s+|\s+$/g, '');
	},
	
	gotResults: function(inSender, inResponse, inRequest) {

		//this.log("Fetching...");
		//this.log(arguments);
	
		var myDiv = window.document.createElement("div");
		myDiv.innerHTML = inResponse;
		//this.log("Parsing...");
		this.scheduleListModel.items =  this.parseScheduleData(myDiv);
		this.$.header.setContent(this.scheduleListModel.filmTitle);
		this.$.filmImage.setSrc(this.scheduleListModel.filmImage);
		this.$.filmCert.setSrc(this.scheduleListModel.filmCert);
		this.$.filmTime.setContent("<b>Length:</b> " + this.scheduleListModel.filmTime);
		this.$.filmDirector.setContent("<b>Director:</b> " + this.scheduleListModel.filmDirector);
		this.$.filmCast.setContent("<b>Cast:</b> " + this.scheduleListModel.filmCast);
		this.$.filmSynopsis.setContent(this.scheduleListModel.filmSynopsis);
		
		this.$.list.setCount(this.scheduleListModel.items.length);
		
		this.log("Successfully Loaded " + this.scheduleListModel.items.length + " items");
		this.doShowSpinner({show: false});
     	
     	this.$.scroller.stabilize();
      	this.$.scroller.scrollToTop();
    	
		this.reflow();
	},
	
	gotFailure: function(inSender, inResponse) {
		this.doShowSpinner({show: false});
		this.log("gotFailure");
		this.log(inResponse);
		//this.doError({title: 'Service Error', message: 'Looks like we are having some trouble loading data. Please try again shortly.'});

	},
	
	parseScheduleData: function(xml){

		var filmImageNode = xml.querySelectorAll("img.film_info_image");
	
		if (filmImageNode.length > 0) {
			this.scheduleListModel.filmImage = "http://m.myvue.com/" + this.cleanString(filmImageNode[0].getAttribute("src"));
			this.scheduleListModel.filmTitle = this.cleanString(filmImageNode[0].getAttribute("alt"));
		}

		var filmTrailerNode = xml.querySelectorAll("a#content1_hlTrailer2");
		if(filmTrailerNode.length > 0){
			this.scheduleListModel.filmTrailer =  this.cleanString(filmTrailerNode[0].getAttribute("href"));
			this.$.filmTrailer.setShowing(true);
		} else{
			this.$.filmTrailer.setShowing(false);
		}

    
		var filmInfoNode = xml.querySelectorAll("div.film_info_overlay");
		if (filmInfoNode.length > 0) {
    
			var filmDirectorNode = filmInfoNode[0].querySelectorAll("p:nth-child(4) > span:nth-child(2)");
			if (filmDirectorNode.length > 0) {
				this.scheduleListModel.filmDirector = this.cleanString(filmDirectorNode[0].innerText);
			}
        
			var filmCastNode = filmInfoNode[0].querySelectorAll("p:nth-child(5) > span:nth-child(2)");
			if (filmCastNode.length > 0) {
				this.scheduleListModel.filmCast = this.cleanString(filmCastNode[0].innerText);
			}
        
			var filmTimeNode = filmInfoNode[0].querySelectorAll("p:nth-child(7) > span:nth-child(2)");
			if (filmTimeNode.length > 0) {
				this.scheduleListModel.filmTime = this.cleanString(filmTimeNode[0].innerText);
			}
        
			var filmCertNode = filmInfoNode[0].querySelectorAll("img#content1_imgCert");
			if (filmCertNode.length > 0) {
				this.scheduleListModel.filmCert = "http://m.myvue.com/" + this.cleanString(filmCertNode[0].getAttribute("src"));
			}
		
			var filmSynopsisNode = xml.querySelectorAll("div.film_panel > p");
			if (filmSynopsisNode.length > 0) {
				this.scheduleListModel.filmSynopsis = filmSynopsisNode[0].innerHTML;
			}
		}
    
		var x = xml.querySelectorAll("div#content1_pnlTimes > div.filmListFilm > div.filmListFilmContent");
		var schdule = [];
		if (x.length > 0) {
			var i = 0;
			for (i = 0; i < x.length; i++) {
				var a = x[i];
				var d = a.querySelectorAll("div.filmListFilmName > p");
				var p = a.querySelectorAll("div.filmListFilmInfo > ul > li a");
				if (d.length > 0) {
					var j = 0;
					for (j = 0; j < p.length; j++) {
						var dt = this.cleanString(d[0].innerText);
						var tm = this.cleanString(p[j].innerText);
						var bk = this.cleanString(p[j].getAttribute("href"));
						schdule.push({
							dt: dt,
							tm: tm,
							bk: bk
						});
						//this.log(dt + ' : ' + tm);
					}
				}
			}
		}
		else {
			enyo.log("No Schedule Information found");
		}
		return schdule;
	},
	
	getScheduleItem: function(inSender, inEvent) {
		if(this.scheduleListModel){
			var r = this.scheduleListModel.items[inEvent.index];
			var item = inEvent.item;
			if (r) {
				item.$.date.setContent(r.dt);
				item.$.date.setShowing(this.getDivider(inEvent.index, r));
				item.$.time.setContent(r.tm);
			}		
		}
		return true;
		
	},
	
	getDivider: function(inIndex, currentItem) {
		if(inIndex === 0) {
			return true;
		}
	
		if(inIndex > 0) {
			var previousItem = this.scheduleListModel.items[inIndex-1];
			if(previousItem && previousItem.dt === currentItem.dt) {
				return false;
			}
		}
	
		return true;	
	},
	
    listItemClick: function(inSender, inEvent) {
		var schedule = this.scheduleListModel.items[inEvent.index];
		if(schedule){
			this.log("Selected Time: " + schedule.tm);
			window.open("http://m.myvue.com/" + schedule.bk,'_system');	
		}
    },

    playTrailer: function(inSender, inEvent){
    	if(this.scheduleListModel.filmTrailer){
    		this.log("Playing Trailer at " + this.scheduleListModel.filmTrailer);
    		window.location.replace(this.scheduleListModel.filmTrailer,'_system');		
    	}
    	
    }
});
