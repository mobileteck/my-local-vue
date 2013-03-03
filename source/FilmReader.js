// Copyright 2013, $ORGANIZATION
// All rights reserved.
enyo.kind({
	name: "FilmReader",
	kind: "FittableRows",
	fit: true,
	classes: "enyo-fit dark-scene",
	style: "width: 300px;",
	published: {
		cinema: ""
	},
	events: {
		onSelectFilm: "",
		onShowSpinner: "",
	},
	components: [
		{kind: "onyx.Toolbar", name: "filmHeader", components: [
				{kind: "FittableColumns", content: "fittableColumns", name: "fc20", components: [
						{kind: "Control", content: "Films", name: "cinemaName"}
					]}
			]},
		{kind: "onyx.InputDecorator", name: "id20", components: [
				{kind: "Input", placeholder: "Search Film", name: "filmFilter", onkeyup: "filterInputChange", onchange: "filterInputChange", onclear: "resetFilter"},
				{kind: "Image", src: "assets/search-input-search.png", name: "img20"}
			]},
		{kind: "PulldownList", count: 15, rowsPerPage: 10, strategyKind: "TouchScrollStrategy", classes: "enyo-list", content: "pulldownList", fit: true, controlParentName: "client", name: "list", components: [
				{kind: "Control", classes: "item enyo-border-box", layoutKind: "FittableRowsLayout", name: "filmRow", components: [
						{kind: "Control", classes: "filmTitle", name: "title"},
						{kind: "Control", classes: "filmDescription", name: "description"}
					], ontap: "selectFilm"}
			], onPullRelease: "pullRelease", onPullComplete: "pullComplete", onSetupItem: "getItem"},
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", name: "mt20", noStretch: true, components: [
				{content: "", style: "height: 32px;"},
				{kind: "onyx.Grabber", name: "gr20", ontap: "toggleFullScreen"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.$.filmFilter.applyStyle("width", "255px");
		
		this.filmList = [];
		this.filmFilteredList = [];
		this.selectedFilm = -1;
		
		this.$.list.pullRelease();
		
	},
	
	cinemaChanged: function() {
      this.loadFilmList();
	},
	
	loadFilmList: function(){
		if(this.cinema) {
			this.doShowSpinner({show: true});
			
			this.log("Loading films for cinema " + this.cinema.c);
			
			this.$.cinemaName.setContent("Films at " + this.cinema.c);
			
			
			//var url = "http://m.myvue.com/now-booking.aspx";
			var url = serviceURL + "/now-booking.aspx?cinemaid=" + this.cinema.id;
			this.log("Loading Film list from " + url);
			new enyo.Ajax({url: url, handleAs: "text"}).go().response(this, "gotResults").error(this, "gotFailure");		
		}
		
		
	},
	
	parseFilmData: function(xml){
    
		//this.log(xml);

		//this.log(xml.querySelectorAll("h3").length);
		//this.log(xml.innerText);

        var x = xml.querySelectorAll("table.now-booking");
        var films = [];
        if (x.length > 0) {
			this.log("Found " + x.length + " films at this cinema");
			var i =0;
			for (i = 0; i < x.length; i++) {
				//this.log("parsing " + i);
				var t = x[i].querySelectorAll("h2 > a");
				if(t.length > 0) {
					var y = t[0];
					var title = this.cleanString(y.innerText);
					var url = y.getAttribute("href");
					var synopsis = "";
					var synopsisNode = y.parentNode.nextSibling; 
					if(synopsisNode){
						synopsis = synopsisNode.nodeValue;	
					}
					films.push({
						t: title,
						u: url,
						s: synopsis
					});
					//this.log(title + ' : ' + synopsis + ' : ' + url);
				}
			}
        }else {
			enyo.log("No Film Information found");
        }
        return films;
    },
    
    cleanString: function(a){
        return a.replace(/\t/g, "").replace(/^\s+|\s+$/g, '');
    },
	
	gotResults: function(inSender, inResponse) {
		this.doShowSpinner({show: false});
		//this.log("gotResults");
		var myDiv = window.document.createElement("div");
		myDiv.innerHTML = inResponse;
		
		this.filmList = this.parseFilmData(myDiv);
		this.filmFilteredList = this.filmList;
		this.$.filmFilter.setValue("");
		
		//this.log(this.featuredList);
		if(this.filmList){
			this.$.list.setCount(this.filmList.length);
			this.$.list.completePull();	
			

			if(this.filmFilteredList.length>0) {
    			// Nothing Selected, defaults to first one
    			this.selectedFilm = 0;
    			var film = this.filmFilteredList[0];
				if(film) {
					this.doSelectFilm({"film": film, "clicked": false});	
				}	
    		}
    		this.$.list.reset();
    		this.reflow();

		} else {
			this.log("Error Loading Film List");
			//this.doError({title: 'Service Error', message: 'Looks like we are having some trouble loading data. Please try again shortly.'});
		}
    },

	gotFailure: function(inSender, inResponse) {
		this.doShowSpinner({show: false});
		this.log("gotFailure");
		this.log(inResponse);
		//this.doError({title: 'Service Error', message: 'Looks like we are having some trouble loading data. Please try again shortly.'});

	},


    pullRelease: function(inSender, inEvent) {
		//this.$.list.setCount(10);
		//this.$.list.completePull();	
		//this.$.list.reset();
		this.loadFilmList();
    },
    pullComplete: function(inSender, inEvent) {
        // TODO - Auto-generated code
    },
    getItem: function(inSender, inEvent) {
        var index = inEvent.index;
        
       
        var r = this.filmFilteredList[index];
        
        if(r) {
			this.$.title.setContent(r.t);
			this.$.description.setContent(r.s);	

			if(index === this.selectedFilm) {
			 	this.$.filmRow.addClass("active-row");	
			}else{
				this.$.filmRow.addRemoveClass("active-row");
			}

			return true;				
        }	
        
        return false;
    },
    
    selectFilm: function(inSender, inEvent) {
        var film = this.filmFilteredList[inEvent.rowIndex];
        if(film){
        	this.selectedFilm = inEvent.rowIndex;
			this.log('Selected Film: ' + film.t);
			this.doSelectFilm({"film": film, "clicked": true});	
			this.$.list.refresh();
        }
    },
    
    filterInputChange: function(inSender, inEvent) {
        enyo.job("filterChange", enyo.bind(this, "filterChange"), 400);
    },
    
    filterChange: function() {
		var filterString = this.$.filmFilter.getValue();
		if(filterString) {
			var subset = [];
			var listItems = this.filmList;
			filterString = filterString.toLowerCase();	
			var i = 0;
			while(i < listItems.length) {
				if(listItems[i].t.toLowerCase().indexOf(filterString) >= 0) {
					subset.push(listItems[i]);
				}		
				i++;
			}
			this.filmFilteredList = subset;
			this.$.list.setCount(this.filmFilteredList.length);
			this.$.list.reset();
		} else{
			this.resetFilter();
		}
		
	},

	resetFilter: function(inSender, inEvent) {
		this.filmFilteredList = this.filmList;
		this.$.list.setCount(this.filmFilteredList.length);
        this.$.list.reset();
    }

,
    toggleFullScreen: function(inSender, inEvent) {
        // TODO - Auto-generated code
    }
});